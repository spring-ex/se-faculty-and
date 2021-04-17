'use strict';

angular.module('smartFacultyApp').factory('TestsFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedTest: {},
        selectedSlide: 0,
        Students: [],
        ClassIds: [],
        SubjectIds: []
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllTests = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/test/getAll',
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

    factory.getAllTestCategories = function(subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllTestCategories/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getTestDetails = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/test/getMarksForSubject',
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

    factory.createTest = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/test/new',
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

    factory.createTestOldAPI = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/test',
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

    factory.updateMarks = function(studentId, testId, marks, resultPercentage) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/test/updateMarks',
            data: {
                StudentId: studentId,
                TestId: testId,
                Marks: marks,
                ResultPercentage: resultPercentage
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

    factory.updateCriteriaForStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/updateCriteriaForStudent',
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

    factory.deleteTest = function(test) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/test',
            data: test,
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

    factory.getAllSmartTestsForClass = function(classId, subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllSmartTestsForClass/' + classId + '/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllTopicsForSmartTest = function(smartTestId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllTopicsForSmartTest/' + smartTestId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteSmartTest = function(test) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteSmartTest',
            data: test,
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