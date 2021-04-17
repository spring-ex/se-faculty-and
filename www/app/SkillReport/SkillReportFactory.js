'use strict';

angular.module('smartFacultyApp').factory('SkillReportFactory', function($q, $http, LoginFactory) {
    var factory = {
        SelectedSkill: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getLessonPlanForSkill = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getLessonPlanForSkill',
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