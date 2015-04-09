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

        //set witch nav item to be actived 
        $rootScope.active = 'view<%= index %>';

        $scope.dataSource = [{
            id: 0,
            name: 'foo'
        }, {
            id: 1,
            name: 'bar'
        }, {
            id: 2,
            name: 'baz'
        }];

        $scope.edit = function(item) {
            $scope.currentItem = item;
            $('#editModal').modal('show');
        };

        $scope.remove = function(item) {
            if (confirm('确定删除' + item.name + '？')) {
                alert('done!');
            }
        };
        
        $scope.doSearch = function(item) {
            $location.search(angular.extend($scope.urlSearch, {
                pn: 1
            }));
        };

        /**
         * 分页
         * @param  {[type]} pn 页码
         */
        $scope.changePage = function(pn) {

            $location.search(angular.extend($scope.urlSearch, {
                pn: pn
            }));
        };
    }
]);