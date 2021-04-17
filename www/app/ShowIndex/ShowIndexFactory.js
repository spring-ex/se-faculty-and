'use strict';

angular.module('smartFacultyApp').factory('ShowIndexFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllChaptersAndTopicsForSubject = function(subjectId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getChapterAndTopicsBySubject/' + subjectId + '/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});