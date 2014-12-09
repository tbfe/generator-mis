/**
 * @author <%= author %>
 * @date <%= date %>
 */
angular.module('<%= projectName %>').controller('<%= controllerName %>', [
    '$scope',
    '$location',
    '$route',
    '$rootScope',
    '$window',
    '<%= resourceName %>',
    function($scope, $location, $route, $rootScope, $window, <%= resourceName %> ) {
        $scope.info = "Hello from view<%= index %>";
    }
]);