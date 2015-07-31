/**
 * @file TODO the file desc.
 * @author <%= author %>
 * @date <%= date %>
 */
angular.module('<%= projectName %>').controller('<%= name %>', [
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