var newsletterController = angular.module('newsletterController', []);

newsletterController.controller('newsletterController', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    //TODO
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
