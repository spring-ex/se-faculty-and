'use strict';

angular.module('smartFacultyApp').factory('CriteriaFactory', function($q, $http, LoginFactory) {
    var factory = {
        Topics: []
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getCourseOutcomes = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllCourseOutcomes',
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

    factory.getAllCriteriaForStudentAndTest = function(studentId, testId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllCriteriaForStudentAndTest/' + studentId + '/' + testId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getBloomsTaxonomy = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllBlooms'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllCriteria = function(chapterId, topicId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllCriteria/' + chapterId + '/' + topicId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getQuestionPaper = function(testId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getQuestionPaper/' + testId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.createCriteria = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/createCriteria',
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

    factory.addQuestionToTest = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addQuestionToTest',
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

    factory.addQuestionsToTest = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addQuestionsToTest',
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

    factory.deleteCriteria = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteCriteria',
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

    factory.removeQuestionFromTest = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/removeQuestionFromTest',
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