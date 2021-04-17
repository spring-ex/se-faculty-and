'use strict';
angular.module('smartFacultyApp')
    .controller('LessonPlanController', function($scope, $state, SelectClassFactory, LessonPlanFactory, DashboardFactory, ionicToast, LoginFactory, $location, $ionicScrollDelegate, $stateParams) {

        $scope.subject = SelectClassFactory.selected.subject;
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.chapters = [];

        $scope.dateRange = {
            startDate: moment().subtract(1, 'year').toISOString(),
            endDate: moment().toISOString()
        };

        $scope.getLessonPlan = function() {
            var obj = {
                SubjectIds: DashboardFactory.SubjectIds,
                ClassIds: DashboardFactory.ClassIds,
                DateRange: $scope.dateRange
            };
            LessonPlanFactory.getLessonPlan(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.chapters = success.data.Data;
                        if (LessonPlanFactory.selectedChapterIndex != null) {
                            $scope.toggleChapter($scope.chapters[LessonPlanFactory.selectedChapterIndex]);
                        }
                        $scope.getRatingForTopics();
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getRatingForTopics = function() {
            var obj = {
                SubjectIds: DashboardFactory.SubjectIds,
                ClassIds: DashboardFactory.ClassIds
            };
            LessonPlanFactory.getRatingForTopics(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.topicRatings = success.data.Data;
                        for (var i = 0; i < $scope.chapters.length; i++) {
                            // remove the topics with name "Summary"
                            $scope.chapters[i].Topics = $scope.chapters[i].Topics.filter(function(chapter) {
                                return chapter.Name != "Summary";
                            });
                            for (var j = 0; j < $scope.chapters[i].Topics.length; j++) {
                                for (var k = 0; k < $scope.topicRatings.length; k++) {
                                    if ($scope.chapters[i].Topics[j].Id == $scope.topicRatings[k].TopicId) {
                                        $scope.chapters[i].Topics[j].Rating = $scope.topicRatings[k].Rating;
                                        $scope.chapters[i].Topics[j].NumberOfStudents = $scope.topicRatings[k].NumberOfStudents;
                                        $scope.chapters[i].Topics[j].Percentage = ($scope.chapters[i].Topics[j].Rating / ($scope.chapters[i].Topics[j].NumberOfStudents * 5)) * 100; // rating is for 5 starts
                                    }
                                }
                            }
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.topicSelected = function(topic, chapter, chapterIndex) {
            LessonPlanFactory.selectedTopic = topic;
            LessonPlanFactory.selectedChapter = chapter;
            LessonPlanFactory.selectedChapterIndex = chapterIndex;
            $state.go('topicDetails');
        };

        $scope.updateTopicAttendance = function(topic, chapter) {
            var obj = {
                ChapterId: chapter.Id,
                TopicId: topic.Id,
                ClassId: DashboardFactory.ClassIds[0], //send the first class id in the list
                SubjectId: DashboardFactory.SubjectIds[0], //send the first subject id in the list
                Action: "remove"
            }
            if (topic.TopicAttendance == true) {
                obj.Action = "add";
            }
            LessonPlanFactory.topicTaught(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        var topicsNotTaught = chapter.Topics.filter(x => x.TopicAttendance == null);
                        var obj = {
                            ClassId: DashboardFactory.ClassIds[0],
                            ChapterId: chapter.Id,
                            Action: "remove"
                        };
                        var message = "";
                        if (topicsNotTaught.length == 0) {
                            obj.Action = "add";
                            message = "Topic updated & Quiz has been enabled for this chapter";
                        } else {
                            obj.Action = "remove";
                            message = "Topic updated successfully";
                        }
                        LessonPlanFactory.activateSmartTestForClass(obj)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    ionicToast.show(success.data.Message, 'bottom', false, 2500);
                                } else {
                                    ionicToast.show(message, 'bottom', false, 2500);
                                }
                            }, function(error) {
                                ionicToast.show(error, 'bottom', false, 2500);
                            })
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.toggleChapter = function(chapter) {
            var currentStatus = chapter.show;
            for (var i = 0; i < $scope.chapters.length; i++) {
                $scope.chapters[i].show = false;
            }
            chapter.show = !currentStatus;
            if (LessonPlanFactory.selectedChapterIndex != null) {
                LessonPlanFactory.selectedChapterIndex = null;
                $scope.scrollTo(chapter);
            }
        };

        $scope.scrollTo = function(chapter) {
            $location.hash('item' + chapter.Id);
            $ionicScrollDelegate.anchorScroll(true);
        };

        $scope.isChapterShown = function(chapter) {
            return chapter.show;
        };

        $scope.getLessonPlan();

    });