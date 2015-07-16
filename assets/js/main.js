var newsletterController = angular.module('newsletterController', []);

newsletterController.controller('newsletterController', ['$scope', '$routeParams', '$http', '$q', '$location' ,
  function($scope, $routeParams, $http, $q, $location) {
    $scope.state = "step1";
    var publishers = $http.get("/backend/publishers");
    var newsletters = $http.get("/backend/nyhedsbreve");
    var interests = $http.get("/backend/interesser");
    $q.all([publishers, newsletters, interests]).then(function(resolved) {
      $scope.publishers = resolved[0].data;
      $scope.newsletters = resolved[1].data;
      $scope.interests = resolved[2].data;
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
]).controller('loginController', ['$scope', '$routeParams', '$http',
function($scope, $routeParams, $http) {
  $scope.send_email = function(email) {
    var payload = {};
    payload.email = email;
    payload.publisher_id = 1;

    $http.post("/backend/mails/profile-page-link", payload).
    success(function(data, status, headers, config) {
      console.log("hurra");
    }).
    error(function(data, status, headers, config) {
      //TODO handle error;
    });
  };
}]).controller('profileController', ['$scope', '$routeParams', '$http', '$q',
function($scope, $routeParams, $http, $q) {
  var test = "fe50338207f2edab2f163186bf8d4627"; //TODO remove
  var my_id = $routeParams.id;

  var user = $http.get("/backend/users/" + my_id);
  var newsletters = $http.get("/backend/users/" + my_id + "/nyhedsbreve");
  var interests = $http.get("/backend/interesser");

  $scope.tab = 'details';
  $q.all([user, newsletters, interests]).then(function(resolved) {
    $scope.user = resolved[0].data;
    $scope.newsletters = resolved[1].data;
    $scope.interests = resolved[2].data;
  });

  $scope.update = function(user) {
    //TODO location id?
    user.location_id = 1
    $http.put("/backend/users/" + my_id, user).success(function(data, status, headers, config) {
      console.log("hurra");
    }).
    error(function(data, status, headers, config) {
      //TODO handle error;
    });
  };

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
      when('/edit', {
        templateUrl: 'assets/partials/edit.html',
        // controller: 'faqController'
      }).
      when('/profile/:id', {
        templateUrl: 'assets/partials/profile.html',
        controller: 'profileController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
