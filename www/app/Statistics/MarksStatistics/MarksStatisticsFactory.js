'use strict';

angular.module('smartFacultyApp').factory('MarksStatisticsFactory', function($q, $http, LoginFactory) {
    var factory = {
        sliderValues: {
            min: 1,
            max: 100
        },
        selectedTags: [],
        selectedQuizzes: []
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getMarksStatisticsByRange = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getMarksStatisticsByRangeNew',
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

    factory.getMarksStatisticsByRangeForOBE = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getMarksStatisticsByRangeForOBE',
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

    factory.getTopicsForClass = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getTopicsForClass',
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

    factory.getAllItems = function(collegeId, subjectId, classId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllCOandBT/' + collegeId + '/' + subjectId + '/' + classId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSmartTestForFiltering = function(subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllSmartTestForFiltering/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStatisticsByBloomsLevel = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getStatisticsByBloomsLevel',
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

    factory.getStatisticsByTags = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getStatisticsByTags',
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

    return factory;
});