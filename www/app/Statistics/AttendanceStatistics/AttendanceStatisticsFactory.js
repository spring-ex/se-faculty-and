'use strict';

angular.module('smartFacultyApp').factory('AttendanceStatisticsFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAttendanceStatisticsByRange = function(subjectId, classId, collegeId, rangeId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAttendanceStatisticsByRange/' + subjectId + '/' + classId + '/' + collegeId + '/' + rangeId + '/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});