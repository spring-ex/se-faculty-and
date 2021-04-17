'use strict';

angular.module('smartFacultyApp').factory('StudentStatisticsFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getMarksStatistics = function(subjectId, classId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentMarksStatisticsNew/' + subjectId + '/' + classId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getSubjectStatsForStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getSubjectStatsForStudent',
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

    factory.getSubjectStatsForPrimeKeyword = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getSubjectStatsForPrimeKeyword',
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

    factory.getMarksStatisticsForOBE = function(subjectId, classId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentMarksStatisticsForOBE/' + subjectId + '/' + classId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAttendanceStatistics = function(subjectId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentAttendanceStatistics/' + subjectId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});