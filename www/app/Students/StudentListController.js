'use strict';
angular.module('smartFacultyApp')
    .controller('StudentListController', function($scope, $state, LoginFactory, StudentListFactory, SelectSemesterFactory, ionicToast, $ionicPopover) {

        $scope.students = [];
        $scope.classes = [];
        $scope.selectedClass = null;

        $scope.getClasses = function() {
            SelectSemesterFactory.getAllClasses(SelectSemesterFactory.selected.branch.Id, SelectSemesterFactory.selected.semester.Id, LoginFactory.loggedInUser.CollegeId, SelectSemesterFactory.selected.course.Id, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                        $scope.selectedClass = $scope.classes[0];
                        $scope.getAllStudents();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.classSelected = function(cls) {
            $scope.selectedClass = cls;
            $scope.getAllStudents();
        };

        $scope.getAllStudents = function() {
            $scope.closePopover();
            SelectSemesterFactory.selected.class = $scope.selectedClass;
            StudentListFactory.getAllByCourseBranchSem(LoginFactory.loggedInUser.CollegeId, SelectSemesterFactory.selected.course.Id, SelectSemesterFactory.selected.branch.Id, SelectSemesterFactory.selected.semester.Id, $scope.selectedClass.Id)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.studentSelected = function(student) {
            StudentListFactory.selectedStudent = student;
            $state.go('studentDetails', { studentId: student.Id });
        };

        $ionicPopover.fromTemplateUrl('app/Students/SelectClassTemplate.html', {
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

        $scope.getClasses();
    });