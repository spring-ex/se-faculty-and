'use strict';
angular.module('smartFacultyApp')
    .controller('ShowIndexController', function($scope, $state, ionicToast, $ionicHistory, TakeAttendanceFactory, ShowIndexFactory, SelectClassFactory) {

        $scope.attendanceList = TakeAttendanceFactory.attendanceList;
        $scope.topicsList = [];
        $scope.isModalOpen = false;

        $scope.chapters = [];

        for (var i = 0; i < $scope.chapters.length; i++) {
            $scope.chapters[i].show = false;
        }

        $scope.getAllChaptersAndTopicsForSubject = function() {
            ShowIndexFactory.getAllChaptersAndTopicsForSubject(SelectClassFactory.selected.subject.Id, SelectClassFactory.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        if (success.data.Code == "E001") {
                            $scope.submit();
                        } else {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        }
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error.code, 'bottom', false, 2500);
                });
        };

        $scope.submit = function() {
            var topicsTaught = [];
            for (var i = 0; i < $scope.chapters.length; i++) {
                for (var j = 0; j < $scope.chapters[i].Topics.length; j++) {
                    if ($scope.chapters[i].Topics[j].isChecked) {
                        topicsTaught.push({
                            TopicId: $scope.chapters[i].Topics[j].Id,
                            ChapterId: $scope.chapters[i].Id,
                            SubjectId: SelectClassFactory.selected.subject.Id,
                            ClassId: SelectClassFactory.selected.class.Id
                        });
                    }
                }
            }
            var attendance = {
                Attendance: $scope.attendanceList,
                TopicsTaught: topicsTaught
            }
            TakeAttendanceFactory.takeAttendance(attendance)
                .then(function(success) {
                    $scope.attendanceList = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Attendance was marked successfully', 'bottom', false, 2500);
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('menu.dashboard');
                    }
                }, function(error) {
                    ionicToast.show(error.code, 'bottom', false, 2500);
                });
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

        $scope.getAllChaptersAndTopicsForSubject();
    });