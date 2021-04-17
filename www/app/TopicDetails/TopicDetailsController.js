'use strict';
angular.module('smartFacultyApp')
    .controller('TopicDetailsController', function($scope, $state, LessonPlanFactory, $sce, $ionicHistory, TopicDetailsFactory, ionicToast, $ionicSlideBoxDelegate, LoginFactory, $cordovaInAppBrowser, $ionicLoading, SelectClassFactory, $ionicPopover) {

        $scope.topic = LessonPlanFactory.selectedTopic;
        $scope.chapter = LessonPlanFactory.selectedChapter;
        $scope.subTopics = [];
        $scope.presentationURL = null;
        $scope.questionCount = 0;
        $scope.isModal1Open = false;
        $scope.isModal2Open = false;
        $scope.keywords = SelectClassFactory.keywords;
        if (typeof $scope.topic.VideoURL == "string") {
            $scope.topic.VideoURL = $sce.trustAsResourceUrl($scope.topic.VideoURL);
        }

        $scope.smartLearning = function() {
            $state.go('smartLearning');
        };

        $scope.exitTest = function() {
            $state.go('menu.lessonPlan', { from: 'syllabus' });
        };

        $scope.getAllSubTopics = function() {
            $scope.subTopics = [];
            TopicDetailsFactory.subTopics = [];
            var obj = {
                TopicIds: [$scope.topic.Id],
                UserId: LoginFactory.loggedInUser.Id
            };
            TopicDetailsFactory.getAllSubTopics(obj)
                .then(function(success) {
                    if (success.data.Code == "S001") {
                        $scope.subTopics = success.data.Data;
                        for (var i = 0; i < $scope.subTopics.length; i++) {
                            $scope.subTopics[i].VideoURL = $sce.trustAsResourceUrl($scope.subTopics[i].VideoURL);
                        }
                        TopicDetailsFactory.subTopics = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getPresentationURL = function() {
            $scope.presentationURL = [];
            TopicDetailsFactory.getPresentationURL($scope.topic.Id, LoginFactory.loggedInUser.CollegeId, SelectClassFactory.selected.class.Id)
                .then(function(success) {
                    if (success.data.Code == "S001") {
                        $scope.presentationURL = success.data.Data;
                        $ionicSlideBoxDelegate.slide(0);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getDefaultTopicPresentationURL = function() {
            $scope.defaultPresentationURL = [];
            TopicDetailsFactory.getTopicDefaultPresentationURL($scope.chapter.Id, $scope.topic.Id)
                .then(function(success) {
                    if (success.data.Code == "S001") {
                        $scope.defaultPresentationURL = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getQuestionCountForTopic = function() {
            TopicDetailsFactory.getQuestionCountForTopic($scope.topic.Id)
                .then(function(success) {
                    if (success.data.Code == "S001") {
                        $scope.questionCount = success.data.Data[0].NumberOfQuestions;
                    }
                }, function(error) {
                    ionicToast.show(error.code, 'bottom', false, 2500);
                });
        };

        $scope.getPresentationURL();
        $scope.getDefaultTopicPresentationURL();
        $scope.getQuestionCountForTopic();
        $scope.getAllSubTopics();

        //youtube code
        $scope.playVideo = function(videoURL) {
            var url = $sce.getTrustedResourceUrl(videoURL);
            if (url.indexOf('youtube') == -1) {
                window.VrView.playVideo(url);
            } else {
                // window.screen.orientation.lock('landscape');
                // var ref = cordova.InAppBrowser.open(url, '_blank', 'location=no,clearcache=yes,hideurlbar=yes,zoom=no,useWideViewPort=no,transitionstyle=fliphorizontal');
                // ref.addEventListener('exit', function() {
                //     window.screen.orientation.unlock();
                // });
                TopicDetailsFactory.selectedVideo = url;
                $state.go('video');
            }
        };

        $scope.slideVisible = function(index) {
            if (index < $ionicSlideBoxDelegate.currentIndex() - 1 ||
                index > $ionicSlideBoxDelegate.currentIndex() + 1) {
                return false;
            }
            return true;
        };

        $ionicPopover.fromTemplateUrl('app/TopicDetails/ViewTopicPresentations.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };

        $scope.closePopover = function() {
            $scope.popover.hide();
        };


        //document viewer
        $scope.openPDF = function(flag) {
            $scope.closePopover();
            var url;
            if (flag == 1) {
                url = $scope.defaultPresentationURL[0].MediaURL;
            } else if (flag == 2) {
                url = $scope.presentationURL[0].MediaURL;
            } else {
                url = $scope.topic.QuestionsMediaURL;
            }
            var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'yes',
                shouldPauseOnSuspend: 'yes'
            };
            $cordovaInAppBrowser.open(url, '_blank', options)
                .then(function(event) {
                    // success
                    console.log(event);
                })
                .catch(function(event) {
                    // error
                    console.log(event);
                });
        };
        // window.screen.orientation.unlock();

    });