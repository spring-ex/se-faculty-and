'use strict';
angular.module('smartFacultyApp')
    .controller('CreateTestController', function($scope, $state, ionicToast, $ionicHistory, TakeAttendanceFactory, TestsFactory, ionicDatePicker, LoginFactory, SelectClassFactory) {

        $scope.newTest = {
            Name: null,
            MaxMarks: null,
            TestDate: moment().format('YYYY-MM-DD'),
            GivenBy: LoginFactory.loggedInUser.Id,
            TestCategoryId: null,
            Students: [],
            IsFinal: false,
            SubjectName: SelectClassFactory.selected.subject.Name
        };

        $scope.students = TestsFactory.Students;
        for (var i = 0; i < $scope.students.length; i++) {
            $scope.students[i].Marks = null;
            $scope.students[i].IsAbsent = false;
        }

        $scope.assessments = [
            "Listening",
            "Speaking",
            "Reading",
            "Writing",
            "Creativity",
            "Aesthetic Value",
            "Pincer Grip",
            "Independence",
            "Hygiene",
            "Safety",
            "Life Skills",
            "Understanding Concepts",
            "Observing",
            "Problem Solving",
            "Predicting Outcomes",
            "Physical Strength",
            "Balance",
            "Coordination",
            "Imagination",
            "Role Play",
            "Sharing",
            "Understanding Feelings",
            "श्रवण",
            "वाचन",
            "पठन",
            "लेखन"
        ];

        $scope.loggedInUser = LoginFactory.loggedInUser;

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.newTest.TestDate = moment(val).format('YYYY-MM-DD');
            },
            from: new Date(2017, 0, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.addTest = function() {
            if ($scope.newTest.Name == "" || $scope.newTest.Name == null ||
                $scope.newTest.MaxMarks == undefined || $scope.newTest.MaxMarks == null) {
                ionicToast.show('Please enter all required information', 'bottom', false, 2500);
            } else {
                if ($scope.loggedInUser.PackageCode == 'LM' && ($scope.newTest.TestCategoryId == undefined || $scope.newTest.TestCategoryId == null)) {
                    ionicToast.show('Please enter all required information', 'bottom', false, 2500);
                } else {
                    var flag = 0;
                    for (var i = 0; i < $scope.students.length; i++) {
                        if (!$scope.students[i].IsAbsent) {
                            if ($scope.students[i].Marks == null || $scope.students[i].Marks == undefined || ($scope.students[i].Marks > $scope.newTest.MaxMarks)) {
                                ionicToast.show('Please enter a valid score or mark absent', 'bottom', false, 2500);
                                flag = 1;
                            }
                        }
                    }
                    if (!flag) {
                        for (var i = 0; i < $scope.students.length; i++) {
                            $scope.newTest.Students.push({
                                StudentId: $scope.students[i].Id,
                                IsAbsent: $scope.students[i].IsAbsent,
                                Marks: $scope.students[i].Marks,
                                ResultPercentage: ($scope.students[i].Marks / $scope.newTest.MaxMarks) * 100,
                                DeviceId: $scope.students[i].DeviceId,
                                FatherDeviceId: $scope.students[i].FatherDeviceId,
                                SubjectId: SelectClassFactory.selected.subject.Id,
                                ClassId: $scope.students[i].ClassId
                            });
                            if (SelectClassFactory.selected.subject.IsElective == "true") {
                                $scope.newTest.Students[i].SubjectId = $scope.students[i].NormalSubjectId
                            }
                        }
                        TestsFactory.createTest($scope.newTest)
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
                    }
                }
            }
        };

        $scope.getAllTestCategories = function() {
            TestsFactory.getAllTestCategories(SelectClassFactory.selected.subject.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.categories = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.isMarksMoreThanMaxMarks = function(student, index) {
            if (parseFloat(student.Marks) > parseInt($scope.newTest.MaxMarks)) {
                ionicToast.show('Marks should be less than or equal to Max Marks', 'bottom', false, 2500);
                $scope.students[index].Marks = "";
            }
        };

        $scope.getAllTestCategories();

    });