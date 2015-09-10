var app = angular.module('app', ['ui.router', 'btford.socket-io']).
factory('socket', function(socketFactory) {
    return socketFactory();
});