'use strict';

angular.module('smartFacultyApp').factory('SpecialAttendanceFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedCourse: null,
        selectedBranch: null,
        selectedSemester: null,
        selectedClass: null,
        selectedStudents: null,
        selectedDate: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllBranchesForUser = function(userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllBranchesForUser/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.takeSpecialAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/takeSpecialAttendance',
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

    factory.getDaysTimetable = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getDaysTimetable',
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