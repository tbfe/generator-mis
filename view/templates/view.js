angular.module('<%= projectName %>').controller('UsersCtrl', [
    '$scope',
    '$location',
    '$route',
    '$rootScope',
    '$window',
    '<%= resourceName %>',
    function($scope, $location, $route, $rootScope, $window, <%= resourceName %> ) {
        console.log('hello from '+name+' view');
    }
]);