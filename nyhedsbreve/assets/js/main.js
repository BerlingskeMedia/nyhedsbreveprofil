moment.locale('da');

var newsletterApp = angular.module('newsletter', [
  'ngRoute',
  'ui.bootstrap',
  "checklist-model"
])
.constant('LOCATION_ID', 1775)
.constant('DOMAIN_NAME', 'profil.berlingskemedia.dk')
.constant(
  'DEFAULT_LOGO',
  'https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/logos/berlingskemedia.png'
)
.constant('LOGO_PATH', 'http://nlstatic.berlingskemedia.dk/newsletter_logos/')
.factory('UserService', ['$q', '$http', 'PublisherService', 'DEFAULT_LOGO',
    'LOCATION_ID', function ($q, $http, PublisherService, DEFAULT_LOGO,
    LOCATION_ID) {

  function getExternalId () {
    return window.sessionStorage.getItem('ekstern_id');
  }

  function setExternalId(ekstern_id) {
    window.sessionStorage.setItem('ekstern_id', ekstern_id);
  }

  function userExists(trueFalse) {
    if (trueFalse === undefined) {
      var userExists = window.sessionStorage.getItem('userExists');
      return userExists !== null ? userExists : false;
    } else if (typeof trueFalse === 'boolean') {
      window.sessionStorage.setItem('userExists', trueFalse);
    }
  }

  function getDoubleOptKey(double_opt_key) {
    return window.sessionStorage.getItem('double_opt_key');
  }

  function setDoubleOptKey(double_opt_key) {
    window.sessionStorage.setItem('double_opt_key', double_opt_key);
  }

  function removeExternalId(ekstern_id) {
    window.sessionStorage.removeItem('ekstern_id');
  }

  function getBasket() {
    var basket = JSON.parse(window.sessionStorage.getItem('user'));
    return basket !== null ? basket :
    {
      nyhedsbreve: [],
      interesser: [],
      location_id: LOCATION_ID
    };
  }

  function saveBasket(user) {
    window.sessionStorage.setItem('user', JSON.stringify(user));
  }

  function addToBasket(newsletter) {
    var basket = getBasket();
    basket.nyhedsbreve.push(newsletter);
    window.sessionStorage.setItem('user', JSON.stringify(basket));
  }

  function removeFromBasket(newsletterId) {
    var basket = getBasket(),
      idIndex;
    for (var index = 0; index < basket.nyhedsbreve.length; index++) {
      if (basket.nyhedsbreve[index].nyhedsbrev_id === newsletterId) {
        idIndex = index;
        break;
      }
    }
    if (idIndex !== undefined) {
      basket.nyhedsbreve.splice(idIndex, 1);
    }
    window.sessionStorage.setItem('user', JSON.stringify(basket));
  }

  function clearBasket() {
    window.sessionStorage.removeItem('user');
  }

  function sendLoginEmail(email) {
    var payload = {};
    payload.email = email;
    payload.publisher_id = 1;

    return $http.post("/backend/mails/profile-page-link", payload);
  }

  function getCurrentPublisher() {
    return window.sessionStorage.getItem('publisher');
  }

  function setCurrentPublisher(publisher) {
    window.sessionStorage.setItem('publisher', publisher);
  }

  function getData() {
    return $http.get("/backend/users/" + getExternalId());
  }

  function isLoggedIn() {
    return getExternalId() !== null;
  }

  // Pick default logo if there are more than one publisher - otherwise,
  // pick the logo that matches the publisher of the newsletter(s).
  function updateLogo(newPublisher) {

    var basket = getBasket(),
      logo, publisherIds, topPicElem;
    if (basket.nyhedsbreve.length) {
      publisherIds = basket.nyhedsbreve.map(function (newsletter) {
        return newsletter.publisher_id;
      }).sort();
      if (publisherIds.length && publisherIds[0] !== publisherIds[publisherIds.length-1]) {
        logo = DEFAULT_LOGO;
      } else {
        logo = PublisherService.getById(publisherIds[0]).publisher_toppic;
      }
    } else {
      logo = DEFAULT_LOGO;
    }
    topPicElem = angular.element(document.querySelector('#toppic'));
    topPicElem.prop('src', logo);
    // topPicElem.parent().prop('href', newPublisher.publisher_url || '/');

  }

  function toggleSubscription(doEnable, subscriptionObject) {
    var deferred = $q.defer(),
      url = '/backend/users/' + getExternalId() + '/nyhedsbreve/' +
          subscriptionObject.nyhedsbrev_id;

    if (isLoggedIn() && doEnable) {
      $http.post(url + "?location_id=" + LOCATION_ID).then(function (response) {
        deferred.resolve(response);
      }, function (err) {
        deferred.reject(err);
      });
    } else if (!isLoggedIn()) {
      if (doEnable) {
        addToBasket(subscriptionObject);
      } else {
        removeFromBasket(subscriptionObject.nyhedsbrev_id);
      }
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }
    return deferred.promise;
  }

  return {
    getData: getData,
    getExternalId: getExternalId,
    setExternalId: setExternalId,
    getDoubleOptKey: getDoubleOptKey,
    setDoubleOptKey: setDoubleOptKey,
    removeExternalId: removeExternalId,
    isLoggedIn: isLoggedIn,
    getBasket: getBasket,
    saveBasket: saveBasket,
    addToBasket: addToBasket,
    removeFromBasket: removeFromBasket,
    clearBasket: clearBasket,
    sendLoginEmail: sendLoginEmail,
    getCurrentPublisher: getCurrentPublisher,
    setCurrentPublisher: setCurrentPublisher,
    userExists: userExists,
    updateLogo: updateLogo,
    toggleSubscription: toggleSubscription
  };
}])
.factory('LoginService', ['$http', '$location', 'UserService',
function ($http, $location, UserService) {
  return function () {
    var search = $location.search();
    var ekstern_id =
      search.eksternid ? search.eksternid
      : search.ekstern_id ? search.ekstern_id
      : search.userid ? search.userid
      : search.id ? search.id
      : UserService.isLoggedIn() ? UserService.getExternalId()
      : null;

    if (ekstern_id !== null) {
      return $http.get("/backend/users/" + ekstern_id).then(function (response) {

        UserService.setExternalId(ekstern_id);

        $location.search('eksternid', null);
        $location.search('userid', null);
        $location.search('id', null);

      }, function (error) {
        UserService.removeExternalId();
        $location.path('login');
      });
    } else {
      return false; // Provider must return a value from $get factory method.
    }
  }();
}])
.factory('NewsletterService', ['$q', '$http', '$sce', 'LOGO_PATH',
    function ($q, $http, $sce, LOGO_PATH) {

  var newsletters = [];

  function fetchNewsletters() {
    var deferred = $q.defer();
    $http.get("/backend/nyhedsbreve?orderBy=sort_id&orderDirection=asc")
        .then(function (response) {
      if (response.data) {
        newsletters = response.data;
        newsletters.forEach(function (newsletter) {
          if (newsletter.nyhedsbrev_image === null || newsletter.nyhedsbrev_image === '') {
            newsletter.nyhedsbrev_image = LOGO_PATH + newsletter.nyhedsbrev_id + '.png';
          }
          newsletter.indhold_safe = $sce.trustAsHtml(newsletter.indhold);
        });
      }
      deferred.resolve(newsletters);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function getAll() {
    var deferred;
    if (newsletters.length === 0) {
      return fetchNewsletters();
    } else {
      deferred = $q.defer();
      deferred.resolve(newsletters);
      return deferred.promise;
    }
  }

  function getById(id) {
    for (var index = 0; index < newsletters.length; index++) {
      if (newsletters[index].nyhedsbrev_id === id) {
        return newsletters[index];
      }
    }
    return null;
  }

  return {
    fetchNewsletters: fetchNewsletters,
    getAll: getAll,
    getById: getById
  };

}])
.factory('PublisherService', ['$http', function ($http) {

  var publishers = [];

  function fetchPublishers() {
    return $http.get("/backend/publishers?orderBy=publisher_navn&orderDirection=asc")
        .then(function (response) {
      if (response.data) {
        publishers = response.data;
      }
    });
  }

  function getPublishers() {
    return publishers;
  }

  function getById(publisherId) {
    for (var index = 0; index < publishers.length; index++) {
      if (publishers[index].publisher_id === publisherId) {
        return publishers[index];
      }
    }
    return null;
  }

  return {
    fetchPublishers: fetchPublishers,
    getPublishers: getPublishers,
    getById: getById
  };
}])
.config(['$locationProvider', '$routeProvider',
function ($locationProvider, $routeProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/faq', {
      templateUrl: 'assets/partials/faq.html',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/kontakt', {
      templateUrl: 'assets/partials/contact.html',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/login/:id?', {
      templateUrl: 'assets/partials/login.html',
      controller: 'loginController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/tilmeldt/:nyhedsbrev_id?', {
      templateUrl: 'assets/partials/subscriptions.html',
      controller: 'subscriptionsController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/nyhedsbreve/:publisher?', {
      templateUrl: 'assets/partials/newletters.html',
      controller: 'newsletterController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/oplysninger/:tab?', {
      templateUrl: 'assets/partials/editProfile.html',
      controller: 'editProfileController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/interesser', {
      redirectTo: '/oplysninger/interesser'
    }).
    when('/kontaktsamtykker', {
      redirectTo: '/oplysninger/kontaktsamtykker'
    }).
    when('/opret/profil', {
      templateUrl: 'assets/partials/createProfile.html',
      controller: 'createProfileController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/opret/interesser', {
      templateUrl: 'assets/partials/addInterests.html',
      controller: 'addInterestsController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/tak', {
      templateUrl: 'assets/partials/createProfileDone.html',
      controller: 'createProfileDoneController'
    }).
    when('/opret/tak', {
      templateUrl: 'assets/partials/createProfileDone.html',
      controller: 'createProfileDoneController'
    }).
    when('/bekraeft', {
      templateUrl: 'assets/partials/createProfileConfirmed.html',
      controller: 'confirmController'
    }).
    otherwise({
      resolve: {
        login: 'LoginService'
      },
      redirectTo: '/nyhedsbreve'
    });
}])
.controller('newsletterController', ['$scope', '$rootScope', '$routeParams', '$http', '$q', '$location', '$sce', 'UserService', 'PublisherService', 'NewsletterService',
function ($scope, $rootScope, $routeParams, $http, $q, $location, $sce, UserService, PublisherService, NewsletterService) {

  $scope.loggedIn = UserService.isLoggedIn();

  if ($scope.loggedIn) {
    UserService.getData().then(function (response) {
      $scope.user = response.data;
    }, function (error) {
      console.error(error);
      $location.path('login');
    });
  } else {
    $scope.user = UserService.getBasket();
  }

  $scope.h1_prefix = 'Alle ';

  function publisherNameToSlug(publisher_navn){
    return publisher_navn.toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text;
  }

  var getPublishers = PublisherService.fetchPublishers()
  .then(function () {
    if ($routeParams.publisher) {
      var publisher_exists = PublisherService
      .getPublishers()
      .some(function (publisher) {
        if ($routeParams.publisher == publisher.publisher_id 
          || $routeParams.publisher.toLowerCase() === publisher.publisher_navn.toLowerCase()
          || $routeParams.publisher.toLowerCase() === publisherNameToSlug(publisher.publisher_navn)) {
          $scope.setCurrentPublisher(publisher);
          $scope.h1_prefix = publisher.publisher_navn + ' ';
          return true;
        } else {
          return false;
        }
      });
      if (!publisher_exists) {
        $location.path('nyhedsbreve');
      }
    } else {
      PublisherService.getPublishers().forEach(function (publisher) {
        if (publisher.publisher_navn === 'Berlingske') {
          $scope.setCurrentPublisher(publisher);
        }
      });
      if ($scope.current_publisher === undefined) {
        $scope.setCurrentPublisher($scope.publishers[0]);
      }
      $scope.show_publisher_selector = true;
    }
  });

  var getNyhedsbreve = NewsletterService.getAll().then(function (newsletters) {
    newsletters.forEach(function (newsletter) {
      if (newsletter.nyhedsbrev_image === null || newsletter.nyhedsbrev_image === '') {
        newsletter.nyhedsbrev_image = 'http://nlstatic.berlingskemedia.dk/newsletter_logos/' + newsletter.nyhedsbrev_id + '.png';
      }
      newsletter.indhold_safe = $sce.trustAsHtml(newsletter.indhold);
    });
  });

  // Filtering the publishers that don't have any newsletters after both
  // request above have completed.
  $q.all([getPublishers,getNyhedsbreve]).then(function () {
    NewsletterService.getAll().then(function (newsletters) {
      $scope.newsletters = newsletters;
    }).then(function () {
      $scope.publishers = PublisherService.getPublishers().filter(function (publisher) {
        return publisher.hidden === 0 && $scope.newsletters.some(function (newsletter) {
          // We only want to show publishers with enabled and non-hidden newsletters
          return newsletter.enabled === 1 &&
            newsletter.hidden === 0 &&
            newsletter.publisher_id === publisher.publisher_id;
        });
      });
    });
  });

  $scope.setCurrentPublisher = function (publisher) {
    $rootScope.$broadcast('publisher_changed', publisher);
    UserService.setCurrentPublisher(publisher);
    $scope.current_publisher = publisher;
  };

  $scope.compareNewsletters = function (letterOne, letterTwo) {
    if (typeof letterOne === 'object') {
      return letterOne.nyhedsbrev_id === letterTwo.nyhedsbrev_id;
    } else if (typeof letterOne === 'number') {
      return letterOne === letterTwo.nyhedsbrev_id;
    } else {
    }
    return false;
  };

  $scope.toggleSubscription = function (checkbox, newsletterId, newsletterName,
      publisherId) {

    if ($scope.loggedIn && !checkbox.checked){
      return;
    }

    UserService.toggleSubscription(checkbox.checked, {
      nyhedsbrev_id: newsletterId,
      nyhedsbrev_navn: newsletterName,
      publisher_id: publisherId
    }).then(function (response) {
      if (angular.isObject(response)) {
        $scope.user.nyhedsbreve = response.data;
        checkbox.$parent.created = checkbox.checked;
        checkbox.$parent.deleted = !checkbox.checked;
      }
      if (!$scope.loggedIn) {
        UserService.updateLogo(PublisherService.getById(publisherId));
      }
    }, function (err) {
      console.error(err);
    });
  };

  $scope.createProfile = function () {
    if (UserService.getBasket().nyhedsbreve.length > 0 &&
        !UserService.isLoggedIn()) {
      $location.path('opret/profil');
    }
  };

}])
.controller('createProfileController', ['$scope', '$routeParams', '$http', '$q',
    '$location', '$sce', 'UserService', 'NewsletterService', 'PublisherService',
    function ($scope, $routeParams, $http, $q, $location, $sce, UserService,
    NewsletterService, PublisherService) {

  if (UserService.isLoggedIn()) {
    $location.path('oplysninger');
  } else {
    $scope.user = UserService.getBasket();
  }

  // Assign those newsletters to $scope which are in the basket.
  $scope.newsletters = UserService.getBasket().nyhedsbreve;

  $http.get("/backend/nyhedsbreve?permission=1&orderBy=sort_id&orderDirection=asc")
      .then(function (response) {
    $scope.permissions = response.data;
    $scope.permissions.forEach(function (permission) {
      permission.indhold_safe = $sce.trustAsHtml(permission.indhold);
    });
  });

  $scope.go_back = function () {

    UserService.saveBasket($scope.user);
    $location.path('nyhedsbreve');

  };

  $scope.toggleSubscription = function (checkbox, newsletterId, newsletterName,
      publisherId) {

    UserService.toggleSubscription(checkbox.checked, {
      nyhedsbrev_id: newsletterId,
      nyhedsbrev_navn: newsletterName,
      publisher_id: publisherId
    }).then(function (response) {
      if (angular.isObject(response)) {
        $scope.user.nyhedsbreve = response.data;
        checkbox.$parent.created = checkbox.checked;
        checkbox.$parent.deleted = !checkbox.checked;
      }
      UserService.updateLogo(PublisherService.getById(publisherId));
    }, function (err) {
      console.log(err);
    });

  };

  $scope.submit = function () {

    if ($scope.userForm.$invalid) {
      return;
    }

    var payload = angular.copy($scope.user);

    if (!payload.postnummer_dk) {
      delete $scope.user.postnummer_dk;
    }

    if (payload.foedselsaar) {
      payload.foedselsaar = $scope.user.foedselsaar.toString();
    } else {
      delete payload.foedselsaar;
    }

    // Convert "nyhedsbreve" back ito array of id's before making API request.
    payload.nyhedsbreve = payload.nyhedsbreve.map(function (newsletter) {
      return angular.isObject(newsletter) ? newsletter.nyhedsbrev_id : newsletter;
    }).filter(Boolean);

    $http.post("/backend/doubleopt", payload).then(function (response) {
      UserService.setDoubleOptKey(response.data.double_opt_key);
      $location.path('opret/interesser');
    }, function (error) {
      if (error.status === 409) {
        UserService.clearBasket();
        UserService.userExists(true);
        if (error.data.double_opt_key) {
          UserService.setDoubleOptKey(error.data.double_opt_key);
        }
        $location.path('tak');
      } else {
        console.error('create_user error', error);
      }
    });
  };
}])
.controller('addInterestsController', ['$scope', '$routeParams', '$http', '$q',
    '$location', 'UserService', 'LOCATION_ID', function ($scope, $routeParams,
    $http, $q, $location, UserService, LOCATION_ID) {

  // Assign those newsletters to $scope which are in the basket.
  $scope.newsletters = UserService.getBasket().nyhedsbreve;
  UserService.clearBasket();

  if (UserService.getDoubleOptKey() === null) {
    $location.path('opret/profil');
  }

  $http.get("/backend/interesser?displayTypeId=3&toplevels=1").then(function (response) {
    $scope.interests = response.data;
  });

  $scope.submit = function () {
    var payload = {};
    payload.location_id = LOCATION_ID;
    // Allow user to continue to "tak" page without picking interests.
    if ($scope.user && !$scope.user.interests_choices) {
      payload.interesser = $scope.user.interests_choices;
      $http.post("backend/doubleopt/" + UserService.getDoubleOptKey() +  "/interesser", payload).then(function (response) {
        $location.path('tak');
      }, function (error) {
        console.error(error);
        if (error.status === 404) {
          $scope.doubleoptNotFound = true;
        }
      });
    } else {
      $location.path('tak');
    }
  };

}])
.controller('createProfileDoneController', ['$scope', 'UserService',
function ($scope, UserService) {

  $scope.exists = UserService.userExists();

}])
.controller('loginController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', 'UserService',
function ($scope, $routeParams, $http, $rootScope, $location, UserService, login) {

  if (UserService.isLoggedIn()) {
    $location.path('nyhedsbreve');
  }

  $scope.send_email = function (email) {
    if (!$scope.loginForm.$valid) {
      return;
    }
    if ($scope.success) {
      return;
    }

    UserService.sendLoginEmail(email).then( function (response) {
      $scope.success = true;
    });
  };

}])
.controller('editProfileController', ['$scope', '$routeParams', '$http', '$q',
    '$location', '$sce', 'UserService', 'LOCATION_ID', function ($scope,
    $routeParams, $http, $q, $location, $sce, UserService, LOCATION_ID) {

  if (!UserService.isLoggedIn()) {
    return $location.path('login');
  }

  var ekstern_id = UserService.getExternalId();
  var user = $http.get("/backend/users/" + ekstern_id);
  var interests = $http.get("/backend/interesser?displayTypeId=3&toplevels=1");
  var permissions = $http.get("/backend/nyhedsbreve?permission=1&orderBy=sort_id&orderDirection=asc");

  if (!validTab($routeParams.tab)) {
    $location.path('oplysninger');
  }

  $scope.tab = $routeParams.tab ? $routeParams.tab : 'kontakt';

  $q.all([user, interests, permissions]).then(function (resolved) {
    $scope.user = resolved[0].data;
    $scope.user.postnummer_dk = parseInt($scope.user.postnummer_dk);
    if ($scope.user.postnummer_dk === 0) {
      $scope.user.postnummer_dk = NaN;
    }
    $scope.user.foedselsaar = parseInt($scope.user.foedselsaar);
    if ($scope.user.foedselsaar === 0) {
      $scope.user.foedselsaar = NaN;
    }
    $scope.interests = resolved[1].data;
    $scope.permissions = resolved[2].data;
    $scope.permissions.forEach(function (permission) {
      permission.indhold_safe = $sce.trustAsHtml(permission.indhold);
    });
  });

  $scope.setTab = function (tab) {
    if (validTab(tab)) {
      $scope.tab = tab;
      $location.path('oplysninger/' + tab);
    } else {
      $scope.tab = 'kontakt';
      $location.path('oplysninger');
    }
  };

  function validTab (tab) {
    return ['kontakt','interesser','kontaktsamtykker'].indexOf(tab) > -1;
  }

  $scope.update = function (user) {
    if ($scope.userForm.$invalid) {
      return;
    }

    var payload = angular.copy(user);
    payload.location_id = LOCATION_ID;

    if (user.foedselsaar !== null) {
      payload.foedselsaar = user.foedselsaar.toString();
    }

    if (user.postnummer_dk !== null) {
      payload.postnummer_dk = user.postnummer_dk.toString();
    }

    $http.post("/backend/users/" + ekstern_id, payload).then(function (response) {
      $scope.profileSaveSuccess = true;
      ekstern_id = response.data.ekstern_id;
      UserService.setExternalId(ekstern_id);
    }, function (error) {
      console.error(error);
      $scope.profileSaveError = true;
    });
  };

  $scope.checkbox_change = function (val, nid, type) {
    var change_url = "/backend/users/" + ekstern_id + "/" + type +"/" + nid + "?location_id=" + LOCATION_ID;

    var method;
    if (val.checked) {
      method = $http.post(change_url);
    }
    else {
      method = $http.delete(change_url);
    }
    method.then(function (response) {
      if (type === 'nyhedsbreve') {
        $scope.permissionSaveSuccess = true;
        $scope.user.nyhedsbreve = response.data;
      }
      if (type === 'permissions') {
        $scope.permissionSaveSuccess = true;
        $scope.user.permissions = response.data;
      }
      if (type === 'interesser') {
        $scope.user.interesser = response.data;
        $scope.interestsSaveSuccess = true;
      }
    }, function (error) {
      console.error("Change error", error);
    });
  };

}])
.controller('subscriptionsController', ['$scope', '$routeParams', '$http', '$q',
    '$modal', '$location', '$sce', 'UserService', 'LOCATION_ID',
    function ($scope, $routeParams, $http, $q, $modal, $location, $sce,
    UserService, LOCATION_ID) {

  $scope.reasons = [
    "I sender for mange mails",
    "Indholdet i jeres mails er ikke relevant for mig",
    "Jeg modtager for mange mails generelt",
    "Jeg har deltaget i en konkurrence, men ønsker ikke at være tilmeldt",
    "Jeg er blevet tilmeldt ved en fejl"];


  function update () {

    // var user_request = $http.get("/backend/users/" + UserService.getExternalId());

    UserService.getData().then(function(response) {
      
      var user = response.data;

      if ($routeParams.nyhedsbrev_id) {

        $scope.looking_at_one_newsletter = true;
         var foundNewsletter = user.signups.find(function(signup) {
          return signup.id == $routeParams.nyhedsbrev_id;
        });

        if (foundNewsletter) {

          $scope.is_subscribed_to_the_one_newsletter = true;
          image_and_safe_indhold(foundNewsletter);
          $scope.newsletter = foundNewsletter;

        } else {

          $http.get("/backend/nyhedsbreve/".concat($routeParams.nyhedsbrev_id))
          .then(function(response) {
            foundNewsletter = response.data;
            foundNewsletter.id = foundNewsletter.nyhedsbrev_id;
            foundNewsletter.navn = foundNewsletter.nyhedsbrev_navn;
            image_and_safe_indhold(foundNewsletter);
            $scope.newsletter = foundNewsletter;
          })
          .catch(function(err) {
            $location.path('tilmeldt/');
          });
        }

      } else {

        $scope.looking_at_one_newsletter = false;
        $scope.newsletters = user.signups;
        $scope.newsletters.forEach(image_and_safe_indhold);

      }

      function image_and_safe_indhold(newsletter){
        if(newsletter.signup_dato) {
          newsletter.signup_dato_fromNow = moment(newsletter.signup_dato).fromNow()
        }
        newsletter.indhold_safe = $sce.trustAsHtml(newsletter.indhold);
      }

    }, function (err){
      console.error('err', err);
      if (err.status === 404){
        $location.path('tilmeldt/');
      } else {
        console.error(err);
        $location.path('login');
      }
    });
  };

  $scope.subscribe = function(newsletter) {
    $http.post("/backend/users/" + UserService.getExternalId() + "/nyhedsbreve/" + newsletter.id + '?location_id=' + LOCATION_ID , null).then(function (response) {
      $scope.is_subscribed_to_the_one_newsletter = true;
    }, function (error) {
      console.error(error);
    });

  }

  $scope.unsubscribe = function (feedback) {
    if (angular.isUndefined(feedback) || feedback === "") {
      $scope.unsubscribeError = true;
      return;
    }
    $scope.unsubscribeError = false;
    var payload = {};
    payload.location_id = LOCATION_ID;
    payload.nyhedsbrev_id = $scope.to_unsubscribe.id;
    payload.user_feedback = feedback;
    $http.post("/backend/users/" + UserService.getExternalId() + "/nyhedsbreve/delete", payload ).then(function (response) {

      // If the user has a direct link, he/she will be redirected to the publishers newsletter page
      if ($scope.looking_at_one_newsletter && $scope.newsletter) {
        $location.path('nyhedsbreve/' + $scope.newsletter.publisher_id);
      } else {
        update();
      }

      $scope.modalInstance.close();
    }, function (error) {
      console.error(error);
      $scope.modalInstance.close();
    });

  };

  $scope.open = function (newsletter) {
    $scope.to_unsubscribe = newsletter;
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'modal.html',
      size: 'lg',
      scope: $scope
    });
    $scope.modalInstance = modalInstance;
  };

  $scope.close = function () {
    $scope.modalInstance.close();
  };

  $scope.onchange = function (value) {
    $scope.selected_reason = value;
  };

  if (UserService.isLoggedIn()) {
    update();
  } else {
    $location.path('login');
  }
}])
.controller('menuController', ['$scope', '$routeParams', '$http', '$q',
    '$rootScope', '$location', 'UserService', 'LOCATION_ID', 'DOMAIN_NAME',
    function ($scope, $routeParams, $http, $q, $rootScope, $location,
      UserService, LOCATION_ID, DOMAIN_NAME) {

  $scope.testenvironment = $location.host().indexOf(DOMAIN_NAME) === -1;

  $rootScope.$on('publisher_changed', function (event, newPublisher) {
    $scope.current_publisher = newPublisher;
  });

  $scope.$on('$routeChangeSuccess', function () {
    $scope.loggedIn = UserService.isLoggedIn();
    if ($scope.loggedIn) {
      $scope.ekstern_id = UserService.getExternalId();
      UserService.getData().then(function (user) {
        $scope.email = user.data.email;
      });
    }
  });
}])
.controller('confirmController', ['$scope', '$location', '$http', 'UserService', 'LOCATION_ID',
function ($scope, $location, $http, UserService, LOCATION_ID) {

  var search = $location.search();

  if (!UserService.isLoggedIn() && search.confirm_key !== undefined) {
    $http.post("/backend/doubleopt/" + search.confirm_key + "/confirm?location_id=" + LOCATION_ID).then(function (response) {
      var user = response.data;
      UserService.setExternalId(user.ekstern_id);
      $location.search('success', true);
    }, function (error) {
      console.error(error);
      $scope.invalid_link = true;
    });
  } else if (search.success) {
    $scope.success = true;
  } else {
    $location.path('login');
  }
}]);
