'use strict';

angular.module('smartFacultyApp').factory('FacultyAttendanceFactory', function($q, $http, LoginFactory) {
    var factory = {};
    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAttendanceForSubject',
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