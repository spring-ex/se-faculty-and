'use strict';
angular.module('smartFacultyApp')
    .controller('AssignmentsController', function($scope, $state, AssignmentFactory, TakeAttendanceFactory, ionicToast, SelectClassFactory, LoginFactory, $ionicPopover) {

        $scope.assignments = [];
        $scope.years = [];
        $scope.currentYear = AssignmentFactory.currentYear;
        $scope.createdAt = moment(LoginFactory.loggedInUser.CreatedAt).format('YYYY');

        $ionicPopover.fromTemplateUrl('app/Assignments/AssignmentList/AssignmentYearTemplate.html', {
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

        $scope.addAssignment = function() {
            $state.go('menu.publishAssignment');
        };

        $scope.assignmentSelected = function(assignment) {
            AssignmentFactory.currentYear = $scope.currentYear;
            AssignmentFactory.selectedAssignment = assignment;
            $state.go('menu.assignmentDetails');
        };

        $scope.getAllAssignments = function(year) {
            var obj = {
                SubjectIds: AssignmentFactory.SubjectIds,
                ClassIds: AssignmentFactory.ClassIds,
                Year: year
            };
            $scope.assignments = [];
            AssignmentFactory.getAllAssignments(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.assignments = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllStudentsInClass = function() {
            TakeAttendanceFactory.getAllStudentsInClass(LoginFactory.loggedInUser.CollegeId, SelectClassFactory.selected.subject.Id, SelectClassFactory.selected.class.Id, SelectClassFactory.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        AssignmentFactory.Students = [];
                        AssignmentFactory.ClassIds = [];
                        AssignmentFactory.SubjectIds = [];
                        AssignmentFactory.Students = success.data.Data;
                        AssignmentFactory.ClassIds = $scope.getUniqueIds(AssignmentFactory.Students, 'ClassId');
                        if (SelectClassFactory.selected.subject.IsElective == "true") {
                            AssignmentFactory.SubjectIds = $scope.getUniqueIds(AssignmentFactory.Students, 'NormalSubjectId');
                        } else {
                            AssignmentFactory.SubjectIds.push(SelectClassFactory.selected.subject.Id);
                        }
                        $scope.getAllAssignments($scope.currentYear);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getUniqueIds = function(array, key) {
            return AssignmentFactory.Students.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        $scope.getYearList = function() {
            for (var i = parseInt($scope.createdAt); i <= new Date().getFullYear(); i++) {
                $scope.years.push(i);
            }
        };

        $scope.yearSelected = function(year) {
            $scope.currentYear = year;
            $scope.closePopover();
            $scope.getAllAssignments(year);
        };

        $scope.getYearList();
        $scope.getAllStudentsInClass();
    });