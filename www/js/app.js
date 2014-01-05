var fidelitas = angular.module("fidelitas", []);

fidelitas.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/tag.tmpl.html',
        controller: 'FidelitasCtrl'
      }).
      when('/file', {
            templateUrl: 'partials/file.tmpl.html',
            controller: 'FileCtrl'
        }).
      when('/config', {
        templateUrl: 'partials/config.tmpl.html',
        controller: 'ConfigCtrl'
      }).
      when('/writer', {
        templateUrl: 'partials/writer.tmpl.html',
        controller: 'WriterCtrl'
      });
}]);

fidelitas.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

