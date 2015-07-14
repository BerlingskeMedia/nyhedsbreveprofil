var newsletterController = angular.module('newsletterController', []);

newsletterController.controller('newsletterController', ['$scope', '$routeParams', '$http' ,
  function($scope, $routeParams, $http) {
    $http.get("/backend/publishers").success(function(data, status, headers, config) {
      $scope.publishers = data;
    });
  }]);

var newsletterApp = angular.module('newsletter', [
  'ngRoute',
  'newsletterController'
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
