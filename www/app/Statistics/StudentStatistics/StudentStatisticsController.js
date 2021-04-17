'use strict';
angular.module('smartFacultyApp')
    .controller('StudentStatisticsController', function($scope, $state, DashboardFactory, StudentListFactory, MarksStatisticsFactory, ionicToast, StudentStatisticsFactory, SelectClassFactory, LoginFactory, LearningReportFactory, $filter) {

        $scope.student = StudentListFactory.selectedStudent;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.tests = [];

        $scope.barGraphSeries = [];
        $scope.suggestionTags = [];
        $scope.tags = [];

        $scope.marksStatistics = null;
        $scope.average = 0;
        $scope.subject = SelectClassFactory.selected.subject;
        $scope.class = SelectClassFactory.selected.class;
        $scope.attendanceStatistics = null;
        $scope.graph = {
            color: "#e33e2b"
        };

        $scope.keywords = SelectClassFactory.keywords;

        $scope.studentAttendance = function() {
            $state.go('menu.studentAttendance');
        };

        $scope.getMarksStatistics = function() {
            var subjectId;
            if (SelectClassFactory.selected.subject.IsElective == "true") {
                subjectId = $scope.filteredStudent.NormalSubjectId;
            } else {
                subjectId = SelectClassFactory.selected.subject.Id;
            }
            var obj = {
                StudentId: $scope.student.Id,
                ClassId: $scope.filteredStudent.ClassId,
                SubjectId: subjectId
            }
            StudentStatisticsFactory.getMarksStatistics(subjectId, $scope.filteredStudent.ClassId, $scope.student.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.tests = success.data.Data;
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });

            if ($scope.loggedInUser.PackageCode == 'SMART') {
                $scope.getAllTags();
            } else {
                StudentStatisticsFactory.getSubjectStatsForStudent(obj)
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
            }
        };

        $scope.getAttendanceStatistics = function() {
            var subjectId;
            if (SelectClassFactory.selected.subject.IsElective == "true") {
                subjectId = $scope.filteredStudent.NormalSubjectId;
            } else {
                subjectId = SelectClassFactory.selected.subject.Id;
            }
            StudentStatisticsFactory.getAttendanceStatistics(subjectId, $scope.student.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.attendanceStatistics = success.data.Data;
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.sendMessage = function() {
            $state.go('menu.personalMessages', { StudentId: $scope.student.Id });
        };

        $scope.getStudentStats = function() {
            $scope.getAttendanceStatistics();
            $scope.getMarksStatistics();
        };

        $scope.learningReport = function() {
            LearningReportFactory.selectedStudent = $scope.student;
            $state.go('menu.learningReport')
        };

        $scope.getAllTags = function(tagObj) {
            $scope.barGraphSeries = [], $scope.suggestionTags = [];
            var obj = {
                SubjectId: SelectClassFactory.selected.subject.Id,
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
            $scope.barGraphSeries = [], $scope.suggestionTags = [];
            var iterations = 0;
            angular.forEach($scope.tags, function(tag, tagIndex) {
                var obj = {
                    StudentId: $scope.student.Id,
                    ClassId: SelectClassFactory.selected.class.Id,
                    SubjectId: SelectClassFactory.selected.subject.Id,
                    Tag: tag.Name
                };
                StudentStatisticsFactory.getSubjectStatsForPrimeKeyword(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            var avg_from_exam = (success.data.Data.AverageFromExam == null) ? 0 : success.data.Data.AverageFromExam;
                            var avg_from_test = (success.data.Data.AverageFromTest == null) ? 0 : success.data.Data.AverageFromTest;
                            var avg_from_quiz = (success.data.Data.AverageFromQuiz == null) ? 0 : success.data.Data.AverageFromQuiz;
                            var overallAvg = SelectClassFactory.calculateAverageWithWeightage(avg_from_test, avg_from_exam, avg_from_quiz);
                            if (overallAvg < 50 && overallAvg >= 0.01) {
                                $scope.suggestionTags.push(tag);
                            }
                            if (overallAvg >= 0.01) {
                                $scope.barGraphSeries.push(overallAvg);
                            }
                            if (iterations == $scope.tags.length) {
                                // $rootScope.$broadcast('loading:show');
                                var chart = new Highcharts.Chart({
                                    chart: {
                                        renderTo: 'studentChart',
                                        type: 'column'
                                    },
                                    title: {
                                        text: 'Performance'
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    xAxis: {
                                        categories: $scope.tags.map(a => a.Name),
                                        crosshair: true
                                    },
                                    yAxis: {
                                        title: {
                                            text: ''
                                        }
                                    },
                                    series: [{
                                        name: "Skills",
                                        data: $scope.barGraphSeries
                                    }]
                                });
                                // $rootScope.$broadcast('loading:hide');
                            }
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            });
        };

        $scope.students = DashboardFactory.StudentsInClass;
        $scope.filteredStudent = $filter('filter')($scope.students, { Id: $scope.student.Id })[0];

        $scope.getStudentStats();

    });