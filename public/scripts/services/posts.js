angular.module('app').factory('posts', ['$http', 'auth', function($http, auth) {
    var o = {
        posts: []
    };
    o.getAll = function() {
        return $http.get('/api/posts').success(function(data) {
            angular.copy(data, o.posts);
        });
    };

  
    return o;
}]);