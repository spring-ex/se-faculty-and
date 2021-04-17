'use strict';
angular.module('smartFacultyApp')
    .controller('ChapterAndTopicsController', function($scope, $state, ionicToast, SelectClassFactory, LessonPlanFactory, CriteriaFactory) {

        $scope.chapters = [];
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
                        if (CriteriaFactory.selectedChapterIndex != null) {
                            $scope.toggleChapter($scope.chapters[CriteriaFactory.selectedChapterIndex]);
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.toggleChapter = function(chapter) {
            chapter.show = !chapter.show;
            for (var i = 0; i < $scope.chapters.length; i++) {
                if ($scope.chapters[i].Id != chapter.Id) {
                    $scope.chapters[i].show = false;
                }
            }
        };

        $scope.isChapterShown = function(chapter) {
            return chapter.show;
        };

        $scope.proceed = function() {
            var topics = [];
            for (var i = 0; i < $scope.chapters.length; i++) {
                for (var j = 0; j < $scope.chapters[i].Topics.length; j++) {
                    if ($scope.chapters[i].Topics[j].isSelected) {
                        topics.push({
                            ChapterId: $scope.chapters[i].Id,
                            TopicId: $scope.chapters[i].Topics[j].Id
                        });
                    }
                }
            }
            CriteriaFactory.Topics = topics;
            if (topics.length == 0) {
                ionicToast.show('Choose atleast one topic', 'bottom', false, 2500);
            } else {
                $state.go('menu.enterCriteria');
            }
        };

        $scope.getLessonPlan();
    });