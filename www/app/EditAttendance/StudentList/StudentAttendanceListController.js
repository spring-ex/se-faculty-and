'use strict';
angular.module('smartFacultyApp')
    .controller('StudentAttendanceListController', function($scope, $state, SelectClassFactory, AttendanceStatisticsFactory, LoginFactory, ionicToast, StudentListFactory) {


        $scope.ranges = [{
            Id: 1,
            Name: "All students"
        }, {
            Id: 2,
            Name: "< 50%"
        }, {
            Id: 3,
            Name: "50% - 75%"
        }, {
            Id: 4,
            Name: "> 75%"
        }];

        $scope.students = [];
        $scope.attendanceRange = $scope.ranges[0];
        $scope.attendanceStatistics = null;

        $scope.getAttendanceStatisticsByRange = function() {
            $scope.attendanceStatistics = null;
            AttendanceStatisticsFactory.getAttendanceStatisticsByRange(SelectClassFactory.selected.subject.Id, SelectClassFactory.selected.class.Id, LoginFactory.loggedInUser.CollegeId, $scope.attendanceRange.Id, SelectClassFactory.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.attendanceStatistics = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.attendanceRangeChanged = function() {
            $scope.getAttendanceStatisticsByRange();
        };

        $scope.studentSelected = function(student) {
            StudentListFactory.selectedStudent = student;
            $state.go('menu.attendanceList');
        };

        $scope.getAttendanceStatisticsByRange();
    });