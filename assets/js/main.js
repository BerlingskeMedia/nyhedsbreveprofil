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

  function removeExternalId (ekstern_id) {
    window.sessionStorage.removeItem('ekstern_id');
  }

  function getBasket () {
    return JSON.parse(window.sessionStorage.getItem('basket'));
    console.log('getBasket', JSON.parse(window.sessionStorage.getItem('basket')));
  }

  function saveBasket (data) {
    console.log('saveBasket', data);
    window.sessionStorage.setItem('basket', JSON.stringify(data));
  }

  function clearBasket () {
    window.sessionStorage.removeItem('basket');
  }

  function sendLoginEmail (email) {

    var payload = {};
    payload.email = email;
    payload.publisher_id = 1;

    return $http.post("/backend/mails/profile-page-link", payload);
  }

  return {
    getData: function () {
      return $http.get("/backend/users/" + getExternalId());
    },
    getExternalId: getExternalId,
    setExternalId: setExternalId,
    removeExternalId: removeExternalId,
    isLoggedIn: function () {
      return getExternalId() !== null;
    },
    getBasket: getBasket,
    saveBasket: saveBasket,
    clearBasket: clearBasket,
    sendLoginEmail: sendLoginEmail
  };
}]).factory('LoginService', ['$http', '$location', 'UserService',
function ($http, $location, UserService) {
  return function () {

    var search = $location.search();
    var ekstern_id =
      UserService.isLoggedIn() ? UserService.getExternalId()
      : search.eksternid ? search.eksternid
      : search.userid ? search.userid
      : search.id ? search.id
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
      return false;
    }
  }();
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
      templateUrl: 'assets/partials/edit.html',
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
      templateUrl: 'assets/partials/profile.html',
      controller: 'editProfileController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/opret/profil', {
      templateUrl: 'assets/partials/opret_step2.html',
      controller: 'newsletterController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/opret/interesser', {
      templateUrl: 'assets/partials/opret_step3.html',
      controller: 'newsletterController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/opret/tak', {
      templateUrl: 'assets/partials/opret_step4.html',
      controller: 'newsletterController',
      resolve: {
        login: 'LoginService'
      }
    }).
    otherwise({
      redirectTo: '/nyhedsbreve'
    });
}]).controller('newsletterController', ['$scope', '$routeParams', '$http', '$q', '$location', 'UserService',
function ($scope, $routeParams, $http, $q, $location, UserService) {

  $scope.user = {
    email: '',
    nyhedsbreve: [],
    interesser: [],
    location_id: location_id
  };

  $scope.loggedIn = UserService.isLoggedIn();

  if ($scope.loggedIn) {
    if ($location.path().indexOf('/opret') === 0) {
      return $location.path('oplysninger');
    }

    UserService.getData().then(function (response) {
      if (response.status === 200) {
        $scope.user = response.data;
      } else {
        $location.path('login');
      }
    });
  } else {
    var basket = UserService.getBasket();
    if (basket !== null) {
      $scope.user = basket;
    }
  }

  var publishers = $http.get("/backend/publishers?orderBy=publisher_navn&orderDirection=asc"); // newsletters
  var newsletters = $http.get("/backend/nyhedsbreve?orderBy=sort_id&orderDirection=asc"); // newsletters
  var permissions = $http.get("/backend/nyhedsbreve?permission=1&orderBy=sort_id&orderDirection=asc"); // opret_step2
  var interests = $http.get("/backend/interesser"); // opret_step3
  var to_resolve = [publishers, newsletters, permissions, interests];

  $q.all(to_resolve).then(function(resolved) {
    $scope.publishers = resolved[0].data;
    $scope.newsletters = resolved[1].data;
    $scope.permissions = resolved[2].data;
    $scope.interests = resolved[3].data;

    if ($routeParams.publisher) {
      $scope.publishers.forEach(function (publisher) {
        if ($routeParams.publisher == publisher.publisher_id) {
          $scope.current_publisher = publisher;
        }
      });
    }

    if ($scope.current_publisher === undefined) {
      $scope.current_publisher = $scope.publishers[0];
    }

    $scope.newsletters.forEach(function (newsletter) {
      newsletter.logo_url = 'http://nlstatic.berlingskemedia.dk/newsletter_logos/' + newsletter.newsletter_id + '.png';
    });
  });

  $scope.toggleSubscription = function(checkbox, nyhedsbrev_id) {
    if (UserService.isLoggedIn()) {
      var url = "/backend/users/" + UserService.getExternalId() + '/nyhedsbreve/' + nyhedsbrev_id;

      var request;
      if (checkbox.checked) {
        request = $http.post(url +"?location_id=" + location_id);
      }
      else {
        request = $http.delete(url);
      }
      request.then(function (response) {
        $scope.user.nyhedsbreve = response.data;
        checkbox.$parent.created = checkbox.checked;
        checkbox.$parent.deleted = !checkbox.checked;
      }, function (error) {
        console.error(response);
      });
    } else {
      console.log('before', $scope.user)
      UserService.saveBasket($scope.user);
      console.log('after', $scope.user)
    }
  };

  $scope.submit_step1 = function () {
    if (!UserService.isLoggedIn()) {
      UserService.saveBasket($scope.user);
      $location.path('opret/profil')
    }
  };

  $scope.submit_step2 = function () {
    if ($scope.userForm.$invalid) {
      return;
    }
    if (!$scope.user.postnummer_dk) {
      delete $scope.user.postnummer_dk;
    }
    if (!$scope.user.foedselsaar) {
      delete $scope.user.foedselsaar;
    }
    if ($scope.user.foedselsaar) {
      $scope.user.foedselsaar = $scope.user.foedselsaar.toString();
    }

    $http.post("/backend/users", $scope.user).then(function (response) {
      // $scope.state = "step3";
      $location.path('opret/interesser');
      UserService.setExternalId(response.data.ekstern_id);
      UserService.clearBasket();
    }, function (error) {
      console.error('create_user error', error);
      if (error.status === 409) {
        $scope.userExists = true;
      }
    });
  };

  $scope.send_login = function () {
    UserService.sendLoginEmail($scope.user.email).then( function (response) {
      $scope.emailSent = true;
    });
  };

  $scope.submit_step3 = function () {
    var payload = {};
    payload.location_id = location_id;
    payload.interesser = $scope.user.interests_choices;
    $http.post("backend/users/" + UserService.getExternalId() +  "/interesser", payload).then(function (response) {
      $location.path('opret/tak')
    }, function (error) {
      console.error(error);
    });
  };
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

}]).controller('editProfileController', ['$scope', '$routeParams', '$http', '$q', '$location', 'UserService',
function ($scope, $routeParams, $http, $q, $location, UserService) {

  if (!UserService.isLoggedIn()) {
    return $location.path('login');
  }

  var ekstern_id = UserService.getExternalId();
  var user = $http.get("/backend/users/" + ekstern_id);
  var newsletters = $http.get("/backend/users/" + ekstern_id + "/nyhedsbreve");
  var interests = $http.get("/backend/interesser");
  var permissions = $http.get("/backend/nyhedsbreve?permission=1");

  $scope.tab = $routeParams.tab ? $routeParams.tab : 'details';

  $q.all([user, newsletters, interests, permissions]).then(function(resolved) {
    $scope.user = resolved[0].data;
    $scope.user.postnummer = parseInt($scope.user.postnummer);
    $scope.user.foedselsaar = parseInt($scope.user.foedselsaar);
    $scope.newsletters = resolved[1].data;
    $scope.interests = resolved[2].data;
    $scope.permissions = resolved[3].data;
  });

  $scope.update = function(user) {
    if ($scope.userForm.$invalid) {
      return;
    }

    var payload = angular.copy(user);
    payload.location_id = location_id;
    delete payload.interesser;
    delete payload.nyhedsbreve;
    delete payload.email;

    if (user.foedselsaar) {
      payload.foedselsaar = user.foedselsaar.toString();
    } else {
      delete payload.foedselsaar;
    }
    
    if (user.postnummer !== null) {
      payload.postnummer = user.postnummer.toString();
    }

    $http.put("/backend/users/" + ekstern_id, payload).then(function (response) {
      $scope.profileSaveSuccess = true;
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
      if (type === 'interesser') {
        $scope.user.interesser = response.data;
        $scope.interestsSaveSuccess = true;
      }
    }, function (error) {
      console.error("Change error", error);
    });
  };

}]).controller('subscriptionsController', ['$scope', '$routeParams', '$http', '$q', '$modal', '$location', 'UserService',
function ($scope, $routeParams, $http, $q, $modal, $location, UserService) {
  $scope.reasons = [
    "I sender for mange mails",
    "Indholdet i jeres mails er ikke relevant for mig",
    "Jeg modtager for mange mails generelt",
    "Jeg har deltaget i en konkurrence, men ønsker ikke at være tilmeldt",
    "Jeg er blevet tilmeldt ved en fejl"];

  function update () {

    var my_newsletters = $http.get("/backend/users/" + UserService.getExternalId() + "/nyhedsbreve");
    var newsletters = $http.get("/backend/nyhedsbreve");


    $q.all([newsletters, my_newsletters]).then(function(resolved) {

      $scope.newsletters = resolved[0].data;
      $scope.my_subscriptions = resolved[1].data;

      console.log($scope.my_subscriptions);

      $scope.filtered_newsletters = $scope.newsletters.filter(function (newsletter) {
        return $scope.my_subscriptions.indexOf(newsletter.nyhedsbrev_id) !== -1;
      });

      var nyhedsbrev_id = $routeParams.nyhedsbrev_id;
      if (nyhedsbrev_id) {
        var found = $scope.filtered_newsletters.some(function (el) {
          return el.nyhedsbrev_id == nyhedsbrev_id;
        });
        if (found) {
          $scope.filtered_newsletters = $scope.filtered_newsletters.filter(function (newsletter) {
            return newsletter.nyhedsbrev_id == nyhedsbrev_id;
          });
        }
      }
    });
  };

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
    $http.post("/backend/users/" + UserService.getExternalId() + "/nyhedsbreve/delete", payload ).success(function(data, status, headers, config) {
      update();
      $scope.modalInstance.close();
    }).
    error(function(data, status, headers, config) {
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

  $scope.onchange = function(value) {
    $scope.selected_reason = value;
  };


  if (UserService.isLoggedIn()) {
    update();
  } else {
    $location.path('login');
  }
}]).controller('MenuController', ['$scope', '$routeParams', '$http', '$q', '$rootScope', '$location', 'UserService',
function ($scope, $routeParams, $http, $q, $rootScope, $location, UserService) {
  $scope.$on('$routeChangeSuccess', function () {
    $scope.loggedIn = UserService.isLoggedIn();
    if ($scope.loggedIn) {
      $scope.ekstern_id = UserService.getExternalId();
      UserService.getData().then(function (user) {
        $scope.email = user.data.email;
      });
    }
  });
}]);
