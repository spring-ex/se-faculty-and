'use strict';
angular.module('smartFacultyApp')
    .controller('SelectSemesterController', function($scope, $stateParams, $state, ObservationFactory, SelectSemesterFactory, LoginFactory, ionicToast, SelectClassFactory) {

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.students = [];

        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.from = $stateParams.from;

        $scope.selected = {
            course: "",
            branch: "",
            semester: ""
        };

        $scope.keywords = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            SelectSemesterFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
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

        $scope.courseSelected = function(course) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.selected.branch = null;
            $scope.selected.semester = null;
            $scope.getBranches(course.Id);
        };

        $scope.branchSelected = function(branch) {
            $scope.semesters = [];
            $scope.selected.semester = null;
            $scope.getSemesters(branch.Id);
        };

        $scope.getAllStudents = function() {
            if ($scope.selected.course == "" || $scope.selected.branch == "" || $scope.selected.semester == "" ||
                $scope.selected.course == null || $scope.selected.branch == null || $scope.selected.semester == null) {
                ionicToast.show('Please choose from the dropdowns to proceed', 'bottom', false, 2500);
            } else {
                SelectSemesterFactory.selected.course = $scope.selected.course;
                SelectSemesterFactory.selected.branch = $scope.selected.branch;
                SelectSemesterFactory.selected.semester = $scope.selected.semester;
                SelectSemesterFactory.selected.subject = $scope.selected.subject;
                SelectSemesterFactory.selected.class = $scope.selected.class;
                if ($stateParams.from == 'students') {
                    $state.go('studentList');
                } else {
                    $state.go('chapters');
                }
            }
        };

        $scope.getBranches = function(courseId) {
            SelectSemesterFactory.getAllBranches(courseId, LoginFactory.loggedInUser.CollegeId)
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
            SelectSemesterFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.selected.course.Id, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.semesters = success.data.Data;
                        $scope.selected.semester = $scope.semesters[0];
                        if ($stateParams.from == 'elearning' && $scope.loggedInUser.Type != 'COLLEGE') {
                            $scope.getAllSubjects();
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllSubjects = function() {
            $scope.subjects = [];
            SelectSemesterFactory.getAllNonElectiveSubjects($scope.selected.course.Id, $scope.selected.branch.Id, $scope.selected.semester.Id)
                .then(function(success) {
                    $scope.subjects = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no subjects in this selection');
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.subjectSelected = function(subject) {
            $scope.classes = [];
            SelectClassFactory.getAllClassesForSubject(subject.Id, LoginFactory.loggedInUser.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                        SelectClassFactory.selected.class = $scope.classes[0];
                        $scope.selected.class = $scope.classes[0];
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

        $scope.getAllKeywords();

        $scope.getAllCourses();
    });