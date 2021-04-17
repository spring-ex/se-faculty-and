'use strict';

angular.module('smartFacultyApp').factory('TopicDetailsFactory', function($q, $http, LoginFactory) {
    var factory = {
        presentationURL: null,
        defaultPresentationURL: null,
        subTopics: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getPresentationURL = function(topicId, collegeId, classId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getTopicPresentationURL/' + topicId + '/' + collegeId + '/' + classId
        }).then(function(success) {
            factory.presentationURL = success.data.Data;
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getTopicDefaultPresentationURL = function(chapterId, topicId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getTopicDefaultPresentation/' + chapterId + '/' + topicId
        }).then(function(success) {
            factory.defaultPresentationURL = success.data.Data;
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getQuestionCountForTopic = function(topicId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getQuestionCountForTopic/' + topicId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubTopics = function(topicIds) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllSubTopics',
            data: topicIds,
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