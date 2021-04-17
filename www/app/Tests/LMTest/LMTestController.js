'use strict';
angular.module('smartFacultyApp')
    .controller('LMTestController', function($scope, $state, ionicToast, LoginFactory, SelectClassFactory, LessonPlanFactory, TestsFactory, CriteriaFactory, $ionicHistory) {

        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.students = TestsFactory.Students;
        $scope.chapters = [];
        $scope.criterias = [];
        $scope.selected = {
            chapter: null,
            topic: null
        };
        $scope.subject = SelectClassFactory.selected.subject;

        $scope.getLessonPlan = function() {
            var obj = {
                SubjectId: SelectClassFactory.selected.subject.Id,
                ClassId: SelectClassFactory.selected.class.Id,
                DateRange: {
                    startDate: moment().subtract(1, 'year').toISOString(),
                    endDate: moment().toISOString()
                }
            };
            LessonPlanFactory.getLessonPlan(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.create = function() {
            if ($scope.selected.topic == null) {
                ionicToast.show('Select a topic to create assessment', 'bottom', false, 2500);
            } else {
                //get all criteria
                CriteriaFactory.getAllCriteria($scope.selected.chapter.Id, $scope.selected.topic.Id)
                    .then(function(success) {
                        $scope.criterias = [];
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            $scope.criterias = success.data.Data;
                            $scope.createAssessment();
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        $scope.createAssessment = function() {
            //create test with name= topic name, maxmarks = no. of criteria * 3
            $scope.newTest = {
                Name: $scope.selected.topic.Name,
                MaxMarks: $scope.criterias.length * 3,
                TestDate: moment().format('YYYY-MM-DD'),
                GivenBy: LoginFactory.loggedInUser.Id,
                TestCategoryId: null,
                Students: [],
                IsFinal: false,
                SubjectName: SelectClassFactory.selected.subject.Name
            };
            //all students scored 0 in test
            for (var i = 0; i < $scope.students.length; i++) {
                $scope.newTest.Students.push({
                    StudentId: $scope.students[i].Id,
                    IsAbsent: false,
                    Marks: 0,
                    ResultPercentage: 0,
                    DeviceId: $scope.students[i].DeviceId,
                    FatherDeviceId: $scope.students[i].FatherDeviceId,
                    SubjectId: SelectClassFactory.selected.subject.Id,
                    ClassId: $scope.students[i].ClassId
                });
            }
            TestsFactory.createTest($scope.newTest)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.addCriteriaToTest(success.data.Data);
                    }
                    $scope.newTest = {
                        Name: null,
                        MaxMarks: null,
                        TestDate: moment().format('YYYY-MM-DD'),
                        GivenBy: LoginFactory.loggedInUser.Id,
                        SubjectId: SelectClassFactory.selected.subject.Id,
                        IsFinal: false,
                        ClassId: SelectClassFactory.selected.class.Id,
                    };
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.addCriteriaToTest = function(data) {
            var obj = {
                TestId: data.insertId,
                CriteriaIds: []
            }
            for (var i = 0; i < $scope.criterias.length; i++) {
                obj.CriteriaIds.push($scope.criterias[i].Id);
            }
            CriteriaFactory.addQuestionsToTest(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Test created successfully', 'bottom', false, 2500);
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('menu.tests');
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getLessonPlan();

    });