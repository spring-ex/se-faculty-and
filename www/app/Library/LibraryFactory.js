'use strict';

angular.module('smartFacultyApp').factory('LibraryFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllAvailableBooks = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAvailableBooks/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getBorrowedBooks = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getBorrowedBooks/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentByRollNumber = function(rollNumber, collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentByRollNumber/' + rollNumber + '/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.issueBook = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/borrowBook',
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

    factory.returnBook = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/returnBook',
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