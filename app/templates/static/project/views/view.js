/**
 * @author <%= author %>
 * @date <%= date %>
 */
angular.module('<%= projectName %>').controller('<%= viewName %>', [
    '$scope',
    '$location',
    '$route',
    '$rootScope',
    '$window',
    '<%= resourceName %>',
    function($scope, $location, $route, $rootScope, $window, <%= resourceName %> ) {
        $scope.activeItem = 'view<%= index %>';
        $scope.info = "Hello from view<%= index %>";
    }
]);