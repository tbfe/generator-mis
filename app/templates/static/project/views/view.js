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
        
        $scope.searchType = 1;

        $scope.dummyData=[{
                id:0,
                user_name:'foo',
                score:998,
                membership:true
        },{
                id:1,
                user_name:'bar',
                score:998,
                membership:true
        },{
                id:2,
                user_name:'baz',
                score:998,
                membership:false
        },{
                id:3,
                user_name:'quz',
                score:998,
                membership:false
        },{
                id:4,
                user_name:'foobarbazquzfoobarbazquzfoobarbazquzfoobarbazquz',
                score:998,
                membership:false
        }];

        /**
         * view detail
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        $scope.detail=function(id){
            if(window['sweetAlert']){
                sweetAlert('查看详情', '条目 '+id+' 的详情...', "info");
            }else{
                alert('条目'+id+' 的详情：blahblahbalh..');
            }
        };

        /**
         * edit an entry
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        $scope.edit=function(id){
            if(window['sweetAlert']){
                sweetAlert('编辑', '条目 '+id+' 正在被编辑...', "info");
            }else{
                alert('Item'+id+' 正在被编辑..');
            }
        };
        /**
         * edit an entry
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        $scope.remove=function(id){
            if(window['sweetAlert']){
               swal({
                    title: '删除',
                    text: '少年，你确定要这么做么？！',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '是的',
                    cancelButtonText: '不，我手抖点错',
                    closeOnConfirm: false
                }, function() {
                    swal('操作成功！', '条目 '+id+' 被成功删除', 'success');
                });
            }else{
                alert('确认删除条目 '+id+' 么?');
            }
        };
    }
]);