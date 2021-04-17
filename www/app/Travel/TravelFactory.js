'use strict';

angular.module('smartFacultyApp').factory('TravelFactory', function($q, $http, LoginFactory) {
    var factory = {
        currentLocation: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getStudentsByRoute = function(routeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getAllByRoute/' + routeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.updateRoute = function(routeId, lat, lng, students, pickup) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/updateRoute',
            data: {
                RouteId: routeId,
                Latitude: lat,
                Longitude: lng
            },
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

    factory.studentBoardsBus = function(student) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/studentBoardsBus',
            data: student,
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

    factory.studentLeavesBus = function(student) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/studentLeavesBus',
            data: student,
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

    factory.busReachedDestination = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/busReachedDestination',
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