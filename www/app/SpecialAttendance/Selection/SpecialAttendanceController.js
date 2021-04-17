'use strict';
angular.module('smartFacultyApp')
    .controller('SpecialAttendanceController', function($scope, $state, ionicToast, SelectClassFactory, SelectSemesterFactory, LoginFactory, SpecialAttendanceFactory) {

        $scope.keywords = SelectClassFactory.keywords;
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.selected = {
            branch: null,
            semester: null,
            class: null
        };

        $scope.getAllBranchesForUser = function() {
            SpecialAttendanceFactory.getAllBranchesForUser(LoginFactory.loggedInUser.Id)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error.code, 'bottom', false, 2500);
                });
        };

        $scope.branchSelected = function(branch) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.semester = null;
            $scope.selected.class = null;
            SelectSemesterFactory.getAllSemesters(branch.Id, LoginFactory.loggedInUser.CollegeId, $scope.selected.branch.CourseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.semesters = success.data.Data;
                        $scope.selected.semester = $scope.semesters[0];
                        $scope.semesterSelected($scope.selected.semester);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.semesterSelected = function(semester) {
            $scope.classes = [];
            $scope.selected.class = null;
            SelectSemesterFactory.getAllClasses($scope.selected.branch.Id, semester.Id, LoginFactory.loggedInUser.CollegeId, $scope.selected.branch.CourseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.takeAttendance = function() {
            if ($scope.selected.class == null) {
                ionicToast.show('Please choose a class to proceed', 'bottom', false, 2500);
            } else {
                SpecialAttendanceFactory.selectedClass = $scope.selected.class.Id;
                SpecialAttendanceFactory.selectedCourse = $scope.selected.branch.CourseId;
                SpecialAttendanceFactory.selectedBranch = $scope.selected.branch.Id;
                SpecialAttendanceFactory.selectedSemester = $scope.selected.semester.Id;
                $state.go('specialAttendanceList');
            }
        };

        $scope.getAllBranchesForUser();

    });