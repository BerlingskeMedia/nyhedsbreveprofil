var location_id = 1775;


var newsletterApp = angular.module('newsletter', [
  'ngRoute',
  'ui.bootstrap',
  "checklist-model"
]).config(['$locationProvider', '$routeProvider',
function($locationProvider, $routeProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/faq/:id?', {
      templateUrl: 'assets/partials/faq.html',
    }).
    when('/contact/:id?', {
      templateUrl: 'assets/partials/contact.html',
    }).
    when('/login', {
      templateUrl: 'assets/partials/login.html',
      controller: 'loginController'
    }).
    when('/tilmeldt/:id/:nid?', {
      templateUrl: 'assets/partials/edit.html',
      controller: 'editController'
    }).
    when('/oplysninger/:id/:state?', {
      templateUrl: 'assets/partials/profile.html',
      controller: 'profileController'
    }).
    when('/:id?', {
      templateUrl: 'assets/partials/newletters.html',
      controller: 'newsletterController'
    }).
    otherwise({
      redirectTo: '/'
    });
}]).controller('newsletterController', ['$scope', '$routeParams', '$http', '$q', '$location' ,
function($scope, $routeParams, $http, $q, $location) {
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

}]).controller('loginController', ['$scope', '$routeParams', '$http', '$rootScope', '$location',
function($scope, $routeParams, $http, $rootScope, $location) {
  $scope.email = $routeParams.email;
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

    $http.post("/backend/mails/profile-page-link", payload).
    success(function(data, status, headers, config) {
      $scope.success = true;
    }).
    error(function(data, status, headers, config) {
      //$scope.success = true;
    });
  };

}]).controller('profileController', ['$scope', '$routeParams', '$http', '$q',
function($scope, $routeParams, $http, $q) {
  var my_id = $routeParams.id;

  var user = $http.get("/backend/users/" + my_id);
  var newsletters = $http.get("/backend/users/" + my_id + "/nyhedsbreve");
  var interests = $http.get("/backend/interesser");
  var permissions = $http.get("/backend/nyhedsbreve?permission=1");

  $scope.tab = 'details';
  var state = $routeParams.state;
  if (state) {
    $scope.tab = state;
  }
  $q.all([user, newsletters, interests, permissions]).then(function(resolved) {
    $scope.user = resolved[0].data;
    $scope.user.foedselsaar = parseInt($scope.user.foedselsaar);
    $scope.newsletters = resolved[1].data;
    $scope.interests = resolved[2].data;
    $scope.permissions = resolved[3].data;
  });

  $scope.update = function(user) {
    //TODO location id?
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

    var payload = angular.copy(user);
    delete payload.interesser;
    delete payload.nyhedsbreve;
    delete payload.email;

    user.location_id = location_id;

    $http.put("/backend/users/" + my_id, payload).success(function(data, status, headers, config) {
      $scope.profileSaveSuccess = true;
    }).
    error(function(data, status, headers, config) {
      //TODO handle error;
    });

  };

  $scope.checkbox_change = function(val, nid, type) {
    var change_url = "/backend/users/" + my_id + "/" + type +"/" + nid + "?location_id=" + location_id;

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

}]).controller('editController', ['$scope', '$routeParams', '$http', '$q', '$modal',
function($scope, $routeParams, $http, $q, $modal) {
  $scope.reasons = ["I sender for mange mails", "Indholdet i jeres mails er ikke relevant for mig", "Jeg modtager for mange mails generelt", "Jeg har deltaget i en konkurrence, men ønsker ikke at være tilmeldt", "Jeg er blevet tilmeldt ved en fejl"];
  var my_id = $routeParams.id;

  var update = function() {
    var my_newsletters = $http.get("/backend/users/" + my_id + "/nyhedsbreve");
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
    $http.post("/backend/users/" + my_id + "/nyhedsbreve/delete", payload ).success(function(data, status, headers, config) {
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

  update();

}]).controller('MenuController', ['$scope', '$routeParams', '$http', '$q', '$rootScope', '$location',
function($scope, $routeParams, $http, $q, $rootScope, $location, $route) {
  $scope.$on('$routeChangeSuccess', function() {
    var my_id = $routeParams.id;
    if (my_id) {
      $http.get("/backend/users/" + my_id).success(function(data, status, headers, config) {
        $scope.my_id = my_id;
        $rootScope.logged_in = true;
        $rootScope.my_id = my_id;
        $scope.email = data.email;
      }).
      error(function(data, status, headers, config) {
        $location.path('/');
      });
    }
  });

  $scope.home = function () {
    // A minor hack to ensure reload on anonymous navigation from step{2-3-4} to step1
    var url = "/";
    if ($scope.my_id) {
      url = url + $scope.my_id;
    }
    else {
      url = "/";
    }
    window.location = url;
    $route.reload();
  };
}]);
