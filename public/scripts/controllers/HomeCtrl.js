angular.module('app').controller('HomeCtrl', [
    '$scope',
    'posts',
    'auth',
    'socket',

    function($scope, posts, auth, socket) {

        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.posts = posts.posts;
        $scope.test = 'Hello world!';

        $scope.upvote = function(post) {
            posts.upvote(post);
        };

        $scope.addPost = function() {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            posts.create({
                title: $scope.title,
                link: $scope.link,
                author: auth.currentUser()
            });
            $scope.title = '';
            $scope.link = '';
        };
    }
]);
