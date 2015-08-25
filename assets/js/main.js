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

  return {
    getData: function () {
      return $http.get("/backend/users/" + getExternalId());
    },
    getExternalId: getExternalId,
    setExternalId: setExternalId,
    isLoggedIn: function () {
      return getExternalId() !== null;
    }
  };
}]).factory('LoginService', ['$http', '$location', 'UserService',
function ($http, $location, UserService) {
  return function () {

    var search = $location.search();
    if (search.eksternid || search.id || search.userid) {

      var ekstern_id = search.eksternid ? search.eksternid : search.id ? search.id : search.userid;

      return $http.get("/backend/users/" + ekstern_id).then(function (response) {
        if (response.status === 200 && response.data) {
          UserService.setExternalId(ekstern_id);
        } else {
          // TODO: Perhaps do nothing but show that user was not found. (invalid link). Try the "send email" opstion
        }
      });

      $location.search('eksternid', null);
      $location.search('id', null);
      $location.search('userid', null);
    } else {
      // var p = $q.defer();
      // return p.promise;
      // p.reject();
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
    when('/tilmeldt/:nid?', {
      templateUrl: 'assets/partials/edit.html',
      controller: 'subscriptionsController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/oplysninger/:tab?', {
      templateUrl: 'assets/partials/profile.html',
      controller: 'profileController',
      resolve: {
        login: 'LoginService'
      }
    }).
    when('/nyhedsbreve/:id?', {
      templateUrl: 'assets/partials/newletters.html',
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

  if (UserService.isLoggedIn()) {
    $http.get("/backend/users/" + UserService.getExternalId()).then(function (response) {
      if (response.status === 200) {
        $scope.user = response.data;
        $scope.loggedIn = true;
      }
    });
  }

  $scope.state = "step1";

  var publishers = $http.get("/backend/publishers");
  var newsletters = $http.get("/backend/nyhedsbreve");
  var interests = $http.get("/backend/interesser");
  var permissions = $http.get("/backend/nyhedsbreve?permission=1");
  var to_resolve = [publishers, newsletters, interests, permissions];

  $q.all(to_resolve).then(function(resolved) {
    $scope.publishers = resolved[0].data;
    $scope.newsletters = resolved[1].data;
    $scope.interests = resolved[2].data;
    $scope.permissions = resolved[3].data;
    //TODO use param from path
    $scope.current_publisher = $scope.publishers[15];
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
        console.log(response);
        if (response.status === 200) {
          $scope.user.nyhedsbreve = response.data;
          checkbox.$parent.created = checkbox.checked;
          checkbox.$parent.deleted = !checkbox.checked;
        } else {
          console.error(error);
        }
      });
    } else {
      // Continue here!
      console.log($scope.user)
    }
  };

  $scope.submit_step1 = function () {
    if (!angular.isUndefined($scope.user) && false) {
      var my_id = $scope.user.ekstern_id;
      console.log($scope.user);
      $scope.user.location_id = location_id;
      $http.put("/backend/users/" + my_id, $scope.user).success(function(data, status, headers, config) {

        $location.path("/profile/" + my_id);
      }).
      error(function(data, status, headers, config) {
        $location.path("/");
      });

    }

    $scope.state = "step2";
  };

  $scope.post_user = function(user) {
    if ($scope.userForm.$invalid) {
      return;
    }
    if (!user.postnummer_dk) {
      delete user.postnummer_dk;
    }
    if (!user.foedselsaar) {
      delete user.foedselsaar;
    }
    if (user.foedselsaar) {
      user.foedselsaar = user.foedselsaar.toString();
    }
    // TODO handle location id
    user.location_id = location_id;

    $http.post("/backend/users", user).
    success(function(data, status, headers, config) {
      $scope.state = "step3";
      $scope.user.my_id = data.ekstern_id;
    }).
    error(function(data, status, headers, config) {
      if (status === 409) {
        $scope.userExists = true;
      }
    });
  };

  $scope.sendLogin = function() {
    payload = {};
    payload.email = $scope.user.email;
    //TODO handle publisher_id;
    payload.publisher_id = 1;
    $http.post("/backend/mails/profile-page-link", payload).
    success(function(data, status, headers, config) {
      $scope.emailSent = true;
    });
  };

  $scope.submit_interests = function(user) {
    var payload = {};
    payload.location_id = location_id;
    payload.interesser = user.interests_choices;
    $http.post("backend/users/" + user.my_id +  "/interesser", payload).
    success(function(data, status, headers, config) {
      $scope.state = "step4";
    }).
    error(function(data, status, headers, config) {
      console.error(data);
    });
  };

}]).controller('loginController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', 'UserService',
function ($scope, $routeParams, $http, $rootScope, $location, UserService, login) {
  // $scope.email = $routeParams.email;

  // if ($routeParams.id) {
  //   UserService.login($routeParams.id).then(function (response) {
  //     if (UserService.isLoggedIn()) {
  //       $location.path('nyhedsbreve');
  //     } else {
  //       // TODO: Perhaps do nothing but show that user was not found. (invalid link). Try the "send email" opstion
  //     }
  //   });
  // }

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
    var payload = {};
    payload.email = email;
    payload.publisher_id = 1;

    $http.post("/backend/mails/profile-page-link", payload).then( function (response) {
      if (response.status === 200) {
        $scope.success = true;
      }
    });
  };

}]).controller('profileController', ['$scope', '$routeParams', '$http', '$q', '$location', 'UserService',
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
    
    if (user.postnummer) {
      payload.postnummer = user.postnummer.toString();
    }

    $http.put("/backend/users/" + ekstern_id, payload).then(function (response) {
      if (response.status === 200) {
        $scope.profileSaveSuccess = true;
      } else {
        console.log(response);
        $scope.profileSaveError = true;
      }
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
    method.success(function(data, status, headers, config) {
      console.debug("Change success");
      console.log(type);
      if (type === 'nyhedsbreve') {
        $scope.permissionSaveSuccess = true;
        $scope.user.nyhedsbreve = data;
      }
      if (type === 'interesser') {
        $scope.user.interesser = data;
        $scope.interestsSaveSuccess = true;
      }
    }).
    error(function(data, status, headers, config) {
      console.debug("Change error");
    });

  };

}]).controller('subscriptionsController', ['$scope', '$routeParams', '$http', '$q', '$modal', '$location', 'UserService',
function ($scope, $routeParams, $http, $q, $modal, $location, UserService) {
  console.log('subscriptionsController', UserService.isLoggedIn());
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

      $scope.filtered_newsletters = $scope.newsletters.filter(function (newsletter) {
        return $scope.my_subscriptions.indexOf(newsletter.nyhedsbrev_id) !== -1;
      });
      var nid = $routeParams.nid;
      if (nid) {
        var found = $scope.filtered_newsletters.some(function (el) {
          return el.nyhedsbrev_id == nid;
        });
        if (found) {
          $scope.filtered_newsletters = $scope.filtered_newsletters.filter(function (newsletter) {
            return newsletter.nyhedsbrev_id == nid;
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
