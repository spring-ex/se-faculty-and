'use strict';
angular.module('smartFacultyApp')
    .controller('SidemenuController', function ($scope, $state, LoginFactory, StudentListFactory, $rootScope) {

        $rootScope.$on('userLoggedIn', function(){
            $scope.loggedInUser = LoginFactory.loggedInUser;
        });

    });
