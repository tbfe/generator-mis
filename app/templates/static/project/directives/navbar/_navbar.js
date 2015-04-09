angular.module('<%= projectName %>').directive('navbar', ['$rootScope',function($rootScope) {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: __uri('navbar.html'),
        link:function($scope){
            $scope.active=$rootScope.active;
        }
    };
}]);
