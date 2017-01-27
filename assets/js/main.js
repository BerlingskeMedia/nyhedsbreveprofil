var location_id = 1775;

var newsletterApp = angular.module('newsletter', [
  'ngRoute',
  'ui.bootstrap',
  "checklist-model"
]).factory('UserService', ['$http',
function ($http) {
  function getExternalId () {
    return window.sessionStorage.getItem('ekstern_id');
  }

  function setExternalId (ekstern_id) {
    window.sessionStorage.setItem('ekstern_id', ekstern_id);
  }

  function userExists (trueFalse) {
    if (trueFalse === undefined) {
      var userExists = window.sessionStorage.getItem('userExists');
      return userExists !== null ? userExists : false;
    } else if (typeof trueFalse === 'boolean') {
      window.sessionStorage.setItem('userExists', trueFalse);
    }
  }

  function getDoubleOptKey (double_opt_key) {
    return window.sessionStorage.getItem('double_opt_key');
  }

  function setDoubleOptKey (double_opt_key) {
    window.sessionStorage.setItem('double_opt_key', double_opt_key);
  }

  function removeExternalId (ekstern_id) {
    window.sessionStorage.removeItem('ekstern_id');
  }

  function getBasket () {
    var basket = JSON.parse(window.sessionStorage.getItem('user'));
    return basket !== null ? basket :
    {
      nyhedsbreve: [],
      interesser: [],
      location_id: location_id
    };
  }

  function saveBasket (user) {
    window.sessionStorage.setItem('user', JSON.stringify(user));
  }

  function addToBasket (newsletter) {
    var basket = getBasket();
    basket.nyhedsbreve.push(newsletter);
    window.sessionStorage.setItem('user', JSON.stringify(basket));
  }

  function removeFromBasket (newsletterId) {
    console.log('remove', newsletterId, typeof newsletterId);
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

  function clearBasket () {
    window.sessionStorage.removeItem('user');
  }

  function sendLoginEmail (email) {
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
    userExists: userExists
  };
}]).factory('LoginService', ['$http', '$location', 'UserService',
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
}]).factory('NewsletterService', ['$http', '$sce', function ($http, $sce) {

  var newsletters = [];

  function fetchNewsletters() {
    return $http.get("/backend/nyhedsbreve?orderBy=sort_id&orderDirection=asc")
        .then(function (response) {
      if (response.data) {
        newsletters = response.data;
        newsletters.forEach(function (newsletter) {
          if (newsletter.nyhedsbrev_image === null || newsletter.nyhedsbrev_image === '') {
            newsletter.nyhedsbrev_image = 'http://nlstatic.berlingskemedia.dk/newsletter_logos/' + newsletter.nyhedsbrev_id + '.png';
          }
          newsletter.indhold_safe = $sce.trustAsHtml(newsletter.indhold);
        });
      }
    });
  }

  function getAll() {
    return newsletters;
  }

  function getById(id) {
    console.log(newsletters.length);
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

}]).factory('PublisherService', ['$http', function ($http) {

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

  return {
    fetchPublishers: fetchPublishers,
    getPublishers: getPublishers
  };
}]).config(['$locationProvider', '$routeProvider',
function($locationProvider, $routeProvider) {

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
}]).controller('newsletterController', ['$scope', '$rootScope', '$routeParams', '$http', '$q', '$location', '$sce', 'UserService', 'PublisherService', 'NewsletterService',
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

  var getPublishers = PublisherService.fetchPublishers().then(function() {
    if ($routeParams.publisher) {
      var publisher_exists = PublisherService.getPublishers().some(function (publisher) {
        if ($routeParams.publisher == publisher.publisher_id || angular.lowercase($routeParams.publisher) === angular.lowercase(publisher.publisher_navn)) {
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

  var getNyhedsbreve = NewsletterService.fetchNewsletters().then(function() {
    NewsletterService.getAll().forEach(function (newsletter) {
      if (newsletter.nyhedsbrev_image === null || newsletter.nyhedsbrev_image === '') {
        newsletter.nyhedsbrev_image = 'http://nlstatic.berlingskemedia.dk/newsletter_logos/' + newsletter.nyhedsbrev_id + '.png';
      }
      newsletter.indhold_safe = $sce.trustAsHtml(newsletter.indhold);
    });
  });

  // Filtering the publishers that don't have any newsletters after both
  // request above have completed.
  $q.all([getPublishers,getNyhedsbreve]).then(function () {
    $scope.newsletters = NewsletterService.getAll();
    $scope.publishers = PublisherService.getPublishers().filter(function (publisher) {
      return publisher.hidden === 0 && $scope.newsletters.some(function (newsletter) {
        // We only want to show publishers with enabled and non-hidden newsletters
        return newsletter.enabled === 1 && newsletter.hidden === 0 && newsletter.publisher_id === publisher.publisher_id;
      });
    });
  });

  $scope.setCurrentPublisher = function (publisher) {
    $rootScope.$broadcast('publisher_changed', publisher);
    UserService.setCurrentPublisher(publisher);
    $scope.current_publisher = publisher;
  };

  $scope.toggleSubscription = function (checkbox, newsletterId, newsletterName) {
    if (UserService.isLoggedIn()) {
      var url = '/backend/users/' + UserService.getExternalId() + '/nyhedsbreve/' + newsletterId;

      var request;
      if (checkbox.checked) {
        request = $http.post(url + "?location_id=" + location_id);
      }
      else {
        request = $http.delete(url + "?location_id=" + location_id);
      }
      request.then(function (response) {
        $scope.user.nyhedsbreve = response.data;
        checkbox.$parent.created = checkbox.checked;
        checkbox.$parent.deleted = !checkbox.checked;
      }, function (error) {
        console.error(response);
      });
    } else {
      if (checkbox.checked) {
        UserService.addToBasket({
          nyhedsbrev_id: newsletterId, nyhedsbrev_navn: newsletterName
        });
      } else {
        UserService.removeFromBasket(newsletterId);
      }
    }
  };

  $scope.createProfile = function () {
    if (!UserService.isLoggedIn()) {
      $location.path('opret/profil');
    }
  };
}]).controller('createProfileController', ['$scope', '$routeParams', '$http', '$q', '$location', '$sce', 'UserService', 'NewsletterService',
function ($scope, $routeParams, $http, $q, $location, $sce, UserService, NewsletterService) {

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

  $scope.go_back =  function () {
    UserService.saveBasket($scope.user);
    $location.path('nyhedsbreve');
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
    payload.nyhedsbreve = payload.nyhedsbreve.map(function(newsletter) {
      return newsletter.nyhedsbrev_id;
    });

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
}]).controller('addInterestsController', ['$scope', '$routeParams', '$http', '$q', '$location', 'UserService',
    function ($scope, $routeParams, $http, $q, $location, UserService) {

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
    payload.location_id = location_id;
    payload.interesser = $scope.user.interests_choices;
    $http.post("backend/doubleopt/" + UserService.getDoubleOptKey() +  "/interesser", payload).then(function (response) {
      $location.path('tak');
    }, function (error) {
      console.error(error);
      if (error.status === 404) {
        $scope.doubleoptNotFound = true;
      }
    });
  };

}]).controller('createProfileDoneController', ['$scope', 'UserService',
function ($scope, UserService) {

  $scope.exists = UserService.userExists();

}]).controller('loginController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', 'UserService',
function ($scope, $routeParams, $http, $rootScope, $location, UserService, login) {

  if (UserService.isLoggedIn()) {
    $location.path('nyhedsbreve');
  }

  $scope.send_email = function(email) {
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

}]).controller('editProfileController', ['$scope', '$routeParams', '$http', '$q', '$location', '$sce', 'UserService',
function ($scope, $routeParams, $http, $q, $location, $sce, UserService) {

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

  $q.all([user, interests, permissions]).then(function(resolved) {
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

  $scope.update = function(user) {
    if ($scope.userForm.$invalid) {
      return;
    }

    var payload = angular.copy(user);
    payload.location_id = location_id;

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

  $scope.checkbox_change = function(val, nid, type) {
    var change_url = "/backend/users/" + ekstern_id + "/" + type +"/" + nid + "?location_id=" + location_id;

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

}]).controller('subscriptionsController', ['$scope', '$routeParams', '$http', '$q', '$modal', '$location', '$sce', 'UserService',
function ($scope, $routeParams, $http, $q, $modal, $location, $sce, UserService) {
  $scope.reasons = [
    "I sender for mange mails",
    "Indholdet i jeres mails er ikke relevant for mig",
    "Jeg modtager for mange mails generelt",
    "Jeg har deltaget i en konkurrence, men ønsker ikke at være tilmeldt",
    "Jeg er blevet tilmeldt ved en fejl"];

  function update () {

    var my_newsletters = $http.get("/backend/users/" + UserService.getExternalId());
    var newsletters = $http.get("/backend/nyhedsbreve?orderBy=nyhedsbrev_navn&orderDirection=asc");


    $q.all([newsletters, my_newsletters]).then(function(resolved) {

      $scope.newsletters = resolved[0].data;
      $scope.newsletters.forEach(function (newsletter) {
        if (newsletter.nyhedsbrev_image === null || newsletter.nyhedsbrev_image === '') {
          newsletter.nyhedsbrev_image = 'http://nlstatic.berlingskemedia.dk/newsletter_logos/' + newsletter.nyhedsbrev_id + '.png';
        }
        newsletter.indhold_safe = $sce.trustAsHtml(newsletter.indhold);
      });

      $scope.my_subscriptions = resolved[1].data.nyhedsbreve;

      console.log('tilmeldt:',$scope.my_subscriptions);

      $scope.filtered_newsletters = $scope.newsletters.filter(function (newsletter) {
        if (newsletter.nyhedsbrev_navn.indexOf('_TMP_') > -1) {
          return false;
        } else if ($routeParams.nyhedsbrev_id) {
          return newsletter.nyhedsbrev_id == $routeParams.nyhedsbrev_id;
        } else {
          return $scope.my_subscriptions.indexOf(newsletter.nyhedsbrev_id) !== -1;
        }
      });
    });
  }

  $scope.unsubscribe = function(feedback) {
    if (angular.isUndefined(feedback) || feedback === "") {
      $scope.unsubscribeError = true;
      return;
    }
    $scope.unsubscribeError = false;
    var payload = {};
    payload.location_id = location_id;
    payload.nyhedsbrev_id = $scope.to_unsubscribe.nyhedsbrev_id;
    payload.user_feedback = feedback;
    $http.post("/backend/users/" + UserService.getExternalId() + "/nyhedsbreve/delete", payload ).then(function (response) {

      // If the user has a direct link, he/she will be redirected to the publishers newsletter page
      if ($routeParams.nyhedsbrev_id) {
        $location.path('nyhedsbreve/' + $scope.filtered_newsletters[0].publisher_id);
      } else {
        update();
      }

      $scope.modalInstance.close();
    }, function (error) {
      console.error(error);
      $scope.modalInstance.close();
    });

  };

  $scope.open = function(newsletter) {
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

  $scope.onchange = function(value) {
    $scope.selected_reason = value;
  };

  if (UserService.isLoggedIn()) {
    update();
  } else {
    $location.path('login');
  }
}]).controller('menuController', ['$scope', '$routeParams', '$http', '$q', '$rootScope', '$location', 'UserService',
function ($scope, $routeParams, $http, $q, $rootScope, $location, UserService) {

  $scope.testenvironment = $location.host().indexOf('profil.berlingskemedia.dk') === -1;

  $rootScope.$on('publisher_changed', function(event, newPublisher) {
    var defaultLogo = 'https://s3-eu-west-1.amazonaws.com/nlstatic.berlingskemedia.dk/logos/berlingskemedia.jpg';
    $scope.current_publisher = newPublisher;
    angular.element(document.querySelector('#toppic'))
      .prop('src', newPublisher && newPublisher.publisher_toppic || defaultLogo);

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
}]).controller('confirmController', ['$scope', '$location', '$http', 'UserService',
function ($scope, $location, $http, UserService) {

  var search = $location.search();

  if (!UserService.isLoggedIn() && search.confirm_key !== undefined) {
    $http.post("/backend/doubleopt/" + search.confirm_key + "/confirm?location_id = " + location_id).then(function (response) {
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
