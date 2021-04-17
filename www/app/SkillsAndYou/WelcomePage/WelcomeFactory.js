'use strict';

angular.module('smartFacultyApp').factory('WelcomeFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedCriteria: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllCourses = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/course/getAllByCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllBranches = function(courseId, collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/branch/getAllByCourse/' + courseId + '/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSemesters = function(branchId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/semester/getAllByBranch/' + branchId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllClasses = function(branchId, semesterId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/class/getAllBySemester/' + branchId + '/' + semesterId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllByCourseBranchSem = function(collegeId, courseId, branchId, semesterId, classId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getAllByCourseBranchSem/' + collegeId + '/' + courseId + '/' + branchId + '/' + semesterId + '/' + classId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});