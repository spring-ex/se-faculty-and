'use strict';
angular.module('smartFacultyApp')
    .controller('CriteriaListController', function($scope, $state, ionicToast, TestsFactory, DashboardFactory, CriteriaFactory, SelectClassFactory, LessonPlanFactory, $ionicModal, $ionicPopup, LoginFactory) {

        $scope.criterias = [];
        $scope.currentCriteria = null;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.chapters = [];
        $scope.selected = {
            chapter: null,
            topic: null
        };
        $scope.test = TestsFactory.selectedTest;
        $scope.questions = [];
        $scope.options = {
            initialSlide: 0,
            onInit: function(swiper) {
                $scope.swiper = swiper;
            },
            onSlideChangeEnd: function(swiper) {
                $scope.currentPage = swiper.activeIndex;
                if ($scope.currentPage == 0) {
                    $scope.getQuestionPaper();
                } else {
                    if ($scope.selected.chapter != null) {
                        $scope.getAllCriteria();
                    } else {
                        $scope.getLessonPlan();
                    }
                }
            }
        };
        $scope.newQuestion = {
            TestId: TestsFactory.selectedTest.Id,
            CriteriaId: null,
            MaxScore: null,
            COId: null,
            BTId: null
        };

        $ionicModal.fromTemplateUrl('app/Criteria/CriteriaList/AddCriteriaToTestTemplate.html', {
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
            $scope.newQuestion.BTId = criteria.BTId;
            $scope.newQuestion.CriteriaId = criteria.Id;
            $scope.getAllCOAndBT();
        };
        $scope.closeModal = function() {
            $scope.newQuestion.CriteriaId = null;
            $scope.newQuestion.MaxScore = null;
            $scope.newQuestion.COId = null;
            $scope.newQuestion.BTId = null;
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
                        $scope.hidePlusForAddedQuestions();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.addCriteria = function() {
            $state.go('menu.chapterAndTopics', { from: 'tests' });
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

        $scope.getQuestionPaper = function() {
            CriteriaFactory.getQuestionPaper(TestsFactory.selectedTest.Id)
                .then(function(success) {
                    $scope.questions = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.questions = success.data.Data;
                        $scope.hidePlusForAddedQuestions();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getAllCOAndBT = function() {
            var obj = {
                SubjectIds: DashboardFactory.SubjectIds,
                ClassIds: DashboardFactory.ClassIds
            }
            CriteriaFactory.getCourseOutcomes(obj)
                .then(function(success) {
                    $scope.cos = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.cos = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });

            CriteriaFactory.getBloomsTaxonomy()
                .then(function(success) {
                    $scope.bts = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.bts = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.addQuestion = function() {
            if ($scope.newQuestion.MaxScore == null || $scope.newQuestion.MaxScore == undefined) {
                ionicToast.show('Please enter max marks', 'bottom', false, 2500);
            } else {
                if ($scope.loggedInUser.Type == 'OBE' && ($scope.newQuestion.BTId == null || $scope.newQuestion.COId == null)) {
                    ionicToast.show('Please enter Course Outcome and Blooms Level', 'bottom', false, 2500);
                } else {
                    CriteriaFactory.addQuestionToTest($scope.newQuestion)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Question added to question paper!', 'bottom', false, 2500);
                                $scope.closeModal();
                                $scope.getQuestionPaper();
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            }
        };

        $scope.removeQuestionFromTest = function(question) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Question',
                template: 'Are you sure you want to remove this question from question paper?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    var obj = {
                        TestId: TestsFactory.selectedTest.Id,
                        CriteriaId: question.Id
                    }
                    CriteriaFactory.removeQuestionFromTest(obj)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Question removed from question paper!', 'bottom', false, 2500);
                                $scope.getQuestionPaper();
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            });

        };

        $scope.hidePlusForAddedQuestions = function() {
            for (var j = 0; j < $scope.criterias.length; j++) {
                $scope.criterias[j].isAlreadyPresent = false;
                for (var i = 0; i < $scope.questions.length; i++) {
                    if ($scope.questions[i].Id == $scope.criterias[j].Id) {
                        $scope.criterias[j].isAlreadyPresent = true;
                    }
                }
            }
        };

        $scope.getQuestionPaper();

    });