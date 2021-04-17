'use strict';
angular.module('smartFacultyApp')
    .factory('OnlineClassFactory', function($q, $http, LoginFactory) {
        var factory = {};

        var URL = LoginFactory.getBaseUrl() + '/secure';

        factory.updateMeetingURL = function(cls) {
            var d = $q.defer();
            $http({
                method: 'PUT',
                url: URL + '/class',
                data: cls,
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

        factory.sendReminder = function(obj) {
            var d = $q.defer();
            $http({
                method: 'POST',
                url: URL + '/customNotification',
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

        factory.getClassById = function(classId) {
            var d = $q.defer();
            $http({
                method: 'GET',
                url: URL + '/getClassById/' + classId,
            }).then(function(success) {
                d.resolve(success);
            }, function(error) {
                d.reject(error);
            });
            return d.promise;
        };

        return factory;
    });