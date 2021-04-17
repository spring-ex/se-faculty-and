'use strict';
angular.module('smartFacultyApp')
    .controller('QuestionsController', function($scope, $state, ionicToast, TestsFactory, DashboardFactory, CriteriaFactory, SelectClassFactory, LessonPlanFactory, $ionicModal, $ionicPopup, LoginFactory) {

        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.chapters = [];
        $scope.selected = {
            chapter: null,
            topic: null
        };
        $scope.criterias = [];

        $ionicModal.fromTemplateUrl('app/Questions/AddQuestionToTestTemplate.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(criteria) {
            $scope.modal.show();
            $scope.currentCriteria = criteria;
            if ($scope.currentCriteria.Tags != null) {
                $scope.tagsToDisplay = $scope.currentCriteria.Tags.split(",");
            }
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.getAllCriteria = function() {
            CriteriaFactory.getAllCriteria($scope.selected.chapter.Id, $scope.selected.topic.Id)
                .then(function(success) {
                    $scope.criterias = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.criterias = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
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
                    $scope.chapters = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getLessonPlan();

    });