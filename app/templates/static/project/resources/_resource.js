/**
 * @author <%= author %>
 * @date <%= date %>
 */
 angular.module('<%= projectName %>')
     .factory('<%= resourceName %>', ['commonResource',
         function(commonResource) {
             var <%= resourceName %> = commonResource('', {}, {
                 query: {
                     method: 'GET',
                     url: '/multiaudit/query/userInfo',
                     isArray: false
                 },
                 list: {
                     method: 'GET',
                     url: '/url/for/list',
                     params: {
                         page: 1
                     },
                     isArray: false
                 }
             });
             return <%= resourceName %> ;
         }
     ]);