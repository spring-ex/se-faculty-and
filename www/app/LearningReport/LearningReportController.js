'use strict';
angular.module('smartFacultyApp')
    .controller('LearningReportController', function($scope, $state, ionicToast, LoginFactory, SelectClassFactory, LearningReportFactory, $stateParams, LessonPlanFactory, $ionicPopover) {

        $scope.chapters = [];
        $scope.completedTopics = null;
        $scope.subject = SelectClassFactory.selected.subject;

        $ionicPopover.fromTemplateUrl('app/Statistics/MarksStatistics/FilterResultTemplate.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover2 = popover;
        });

        $scope.openPopover2 = function($event) {
            $scope.popover2.show($event);
        };

        $scope.closePopover2 = function() {
            $scope.popover2.hide();
        };

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
                        $scope.chaptersToShow = angular.copy($scope.chapters);
                        $scope.getTopicsForClass();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getTopicsForClass = function() {
            LearningReportFactory.getTopicsForStudent(LearningReportFactory.selectedStudent.Id, SelectClassFactory.selected.subject.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
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
                        $scope.chaptersToShow = angular.copy($scope.chapters);
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

        $scope.classFilterSelected = function(value) {
            $scope.closePopover2();
            if (value == 1) {
                $scope.chaptersToShow = $scope.chapters.filter(function(obj) {
                    return (obj.ChapterAverage < 50)
                });
            } else if (value == 2) {
                $scope.chaptersToShow = $scope.chapters.filter(function(obj) {
                    return (obj.ChapterAverage < 75 && obj.ChapterAverage >= 50)
                });
            } else if (value == 3) {
                $scope.chaptersToShow = $scope.chapters.filter(function(obj) {
                    return (obj.ChapterAverage >= 75)
                });
            } else {
                $scope.chaptersToShow = angular.copy($scope.chapters);
            }
        };

        $scope.getLessonPlan();
    });