'use strict';
angular.module('smartFacultyApp')
    .controller('SelectClassController', function($scope, $state, StudentListFactory, LoginFactory, ionicToast, SelectClassFactory) {

        $scope.name = LoginFactory.loggedInUser.Name;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.subjects = [];
        $scope.classes = [];
        $scope.selected = {
            subject: null,
            class: null
        };
        $scope.keywords = [];

        $scope.errorMessage = null;

        $scope.subjectSelected = function(selectedSubject) {
            $scope.selected.subject = selectedSubject;
            if ($scope.selected.subject.IsElective == undefined) {
                $scope.selected.subject.IsElective = "true";
            }
            if ($scope.selected.subject.CourseId == 1 && LoginFactory.loggedInUser.Type == 'SCHOOL') { //if course is a preschool
                LoginFactory.loggedInUser.OldPackageCode = LoginFactory.loggedInUser.PackageCode;
                LoginFactory.loggedInUser.PackageCode = 'LM';
            } else {
                LoginFactory.loggedInUser.PackageCode = LoginFactory.loggedInUser.OldPackageCode;
            }
            SelectClassFactory.getAllClassesForSubject($scope.selected.subject.Id, LoginFactory.loggedInUser.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.classSelected = function(selectedClass) {
            $scope.selected.class = selectedClass;
        };

        $scope.enterClass = function() {
            if ($scope.selected.subject == null || $scope.selected.class == null) {
                ionicToast.show('Please choose subject and a class to proceed', 'bottom', false, 2500);
            } else {
                SelectClassFactory.selected.subject = $scope.selected.subject;
                SelectClassFactory.selected.class = $scope.selected.class;
                $state.go('menu.dashboard');
            }
        };

        $scope.getAllSubjectsForUser = function() {
            SelectClassFactory.getAllSubjectsForUser(LoginFactory.loggedInUser.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllKeywords = function() {
            SelectClassFactory.getAllKeywords(LoginFactory.loggedInUser.Type)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.keywords = success.data.Data[0];
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.logout = function() {
            LoginFactory.logout();
            $state.go('login');
        };

        $scope.studentsClicked = function(from) {
            $state.go('selectSemester', { from: from });
        };

        $scope.eventsClicked = function() {
            $state.go('events');
        };

        $scope.calendarClicked = function() {
            $state.go('calendar');
        };

        $scope.passwordClicked = function() {
            $state.go('changePassword');
        };

        $scope.attendanceClicked = function() {
            $state.go('specialAttendance');
        };

        $scope.elearningClicked = function() {
            $state.go('elearning');
        };

        $scope.getAllSubjectsForUser();
        $scope.getAllKeywords();
    });