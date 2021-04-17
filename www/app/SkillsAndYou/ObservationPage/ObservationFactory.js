'use strict';

angular.module('smartFacultyApp').factory('ObservationFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getObservationDetails = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getObservationDetails',
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

    factory.getMarksStatistics = function(subjectId, classId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentMarksStatisticsForSkillsAndYou/' + subjectId + '/' + classId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjects = function(courseId, branchId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllBySemester/' + courseId + '/' + branchId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});