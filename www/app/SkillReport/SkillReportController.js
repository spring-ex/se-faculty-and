'use strict';
angular.module('smartFacultyApp')
    .controller('SkillReportController', function($scope, ionicToast, SelectClassFactory, MarksStatisticsFactory, SkillReportFactory, LoginFactory, DashboardFactory) {

        $scope.skill = SkillReportFactory.SelectedSkill;
        $scope.students = [];
        $scope.options = {
            initialSlide: 0,
            onInit: function(swiper) {
                $scope.swiper = swiper;
            },
            onSlideChangeEnd: function(swiper) {
                if (swiper.activeIndex == 0) {
                    $scope.getLessonPlan();
                } else {
                    $scope.getMarksStatisticsByTags();
                }
            }
        };

        $scope.getLessonPlan = function() {
            var obj = {
                SubjectId: SelectClassFactory.selected.subject.Id,
                ClassId: SelectClassFactory.selected.class.Id,
                Tag: $scope.skill.Name
            };
            SkillReportFactory.getLessonPlanForSkill(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.chapters = success.data.Data;
                        $scope.getTopicsForClass();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getTopicsForClass = function() {
            MarksStatisticsFactory.getTopicsForClass(SelectClassFactory.selected.class.Id, SelectClassFactory.selected.subject.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.chaptersToShow = [];
                        $scope.completedTopics = success.data.Data;
                        if ($scope.completedTopics[0].TopicId != null) {
                            var chapterScore = 0,
                                topicsCompleted = 0;
                            for (var i = 0; i < $scope.chapters.length; i++) {
                                chapterScore = 0;
                                topicsCompleted = 0;
                                for (var j = 0; j < $scope.chapters[i].Topics.length; j++) {
                                    $scope.chapters[i].Topics[j].IsCompleted = false;
                                    for (var k = 0; k < $scope.completedTopics.length; k++) {
                                        if ($scope.chapters[i].Topics[j].Id == $scope.completedTopics[k].TopicId) {
                                            if ($scope.completedTopics[k].TopicAverage == null && $scope.completedTopics[k].TopicTestAverage == null) {
                                                $scope.chapters[i].Topics[j].TopicAverage = null;
                                            } else {
                                                $scope.chapters[i].Topics[j].IsCompleted = true;
                                                if ($scope.completedTopics[k].TopicAverage == null) {
                                                    $scope.chapters[i].Topics[j].TopicAverage = $scope.completedTopics[k].TopicTestAverage;
                                                } else {
                                                    $scope.chapters[i].Topics[j].TopicAverage = $scope.completedTopics[k].TopicAverage;
                                                }
                                                topicsCompleted++;
                                            }
                                        }
                                    }
                                    if ($scope.chapters[i].Topics[j].TopicAverage != null) {
                                        chapterScore += parseFloat($scope.chapters[i].Topics[j].TopicAverage);
                                    }
                                }
                                if (topicsCompleted) {
                                    $scope.chapters[i].ChapterAverage = chapterScore / topicsCompleted;
                                } else {
                                    $scope.chapters[i].ChapterAverage = null;
                                }
                            }
                        }
                        //show only chapters which have topics
                        for (var i = 0; i < $scope.chapters.length; i++) {
                            if ($scope.chapters[i].Topics.length > 0) {
                                $scope.chaptersToShow.push($scope.chapters[i]);
                            }
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.toggleChapter = function(chapter) {
            chapter.show = !chapter.show;
            for (var i = 0; i < $scope.chaptersToShow.length; i++) {
                if ($scope.chaptersToShow[i].Id != chapter.Id) {
                    $scope.chaptersToShow[i].show = false;
                }
            }
        };

        $scope.isChapterShown = function(chapter) {
            return chapter.show;
        };


        //slide 2
        $scope.getMarksStatisticsByTags = function() {
            var obj = {
                ClassIds: DashboardFactory.ClassIds,
                SubjectIds: DashboardFactory.SubjectIds,
                Tags: [$scope.skill.Name],
                Quizzes: [],
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                IsElective: SelectClassFactory.selected.subject.IsElective
            }
            MarksStatisticsFactory.getStatisticsByTags(obj)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                        calculateAverageWithWeightage();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        function calculateAverageWithWeightage() {
            angular.forEach($scope.students, function(student) {
                student.Marks = SelectClassFactory.calculateAverageWithWeightage(student.TestScore, student.ExamScore, student.QuizScore);
            });
        };

        $scope.getLessonPlan();

    });