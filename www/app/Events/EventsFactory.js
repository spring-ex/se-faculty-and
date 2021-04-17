'use strict';

angular.module('smartFacultyApp').factory('EventsFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedEvent: {}
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllEvents = function(collegeId, year) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/event/getAllByCollege/' + collegeId + "/" + year
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getEventImages = function(eventId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/event/getImages/' + eventId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.createEvent = function(event) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/event',
            data: event,
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

    factory.deleteEvent = function(event) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/event',
            data: event,
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