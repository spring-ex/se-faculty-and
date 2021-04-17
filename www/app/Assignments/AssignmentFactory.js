'use strict';

angular.module('smartFacultyApp').factory('AssignmentFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedAssignment: {},
        SubjectIds: [],
        ClassIds: [],
        Students: null,
        currentYear: new Date().getFullYear()
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllAssignments = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignment/getAllBySubject',
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

    factory.getAssignmentImages = function(assignmentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/assignment/getImages/' + assignmentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.publishAssignment = function(assignment) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignment/new',
            data: assignment,
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

    factory.deleteAssignment = function(assignment) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/assignment',
            data: assignment,
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

    factory.updateAssignment = function(assignment) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/assignment',
            data: assignment,
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