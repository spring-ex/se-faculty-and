'use strict';
angular.module('smartFacultyApp').factory('CreateSmartTestFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.createSmartTest = function(test) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/createSmartTest',
            data: test,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getLessonPlanForSmartTest = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getLessonPlanForSmartTest',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});