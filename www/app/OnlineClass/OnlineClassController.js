'use strict';
angular.module('smartFacultyApp')
    .controller('OnlineClassController', function($scope, ionicToast, SelectClassFactory, OnlineClassFactory, LoginFactory, ionicTimePicker) {
        $scope.class = null;
        $scope.originalTitle = SelectClassFactory.selected.subject.Nickname + " - Online Class";
        $scope.notification = {
            Title: $scope.originalTitle,
            Description: "",
            VideoURL: null,
            ImageURL: null,
            SMSBroadcastAvailable: false
        };
        var now = new Date();
        $scope.selected = {
            time: getAMPMTime(32400),
        };

        var ipObj1 = {
            callback: function(val) {
                if (typeof(val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    $scope.selected.time = getAMPMTime(val);
                }
            },
            inputTime: 32400,
            format: 12,
            step: 15,
            setLabel: 'Select'
        };

        function getAMPMTime(epoch) {
            var date_to_convert = new Date(epoch * 1000).getUTCHours() + ":" + new Date(epoch * 1000).getUTCMinutes() + ":" + new Date(epoch * 1000).getUTCSeconds();
            return tConvert(date_to_convert);
        }

        function tConvert(timeString) {
            var hourEnd = timeString.indexOf(":");
            var H = +timeString.substr(0, hourEnd);
            var h = H % 12 || 12;
            var ampm = (H < 12 || H === 24) ? " AM" : " PM";
            var secondIndex = timeString.split(':', 2).join(':').length;
            var splitTime = timeString.split(':');
            var m = parseInt(splitTime[1]);
            timeString = h.toString() + ':' + m.toString() + ampm;
            return timeString;
        }


        $scope.updateMeetingURL = function() {
            OnlineClassFactory.updateMeetingURL($scope.class)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Meeting details updated successfully', 'bottom', false, 2500);
                        $scope.getClassById();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.sendReminder = function() {
            var message = SelectClassFactory.selected.subject.Nickname + " - Online Class will start at " + $scope.selected.time + ". To join, please click on this link: " + $scope.class.MeetingURL;
            $scope.notification.Description = message;
            if ($scope.class.MeetingCredentials) {
                $scope.notification.Description += '. Meeting Credentials: ' + $scope.class.MeetingCredentials;
            }
            $scope.notification.Title = $scope.originalTitle + " @" + $scope.selected.time;
            var obj = {
                Notification: $scope.notification,
                Target: {
                    CollegeId: LoginFactory.loggedInUser.CollegeId,
                    CourseId: SelectClassFactory.selected.subject.CourseId,
                    BranchId: SelectClassFactory.selected.subject.BranchId,
                    SemesterId: SelectClassFactory.selected.subject.SemesterId,
                    ClassId: SelectClassFactory.selected.class.Id
                }
            };
            $scope.callReminder(obj);
        };

        $scope.callReminder = function(obj) {
            OnlineClassFactory.sendReminder(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Notification sent Successfully', 'bottom', false, 2500);
                        $scope.notification.Description = "";
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.startClass = function() {
            var message = SelectClassFactory.selected.subject.Nickname + " - Online Class has just started. To join, please click on this link: " + $scope.class.MeetingURL;
            $scope.notification.Description = message;
            if ($scope.class.MeetingCredentials) {
                $scope.notification.Description += '. Meeting Credentials: ' + $scope.class.MeetingCredentials;
            }
            $scope.notification.Title = $scope.originalTitle + " has just started.";
            var obj = {
                Notification: $scope.notification,
                Target: {
                    CollegeId: LoginFactory.loggedInUser.CollegeId,
                    CourseId: SelectClassFactory.selected.subject.CourseId,
                    BranchId: SelectClassFactory.selected.subject.BranchId,
                    SemesterId: SelectClassFactory.selected.subject.SemesterId,
                    ClassId: SelectClassFactory.selected.class.Id
                }
            };
            $scope.callReminder(obj);
            window.location.href = $scope.class.MeetingURL;
        };

        $scope.getClassById = function() {
            OnlineClassFactory.getClassById(SelectClassFactory.selected.class.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.class = success.data.Data[0];
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.openTimePicker = function() {
            ionicTimePicker.openTimePicker(ipObj1);
        };

        $scope.clearDetails = function() {
            $scope.class.MeetingURL = '';
            $scope.class.MeetingCredentials = '';
        };

        $scope.getClassById();
    });