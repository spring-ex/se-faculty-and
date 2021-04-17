'use strict';
angular.module('smartFacultyApp')
    .controller('CreateSmartTestController', function($scope, $state, ionicToast, ionicDatePicker, SelectClassFactory, CreateSmartTestFactory, $ionicHistory, $ionicPopup) {

        $scope.newSmartTest = {
            Name: "Quiz",
            EndDate: moment().format('YYYY-MM-DD'),
            EnableTimeConstraint: false,
            ClassId: SelectClassFactory.selected.class.Id,
            SubjectId: SelectClassFactory.selected.subject.Id,
            IsElective: SelectClassFactory.selected.subject.IsElective,
            Topics: []
        };

        $scope.chapters = [];
        $scope.selectedTopics = [];
        $scope.selectedTopicNames = [];

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.newSmartTest.EndDate = moment(val).format('YYYY-MM-DD');
            },
            from: new Date(), //Optional
            to: new Date(2040, 12, 31), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.getLessonPlanForSmartTest = function() {
            var obj = {
                SubjectId: SelectClassFactory.selected.subject.Id,
                ClassId: SelectClassFactory.selected.class.Id,
                DateRange: {
                    startDate: moment().toISOString(),
                    endDate: moment().toISOString()
                }
            };
            CreateSmartTestFactory.getLessonPlanForSmartTest(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.chapters = success.data.Data;
                        for (var i = 0; i < $scope.chapters.length; i++) {
                            $scope.chapters[i].isSelected = false;
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
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

        $scope.createSmartTest = function() {
            $scope.selectedTopicNames = [];
            for (var i = 0; i < $scope.chapters.length; i++) {
                for (var j = 0; j < $scope.chapters[i].Topics.length; j++) {
                    if ($scope.chapters[i].Topics[j].isSelected) {
                        $scope.selectedTopicNames.push($scope.chapters[i].Topics[j].Name);
                        $scope.newSmartTest.Topics.push({
                            ChapterId: $scope.chapters[i].Id,
                            TopicId: $scope.chapters[i].Topics[j].Id
                        });
                    }
                }
            }
            if ($scope.newSmartTest.Topics.length != 0) {
                $scope.enableDisableText = $scope.newSmartTest.EnableTimeConstraint ? "Enabled" : "Disabled";
                var confirmPopup = $ionicPopup.show({
                    title: 'Create Quiz',
                    templateUrl: 'app/CreateSmartTest/TopicListTemplate.html',
                    scope: $scope,
                    buttons: [{
                            text: 'Cancel'
                        },
                        {
                            text: '<b>Create</b>',
                            type: 'button-custom',
                            onTap: function(e) {
                                CreateSmartTestFactory.createSmartTest($scope.newSmartTest)
                                    .then(function(success) {
                                        if (success.data.Code != "S001") {
                                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                                        } else {
                                            ionicToast.show('Quiz created successfully', 'bottom', false, 2500);
                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });
                                            $state.go('menu.tests');
                                        }
                                    }, function(error) {
                                        ionicToast.show(error, 'bottom', false, 2500);
                                    });
                            }
                        }
                    ]
                });
            } else {
                ionicToast.show('Please select at least 1 topic', 'bottom', false, 2500);
            }
        };

        $scope.checkAll = function(chapterIndex, $event) {
            $event.stopPropagation();
            $scope.chapters[chapterIndex].isSelected = !$scope.chapters[chapterIndex].isSelected;
            if ($scope.chapters[chapterIndex].isSelected) {
                for (var i = 0; i < $scope.chapters[chapterIndex].Topics.length; i++) {
                    $scope.chapters[chapterIndex].Topics[i].isSelected = true;
                }
            } else {
                for (var i = 0; i < $scope.chapters[chapterIndex].Topics.length; i++) {
                    $scope.chapters[chapterIndex].Topics[i].isSelected = false;
                }
            }
        };

        $scope.topicSelected = function(topicIndex, chapterIndex) {
            if (!$scope.chapters[chapterIndex].Topics[topicIndex].isSelected) {
                $scope.chapters[chapterIndex].isSelected = false;
            } else {
                var flag = 1;
                for (var i = 0; i < $scope.chapters[chapterIndex].Topics.length; i++) {
                    if (!$scope.chapters[chapterIndex].Topics[i].isSelected) {
                        flag = 0;
                    }
                }
                if (flag) {
                    $scope.chapters[chapterIndex].isSelected = true;
                }
            }
        };

        $scope.getLessonPlanForSmartTest();
    });