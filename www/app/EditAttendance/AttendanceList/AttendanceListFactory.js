'use strict';
angular.module('smartFacultyApp').factory('AttendanceListFactory', function ($q, $http, LoginFactory) {

    var URL = LoginFactory.getBaseUrl() + '/secure';

    var factory = {};

    factory.getAllAttendance = function (studentId, subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/attendance/getAllByStudent/' + studentId + '/' + subjectId
        }).then(function (success) {
            d.resolve(success);
        }, function (error) {
            factory.isAuthenticated = false;
            d.reject(error);
        });
        return d.promise;
    };

    factory.editAttendance = function (obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/editAttendanceForStudent',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (success) {
            d.resolve(success);
        }, function (error) {
            factory.isAuthenticated = false;
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});
