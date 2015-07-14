var newsletterController = angular.module('newsletterController', []);

newsletterController.controller('newsletterController', ['$scope', '$routeParams', '$http', '$q' ,
  function($scope, $routeParams, $http, $q) {
    var publishers = $http.get("/backend/publishers");
    var newsletters = $http.get("/backend/nyhedsbreve");
    $q.all([publishers, newsletters]).then(function(resolved) {
      $scope.publishers = resolved[0].data;
      $scope.newsletters = resolved[1].data;
    });

  }]);

var newsletterApp = angular.module('newsletter', [
  'ngRoute',
  'newsletterController',
  'ui.bootstrap'
]).controller('faqController', ['$scope', '$routeParams',
function($scope, $routeParams) {
  //TODO
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
        controller: 'faqController'
      }).
      when('/login', {
        templateUrl: 'assets/partials/login.html',
        // controller: 'faqController'
      }).
      when('/step2', {
        templateUrl: 'assets/partials/step2.html',
        // controller: 'faqController'
      }).
      when('/step3', {
        templateUrl: 'assets/partials/step3.html',
        // controller: 'faqController'
      }).
      when('/edit', {
        templateUrl: 'assets/partials/edit.html',
        // controller: 'faqController'
      }).
      when('/me', {
        templateUrl: 'assets/partials/me.html',
        // controller: 'faqController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
