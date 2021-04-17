'use strict';
angular.module('smartFacultyApp')
    .controller('DashboardController', function($scope, $state, StudentListFactory, SelectClassFactory, LoginFactory, ionicToast, DashboardFactory, $rootScope, TakeAttendanceFactory, MarksStatisticsFactory, SkillReportFactory) {

        $rootScope.$broadcast('userLoggedIn');
        $scope.attendanceStatistics = null;
        $scope.tests = [];
        $scope.average = 0;
        $scope.subject = SelectClassFactory.selected.subject;
        $scope.class = SelectClassFactory.selected.class;
        $scope.graph = {
            color: "#e33e2b"
        };
        $scope.skillsToShow = [];
        $scope.skillsWithPerformance = [];
        $scope.tags = [];

        $scope.keywords = SelectClassFactory.keywords;

        $scope.getMarksStatistics = function(subjectIds, classIds) {
            var obj = {
                SubjectIds: subjectIds,
                ClassIds: classIds
            };
            DashboardFactory.getMarksStatistics(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.tests = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
            // if ($scope.loggedInUser.PackageCode == "SMART") {
            //     $scope.getAllTags();
            // } else {

            $scope.getAllTags();
            DashboardFactory.getClassStatsForSubject(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        var avg_from_exam = (success.data.Data.AverageFromExam == null) ? 0 : success.data.Data.AverageFromExam;
                        var avg_from_test = (success.data.Data.AverageFromTest == null) ? 0 : success.data.Data.AverageFromTest;
                        var avg_from_quiz = (success.data.Data.AverageFromQuiz == null) ? 0 : success.data.Data.AverageFromQuiz;
                        $scope.average = SelectClassFactory.calculateAverageWithWeightage(avg_from_test, avg_from_exam, avg_from_quiz);
                        if ($scope.average >= 75) {
                            $scope.graph.color = "#2ba14b";
                        } else if ($scope.average >= 50 && $scope.average < 75) {
                            $scope.graph.color = "#f1b500";
                        } else {
                            $scope.graph.color = "#e33e2b";
                        }
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
            // }
        };

        $scope.getAttendanceStatistics = function(subjectIds, classIds) {
            var obj = {
                SubjectIds: subjectIds,
                ClassIds: classIds,
                SpecialClassId: null,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                IsElective: SelectClassFactory.selected.subject.IsElective
            };
            if (SelectClassFactory.selected.subject.IsElective == "true") {
                obj.SpecialClassId = SelectClassFactory.selected.class.Id;
            }
            DashboardFactory.getAttendanceStatistics(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.attendanceStatistics = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getStats = function(subjectIds, classIds) {
            if ($scope.loggedInUser.Type != 'LM') {
                $scope.getMarksStatistics(subjectIds, classIds);
            }
            $scope.getAttendanceStatistics(subjectIds, classIds);
        };

        $scope.learningReport = function() {
            $state.go('menu.marksStatistics');
        };

        $scope.getAllStudentsInClass = function() {
            DashboardFactory.StudentsInClass = [];
            TakeAttendanceFactory.getAllStudentsInClass(LoginFactory.loggedInUser.CollegeId, SelectClassFactory.selected.subject.Id, SelectClassFactory.selected.class.Id, SelectClassFactory.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                        DashboardFactory.StudentsInClass = $scope.students;
                        var classIds = $scope.getUniqueIds($scope.students, 'ClassId');
                        var subjectIds = [];
                        if (SelectClassFactory.selected.subject.IsElective == "true") {
                            subjectIds = $scope.getUniqueIds($scope.students, 'NormalSubjectId');
                        } else {
                            subjectIds.push(SelectClassFactory.selected.subject.Id);
                        }
                        DashboardFactory.SubjectIds = subjectIds;
                        DashboardFactory.ClassIds = classIds;
                        $scope.getStats(subjectIds, classIds);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getUniqueIds = function(array, key) {
            return $scope.students.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        $scope.onRefresh = function() {
            var classIds = $scope.getUniqueIds($scope.students, 'ClassId');
            var subjectIds = [];
            if (SelectClassFactory.selected.subject.IsElective == "true") {
                subjectIds = $scope.getUniqueIds($scope.students, 'NormalSubjectId');
            } else {
                subjectIds.push(SelectClassFactory.selected.subject.Id);
            }
            $scope.getStats(subjectIds, classIds);
        };

        $scope.facultyAttendance = function() {
            $state.go("menu.facultyAttendance");
        };

        $scope.getAllTags = function() {
            var obj = {
                SubjectIds: DashboardFactory.SubjectIds,
                Type: 1
            };
            MarksStatisticsFactory.getAllTags(obj)
                .then(function(success) {
                    $scope.tags = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.tags = success.data.Data;
                        if ($scope.tags.length > 0) {
                            $scope.getStatsForTag();
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getStatsForTag = function() {
            var iterations = 0;
            angular.forEach($scope.tags, function(tag, tagIndex) {
                tag.Result = 0;
                var obj = {
                    SubjectIds: DashboardFactory.SubjectIds,
                    ClassIds: DashboardFactory.ClassIds,
                    Tag: tag.Name
                };
                DashboardFactory.getClassStatsWithForPrimeKeywords(obj)
                    .then(function(success) {
                        iterations++;
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            var avg_from_exam = (success.data.Data.AverageFromExam == null) ? 0 : success.data.Data.AverageFromExam;
                            var avg_from_test = (success.data.Data.AverageFromTest == null) ? 0 : success.data.Data.AverageFromTest;
                            var avg_from_quiz = (success.data.Data.AverageFromQuiz == null) ? 0 : success.data.Data.AverageFromQuiz;
                            var overallAvg = SelectClassFactory.calculateAverageWithWeightage(avg_from_test, avg_from_exam, avg_from_quiz);
                            if (overallAvg >= 0.01) {
                                tag.Result = overallAvg;
                            }
                            if (iterations == $scope.tags.length) {
                                $scope.skillsToShow = $scope.tags.filter(a => (a.Result > 0.01));
                                $scope.skillsWithPerformance = $scope.tags.filter(a => a.Result >= 75);
                                $scope.chunkedData = chunk($scope.skillsToShow, 3);
                                $scope.chunkedPerformanceData = chunk($scope.skillsWithPerformance, 3);
                                // for analyse skills page
                                DashboardFactory.tags = $scope.tags;
                            }
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            });
        };

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        $scope.skillSelected = function(skill) {
            SkillReportFactory.SelectedSkill = skill;
            $state.go('menu.skillReport')
        };

        $scope.analyseSkills = function() {
            $state.go('menu.analyseSkills');
        };

        $scope.getAllStudentsInClass();

    });