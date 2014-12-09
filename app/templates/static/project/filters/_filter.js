/**
 * @author <%= author %>
 * @date <%= date %>
 */

angular.module('<%= projectName %>').filter('truncate', [
    /**
     *truncate text for better display
     */
    function() {
        return function(text, limit) {
            return text.length > limit ? (text.substr(0, limit - 1) + '...') : text;
        };
    }
]).filter('isMembership', [
    /**
     * transform variable to text for better display
     */
    function() {
        return function(input) {
            return input ? '是' : '否';
        };
    }
]);