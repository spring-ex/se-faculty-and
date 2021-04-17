'use strict';

angular.module('smartFacultyApp').factory('DashboardFactory', function($q, $http, LoginFactory) {
    var factory = {
        StudentsInClass: null,
        SubjectIds: [],
        ClassIds: [],
        Tags: []
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getMarksStatistics = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getMarksStatisticsNew',
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

    factory.getClassStatsForSubject = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getClassStatsForSubject',
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

    factory.getMarksStatisticsForOBE = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getMarksStatisticsForOBE',
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

    factory.getAttendanceStatistics = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAttendanceStatistics',
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

    factory.getAllTags = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllTags',
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

    factory.getClassStatsWithForPrimeKeywords = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getClassStatsForPrimeKeywords',
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