var newsletterController = angular.module('newsletterController', []);

newsletterController.controller('newsletterController', ['$scope', '$routeParams', '$http', '$q', '$location' ,
  function($scope, $routeParams, $http, $q, $location) {
    $scope.state = "step1";
    var publishers = $http.get("/backend/publishers");
    var newsletters = $http.get("/backend/nyhedsbreve");
    var interests = $http.get("/backend/interesser");
    var permissions = $http.get("/backend/nyhedsbreve?permission=1");
    $q.all([publishers, newsletters, interests, permissions]).then(function(resolved) {
      $scope.publishers = resolved[0].data;
      $scope.newsletters = resolved[1].data;
      $scope.interests = resolved[2].data;
      $scope.permissions = resolved[3].data;
      //TODO use param from path
      $scope.current_publisher = $scope.publishers[3];
    });
    $scope.post_user = function(user) {
      var payload = {};
      payload.email = user.email;
      payload.fornavn = user.firstname;
      payload.efternavn = user.lastname;
      payload.nyhedsbreve = user.newsletter_choices;
      payload.location_id = 1;

      $http.post("/backend/users", payload).
      success(function(data, status, headers, config) {
        $scope.state = "step3";
        $scope.user.my_id = data.ekstern_id;
      }).
      error(function(data, status, headers, config) {
        console.error(data);
        $location.path = "/login";
      });
    };
    $scope.submit_interests = function(user) {
      var payload = {};
      payload.location_id = 1;
      payload.interesser = user.interests_choices;
      $http.post("backend/users/" + user.my_id +  "/interesser", payload).
      success(function(data, status, headers, config) {
        $scope.state = "step4";
      }).
      error(function(data, status, headers, config) {
        console.error(data);
        //TODO handle error
      });
    };
  }]);

var newsletterApp = angular.module('newsletter', [
  'ngRoute',
  'newsletterController',
  'ui.bootstrap',
  "checklist-model"
]).controller('loginController', ['$scope', '$routeParams', '$http', '$rootScope', '$location',
function($scope, $routeParams, $http, $rootScope, $location) {
  $scope.send_email = function(email) {
    var payload = {};
    payload.email = email;
    payload.publisher_id = 1;

    $http.post("/backend/mails/profile-page-link", payload).
    success(function(data, status, headers, config) {
      //TODO testing only
      $rootScope.logged_in = true;
      $rootScope.my_id = "fe50338207f2edab2f163186bf8d4627";
      $rootScope.email = email;
      $location.path("/edit/" + $rootScope.my_id);
    }).
    error(function(data, status, headers, config) {
      //TODO testing only
      $rootScope.logged_in = true;
      $rootScope.my_id = "fe50338207f2edab2f163186bf8d4627";
      $rootScope.email = email;
      $location.path("/edit/" + $rootScope.my_id);
    });
  };
}]).controller('profileController', ['$scope', '$routeParams', '$http', '$q',
function($scope, $routeParams, $http, $q) {
  var test = "fe50338207f2edab2f163186bf8d4627"; //TODO remove
  var my_id = $routeParams.id;

  var user = $http.get("/backend/users/" + my_id);
  var newsletters = $http.get("/backend/users/" + my_id + "/nyhedsbreve");
  var interests = $http.get("/backend/interesser");
  var permissions = $http.get("/backend/nyhedsbreve?permission=1");

  $scope.tab = 'details';
  $q.all([user, newsletters, interests, permissions]).then(function(resolved) {
    $scope.user = resolved[0].data;
    $scope.newsletters = resolved[1].data;
    $scope.interests = resolved[2].data;
    $scope.permissions = resolved[3].data;
  });

  $scope.update = function(user) {
    //TODO location id?
    var payload = angular.copy(user);
    delete payload.interesser;
    delete payload.nyhedsbreve;
    delete payload.email;

    user.location_id = 1;

    $http.put("/backend/users/" + my_id, payload).success(function(data, status, headers, config) {
    }).
    error(function(data, status, headers, config) {
      //TODO handle error;
    });

  };
  $scope.checkbox_change = function(val, nid, type) {
    var change_url = "/backend/users/" + my_id + "/" + type +"/" + nid + "?location_id=1";

    var method;
    if (val.checked) {
      method = $http.post(change_url);
    }
    else {
      method = $http.delete(change_url);
    }
    method.success(function(data, status, headers, config) {
      console.debug("Change success");
    }).
    error(function(data, status, headers, config) {
      console.debug("Change error");
    });

  };


}]).controller('editController', ['$scope', '$routeParams', '$http', '$q', '$modal',
function($scope, $routeParams, $http, $q, $modal) {
  var my_id = $routeParams.id;

  var update = function() {
    var my_newsletters = $http.get("/backend/users/" + my_id + "/nyhedsbreve");
    var newsletters = $http.get("/backend/nyhedsbreve");
    $q.all([newsletters, my_newsletters]).then(function(resolved) {
      $scope.newsletters = resolved[0].data;
      $scope.newsletter_choices = resolved[1].data;
    });
  };

  $scope.unsubscribe = function(feedback) {
    console.debug($scope.to_unsubscribe);
    var payload = {};
    payload.location_id = 1;
    payload.nyhedsbrev_id = $scope.to_unsubscribe.nyhedsbrev_id;
    payload.user_feedback = "feedback";
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

  update();

}]);



newsletterApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'assets/partials/newletters.html',
        controller: 'newsletterController'
      }).
      when('/faq', {
        templateUrl: 'assets/partials/faq.html',
      }).
      when('/login', {
        templateUrl: 'assets/partials/login.html',
        controller: 'loginController'
      }).
      when('/edit/:id', {
        templateUrl: 'assets/partials/edit.html',
        controller: 'editController'
      }).
      when('/profile/:id', {
        templateUrl: 'assets/partials/profile.html',
        controller: 'profileController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]).controller('MenuController', ['$scope', '$routeParams', '$http', '$q', '$rootScope',
  function($scope, $routeParams, $http, $q, $rootScope) {
    $rootScope.logged_in = false;

  }]);
