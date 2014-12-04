angular.module('<%= projectName %>').directive('sidebar', function() {
    return {
        restrict: 'A',
        scope: {
            active: '='
        },
        templateUrl: __uri('sidebar.html')
    };
});