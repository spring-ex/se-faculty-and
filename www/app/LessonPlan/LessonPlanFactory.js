'use strict';

angular.module('smartFacultyApp').factory('LessonPlanFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedTopic: null,
        selectedChapter: null,
        selectedChapterIndex: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getLessonPlan = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getLessonPlan',
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

    factory.getRatingForTopics = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getRatingForTopics',
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

    factory.topicTaught = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/topicTaught',
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

    factory.activateSmartTestForClass = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/activateSmartTestForClass',
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