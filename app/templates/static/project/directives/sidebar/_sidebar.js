/**
 * @author <%= author %>
 * @date <%= date %>
 * 
 */
angular.module('<%= projectName %>').directive('sidebar', ['$rootScope',function($rootScope) {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: __uri('sidebar.html'),
        link:function($scope){
            $scope.active=$rootScope.active;
        }
    };
}]);