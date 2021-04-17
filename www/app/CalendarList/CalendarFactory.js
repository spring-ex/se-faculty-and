'use strict';

angular.module('smartFacultyApp').factory('CalendarFactory', function ($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllCalendarEvents = function (collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/calendar/getAllByCollege/' + collegeId
        }).then(function (success) {
            d.resolve(success);
        }, function (error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});