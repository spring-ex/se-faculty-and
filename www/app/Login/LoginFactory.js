'use strict';

angular.module('smartFacultyApp').factory('LoginFactory', function($q, $http) {
    var factory = {
        loggedInUser: {},
        isAuthenticated: false,
        DeviceId: null,
    };

    var website = 'https://spring-equinoxx.herokuapp.com';
    var URL = website;

    factory.login = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/login',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            if (success.data.Data != null) {
                factory.loggedInUser = success.data.Data[0];
                factory.loggedInUser.OldPackageCode = factory.loggedInUser.PackageCode;
                $http.defaults.headers.common['Authorization'] = success.data.Data[0].Token;
                factory.isAuthenticated = true;
                factory.storeLoginSession();
            }
            d.resolve(success);
        }, function(error) {
            factory.isAuthenticated = false;
            d.reject(error);
        });
        return d.promise;
    };

    factory.storeLoginSession = function() {
        factory.isLoggedIn = true;
        localStorage.setItem("PhoneNumber", factory.loggedInUser.PhoneNumber);
        localStorage.setItem("Password", factory.loggedInUser.Password);
        localStorage.setItem("isLoggedIn", factory.isLoggedIn);
    };

    factory.removeLoginSession = function() {
        factory.isLoggedIn = false;
        localStorage.removeItem("PhoneNumber");
        localStorage.removeItem("Password");
        localStorage.removeItem("isLoggedIn");
    };

    factory.logout = function() {
        factory.isAuthenticated = false;
        factory.removeLoginSession();
    };

    factory.getBaseUrl = function() {
        return website;
    };

    return factory;
});