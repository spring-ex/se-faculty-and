'use strict';

angular.module('smartFacultyApp').factory('SelectClassFactory', function($q, $http, LoginFactory) {
    var factory = {
        selected: {
            subject: {},
            class: {}
        },
        keywords: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllSubjectsForUser = function(userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllByUser/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjectsForSemesterAndUser = function(courseId, branchId, semesterId, userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllBySemesterAndUser/' + courseId + '/' + branchId + '/' + semesterId + '/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllClassesForSubject = function(subjectId, userId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/class/getAllBySubject/' + subjectId + '/' + userId + '/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllKeywords = function(collegeType) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllKeywords/' + collegeType
        }).then(function(success) {
            factory.keywords = success.data.Data[0];
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.calculateAverageWithWeightage = function(avg_of_tests, avg_of_exam, avg_of_quiz) {
        var average;
        if (avg_of_exam == 0) { // if there are no final exams
            if (avg_of_tests != 0 && avg_of_quiz != 0) { // both quiz and test exist
                average = (avg_of_tests * 0.9) + (avg_of_quiz * 0.1);
            } else {
                if (avg_of_tests == 0) { // if there are no tests
                    average = avg_of_quiz; // 100% of quiz
                } else {
                    average = avg_of_tests; // 100% of tests
                }
            }
        } else {
            if (avg_of_tests != 0 && avg_of_quiz != 0) { // if there are tests and quizzes and exam
                average = (((avg_of_tests * 0.4) + (avg_of_exam * 0.6)) * 0.9) + (avg_of_quiz * 0.1); // 90%(40% of tests + 60% of exam) + 10%(quiz)
            } else {
                if (avg_of_tests == 0) { // if there are no tests
                    average = (avg_of_quiz * 0.1) + (avg_of_exam * 0.9); // 10% of quiz + 90% of final exam
                } else {
                    average = (avg_of_tests * 0.4) + (avg_of_exam * 0.6); // 40% of tests + 60% of final exam
                }
            }
        }
        return average;
    };

    return factory;
});