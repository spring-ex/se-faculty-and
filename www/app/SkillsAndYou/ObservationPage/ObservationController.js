'use strict';
angular.module('smartFacultyApp')
    .controller('ObservationController', function($scope, $state, ionicToast, WelcomeFactory, ObservationFactory, $ionicPopup, TestsFactory, LoginFactory, SelectClassFactory) {
        $scope.student = WelcomeFactory.selectedCriteria.student;
        $scope.subjects = null;
        $scope.data = {
            Marks: null
        };

        $scope.tooltipMessage = "";
        $scope.currentSubjectIndex = 0;

        $scope.keywords = SelectClassFactory.keywords;

        $scope.options = {
            initialSlide: 0,
            onInit: function(swiper) {
                $scope.swiper = swiper;
            },
            onSlideChangeEnd: function(swiper) {
                $scope.currentSubjectIndex = swiper.activeIndex;
                $scope.getSubjectAnalytics($scope.subjects[$scope.currentSubjectIndex]);
            }
        };

        $scope.marksStatistics = null;
        $scope.graph = {
            color: null
        };

        $scope.newTest = {
            Name: null,
            MaxMarks: 7,
            TestDate: moment().format('YYYY-MM-DD'),
            GivenBy: LoginFactory.loggedInUser.Id,
            TestCategoryId: null,
            SubjectId: null,
            ClassId: WelcomeFactory.selectedCriteria.classId,
            Students: [{
                StudentId: $scope.student.Id,
                IsAbsent: false,
                Marks: null,
                DeviceId: $scope.student.DeviceId,
                FatherDeviceId: null
            }],
            SubjectName: null
        };

        $scope.getSubjects = function() {
            $scope.subjects = [];
            SelectClassFactory.getAllSubjectsForSemesterAndUser(WelcomeFactory.selectedCriteria.courseId, WelcomeFactory.selectedCriteria.branchId, WelcomeFactory.selectedCriteria.semesterId, LoginFactory.loggedInUser.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.subjects = success.data.Data;
                        $scope.getSubjectAnalytics($scope.subjects[0]);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getSubjectAnalytics = function(subject) {
            ObservationFactory.getMarksStatistics(subject.Id, WelcomeFactory.selectedCriteria.classId, $scope.student.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.marksStatistics = success.data.Data;
                        if ($scope.marksStatistics.Average >= 75) {
                            $scope.graph.color = "#2ba14b";
                        } else if ($scope.marksStatistics.Average >= 50 && $scope.marksStatistics.Average < 75) {
                            $scope.graph.color = "#f1b500";
                        } else {
                            $scope.graph.color = "#e33e2b";
                        }
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.addOrUpdateMarks = function(subject, category, test) {
            var myPopup = $ionicPopup.show({
                templateUrl: 'app/SkillsAndYou/ObservationPage/MarksTemplate.html',
                title: "Enter marks",
                scope: $scope,
                buttons: [{
                        text: 'Cancel'
                    },
                    {
                        text: '<b>Submit</b>',
                        type: 'button-custom',
                        onTap: function(e) {
                            if ($scope.data.Marks.length == 0 || $scope.data.Marks < 0) {
                                ionicToast.show('Please enter proper marks', 'bottom', false, 2500);
                                e.preventDefault();
                            } else {
                                return $scope.data.Marks;
                            }
                        }
                    }
                ]
            });

            myPopup.then(function(res) {
                if (res == undefined) {
                    myPopup.close();
                } else {
                    if (test != null) {
                        TestsFactory.updateMarks($scope.student.Id, test.Id, res, (res / test.MaxMarks) * 100)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    ionicToast.show(success.data.Message, 'bottom', false, 2500);
                                } else {
                                    ionicToast.show('Successfully updated the marks of student', 'bottom', false, 2500);
                                    $scope.data.Marks = "";
                                    $scope.getSubjectAnalytics($scope.subjects[$scope.currentSubjectIndex]);
                                    myPopup.close();
                                }
                            }, function(error) {
                                ionicToast.show(error, 'bottom', false, 2500);
                            });
                    } else {
                        var num = category.Tests.length + 1
                        $scope.newTest.Name = 'Observation ' + num;
                        $scope.newTest.SubjectId = subject.Id;
                        $scope.newTest.SubjectName = subject.Name;
                        $scope.newTest.TestCategoryId = category.Id;
                        $scope.newTest.Students[0].Marks = res;
                        $scope.newTest.Students[0].ResultPercentage = (res / $scope.newTest.MaxMarks) * 100;
                        TestsFactory.createTestOldAPI($scope.newTest)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    ionicToast.show(success.data.Message, 'bottom', false, 2500);
                                } else {
                                    ionicToast.show('Observation created successfully', 'bottom', false, 2500);
                                }
                                $scope.getSubjectAnalytics($scope.subjects[$scope.currentSubjectIndex]);
                                myPopup.close();
                            }, function(error) {
                                ionicToast.show(error, 'bottom', false, 2500);
                            });
                    }
                }
            });
        };

        $scope.getSubjects();
    });