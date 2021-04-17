'use strict';
angular.module('smartFacultyApp')
    .controller('ChaptersController', function($scope, $state, SelectSemesterFactory, LessonPlanFactory, DashboardFactory, ionicToast, LoginFactory, $location, $ionicScrollDelegate) {

        $scope.subject = SelectSemesterFactory.selected.subject;
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.chapters = [];

        $scope.dateRange = {
            startDate: moment().subtract(1, 'year').toISOString(),
            endDate: moment().toISOString()
        };

        $scope.getLessonPlan = function() {
            var obj = {
                SubjectIds: [SelectSemesterFactory.selected.subject.Id],
                ClassIds: [SelectSemesterFactory.selected.class.Id],
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
                    }
                    $scope.$broadcast('scroll.refreshComplete');
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