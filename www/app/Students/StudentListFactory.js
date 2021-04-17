'use strict';
angular.module('smartFacultyApp').factory('StudentListFactory', function($q, $http, LoginFactory) {

    var URL = LoginFactory.getBaseUrl() + '/secure';

    var factory = {
        toState: "",
        selectedStudent: {},
        selectedPage: 0
    };

    factory.setToState = function(toState) {
        factory.toState = toState;
    };

    factory.getToState = function() {
        return factory.toState;
    };

    factory.getStudentDetails = function(studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getById/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updatePhoneNumber = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/updatePhoneNumber',
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

    factory.resetPassword = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/resetPassword',
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

    factory.updateDateOfBirth = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/updateDateOfBirth',
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