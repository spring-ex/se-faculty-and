'use strict';

angular.module('smartFacultyApp').factory('TakeAttendanceFactory', function($q, $http, LoginFactory) {
    var factory = {
        attendanceList: []
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllStudentsInClass = function(collegeId, subjectId, classId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getByClass/' + collegeId + '/' + subjectId + '/' + classId + '/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.takeAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/takeAttendance',
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