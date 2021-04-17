'use strict';
angular.module('smartFacultyApp')
    .controller('TestsController', function($scope, $state, ionicToast, TakeAttendanceFactory, SelectClassFactory, LoginFactory, TestsFactory, $ionicPopup) {

        $scope.tests = [];
        var conductedTestsOnly = false;
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.keywords = SelectClassFactory.keywords;

        $scope.getAllTests = function() {
            var obj = {
                SubjectIds: TestsFactory.SubjectIds,
                ClassIds: TestsFactory.ClassIds,
                ConductedTestsOnly: conductedTestsOnly
            };
            TestsFactory.getAllTests(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        TestsFactory.tests = success.data.Data;
                        $scope.tests = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.testSelected = function(test) {
            TestsFactory.selectedSlide = 0;
            if (test.TestDate) {
                TestsFactory.selectedTest = test;
                $state.go('menu.testDetails');
            } else {
                ionicToast.show(test.Name + ' has not been conducted yet.', 'bottom', false, 2500);
            }
        };

        $scope.addTest = function() {
            TestsFactory.selectedSlide = 0;
            if (LoginFactory.loggedInUser.Type == 'LM') {
                $state.go('menu.lmTest');
            } else {
                $state.go('menu.createTest');
            }
        };

        $scope.getAllStudentsInClass = function() {
            TakeAttendanceFactory.getAllStudentsInClass(LoginFactory.loggedInUser.CollegeId, SelectClassFactory.selected.subject.Id, SelectClassFactory.selected.class.Id, SelectClassFactory.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        TestsFactory.Students = [];
                        TestsFactory.ClassIds = [];
                        TestsFactory.SubjectIds = [];
                        TestsFactory.Students = success.data.Data;
                        TestsFactory.ClassIds = $scope.getUniqueIds(TestsFactory.Students, 'ClassId');
                        if (SelectClassFactory.selected.subject.IsElective == "true") {
                            TestsFactory.SubjectIds = $scope.getUniqueIds(TestsFactory.Students, 'NormalSubjectId');
                        } else {
                            TestsFactory.SubjectIds.push(SelectClassFactory.selected.subject.Id);
                        }
                        $scope.getAllTests();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getUniqueIds = function(array, key) {
            return TestsFactory.Students.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        $scope.updateOutcomes = function() {
            $state.go('menu.updateOutcomes');
        };

        $scope.getAllStudentsInClass();

    });