var location_id = 1775;


var newsletterApp = angular.module('newsletter', [
  'ngRoute',
  'ui.bootstrap',
  "checklist-model"
]).config(['$locationProvider', '$routeProvider',
function($locationProvider, $routeProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/faq', {
      templateUrl: 'assets/partials/faq.html',
    }).
    when('/kontakt', {
      templateUrl: 'assets/partials/contact.html',
    }).
    when('/login/:id?', {
      templateUrl: 'assets/partials/login.html',
      controller: 'loginController'
    }).
    when('/tilmeldt/:nid?', {
      templateUrl: 'assets/partials/edit.html',
      controller: 'subscriptionsController'
    }).
    when('/oplysninger/:tab?', {
      templateUrl: 'assets/partials/profile.html',
      controller: 'profileController'
    }).
    when('/nyhedsbreve/:id?', {
      templateUrl: 'assets/partials/newletters.html',
      controller: 'newsletterController'
    }).
    otherwise({
      redirectTo: '/nyhedsbreve'
    });
}]).factory('User', ['$http',
function ($http) {
  return {
    login: function (ekstern_id) {
      return $http.get("/backend/users/" + ekstern_id).then(function (response) {
        if (response.status === 200 && response.data) {
          window.sessionStorage.setItem('ekstern_id', response.data.ekstern_id);
          window.sessionStorage.setItem('User', JSON.stringify(response.data));
        } else {
          // TODO: Perhaps do nothing but show that user was not found. (invalid link). Try the "send email" opstion
        }
      });
    },
    logout: function () {
      window.sessionStorage.setItem('ekstern_id', null);
      window.sessionStorage.setItem('User', null);
    },
    getData: function () {
      return JSON.parse(window.sessionStorage.getItem('User'));
    },
    getExternalId: function () {
      return window.sessionStorage.getItem('ekstern_id');
    },
    isLoggedIn: function () {
      return window.sessionStorage.getItem('ekstern_id') !== null;
    }
  };
}]).controller('newsletterController', ['$scope', '$routeParams', '$http', '$q', '$location', 'User',
function ($scope, $routeParams, $http, $q, $location, User) {

  $scope.state = "step1";
  var publishers = $http.get("/backend/publishers");
  var newsletters = $http.get("/backend/nyhedsbreve");
  var interests = $http.get("/backend/interesser");
  var permissions = $http.get("/backend/nyhedsbreve?permission=1");
  var to_resolve = [publishers, newsletters, interests, permissions];

  if (!angular.isUndefined($routeParams.id)) {
    var user = $http.get("/backend/users/" + $routeParams.id);
    to_resolve.push(user);
  }

  $q.all(to_resolve).then(function(resolved) {
    $scope.publishers = resolved[0].data;
    $scope.newsletters = resolved[1].data;
    $scope.interests = resolved[2].data;
    $scope.permissions = resolved[3].data;
    //TODO use param from path
    $scope.current_publisher = $scope.publishers[15];
    if (angular.isDefined(resolved[4]) && resolved[4].status == 200) {
      $scope.user = resolved[4].data;
      //Avoid numFmt conversion error
      delete $scope.user.foedselsaar;
      $scope.loggedIn = true;
    }
  });

  $scope.onNewsletterChange = function(checkbox, newsletter) {
    var url = "/backend/users/" + $scope.user.ekstern_id + '/nyhedsbreve/' + newsletter.nyhedsbrev_id;
    if (!$scope.user) {
      return;
    }
    var method;
    if (checkbox.checked) {
      //TODO add location_id
      method = $http.post(url +"?location_id=" + location_id);
    }
    else {
      method = $http.delete(url);
    }
    method.success(function(data) {
      $scope.user.nyhedsbreve = data;
      checkbox.$parent.created = checkbox.checked;
      checkbox.$parent.deleted = !checkbox.checked;
    }).error(function(error) {
      console.error(error);
    });
  };

  $scope.submit_step1 = function (user) {
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

}]).controller('loginController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', 'User',
function ($scope, $routeParams, $http, $rootScope, $location, User) {

  $scope.email = $routeParams.email;

  if ($routeParams.id) {
    User.login($routeParams.id).then(function (response) {
      if (User.isLoggedIn()) {
        $location.path('nyhedsbreve');
      } else {
        // TODO: Perhaps do nothing but show that user was not found. (invalid link). Try the "send email" opstion
      }
    });
  }

  if (User.isLoggedIn()) {
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

}]).controller('profileController', ['$scope', '$routeParams', '$http', '$q', '$location', 'User',
function ($scope, $routeParams, $http, $q, $location, User) {
  if (!User.isLoggedIn()) {
    return $location.path('login');
  }

  var ekstern_id = User.getExternalId();
  var userData = User.getData();

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

}]).controller('subscriptionsController', ['$scope', '$routeParams', '$http', '$q', '$modal', '$location', 'User',
function ($scope, $routeParams, $http, $q, $modal, $location, User) {
  $scope.reasons = [
    "I sender for mange mails",
    "Indholdet i jeres mails er ikke relevant for mig",
    "Jeg modtager for mange mails generelt",
    "Jeg har deltaget i en konkurrence, men ønsker ikke at være tilmeldt",
    "Jeg er blevet tilmeldt ved en fejl"];

  function update () {

    var my_newsletters = $http.get("/backend/users/" + User.getExternalId() + "/nyhedsbreve");
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
    $http.post("/backend/users/" + User.getExternalId() + "/nyhedsbreve/delete", payload ).success(function(data, status, headers, config) {
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


  if (!User.isLoggedIn()) {
    var search = $location.search();
    console.log('search', search);
    if (search.ekstern_id || search.id || search.login) {
      User.login(search.ekstern_id ? search.ekstern_id : search.id ? search.id : search.login).then(function () {
        update();
      });
    } else {
      $location.path('login');
    }
  } else {
    update();
  }
}]).controller('MenuController', ['$scope', '$routeParams', '$http', '$q', '$rootScope', '$location', 'User',
function ($scope, $routeParams, $http, $q, $rootScope, $location, User) {

  $scope.$on('$routeChangeSuccess', function () {
    $scope.loggedIn = User.isLoggedIn();

    if ($scope.loggedIn) {
      $scope.ekstern_id = User.getExternalId();
      var user = User.getData();
      $scope.email = user.email;
    }

    // var my_id = $routeParams.id;
    // if (my_id) {
    //   $http.get("/backend/users/" + my_id).success(function(data, status, headers, config) {
    //     $scope.my_id = my_id;
    //     $rootScope.logged_in = true;
    //     $rootScope.my_id = my_id;
    //     $scope.email = data.email;
    //   }).
    //   error(function(data, status, headers, config) {
    //     $location.path('/');
    //   });
    // }
  });

  // $scope.home = function () {
  //   // A minor hack to ensure reload on anonymous navigation from step{2-3-4} to step1
  //   var url = "/";
  //   if ($scope.my_id) {
  //     url = url + $scope.my_id;
  //   }
  //   else {
  //     url = "/";
  //   }
  //   window.location = url;
  //   $route.reload();
  // };
}]);
