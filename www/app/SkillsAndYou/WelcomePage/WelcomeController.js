'use strict';
angular.module('smartFacultyApp')
    .controller('WelcomeController', function($scope, $state, ionicToast, WelcomeFactory, LoginFactory, SelectClassFactory) {

        $scope.selected = {
            courseId: 8, // Teachers Training hardcode
            branchId: 20, // NSDC hardcode
            semesterId: null,
            classId: null,
            student: null
        };
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.students = [];

        $scope.keywords = [];

        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.getAllCourses = function() {
            $scope.courses = [];
            var selectedValues = angular.copy($scope.selected);
            WelcomeFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.students = [];
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.selected.student = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.students = [];
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.selected.student = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.students = [];
            $scope.selected.classId = null;
            $scope.selected.student = null;
            $scope.getClasses(semesterId);
        };

        $scope.classSelected = function(classId) {
            $scope.students = [];
            $scope.selected.student = null;
            $scope.getStudents(classId);
        };

        $scope.getBranches = function(courseId) {
            WelcomeFactory.getAllBranches(courseId, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getSemesters = function(branchId) {
            WelcomeFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getClasses = function(semesterId) {
            WelcomeFactory.getAllClasses($scope.selected.branchId, semesterId, LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
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

        $scope.getStudents = function(classId) {
            WelcomeFactory.getAllByCourseBranchSem(LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, $scope.selected.branchId, $scope.selected.semesterId, classId)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                    }
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

        $scope.enterClass = function() {
            WelcomeFactory.selectedCriteria = $scope.selected;
            $state.go('observation');
        };

        $scope.logout = function() {
            LoginFactory.logout();
            $state.go('login');
        };

        $scope.getSemesters($scope.selected.branchId); // 20 is the Id for NSDC
        $scope.getAllKeywords();
    });