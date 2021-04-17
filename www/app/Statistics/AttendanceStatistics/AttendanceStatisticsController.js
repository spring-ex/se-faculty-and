'use strict';
angular.module('smartFacultyApp')
    .controller('AttendanceStatisticsController', function($scope, $state, SelectClassFactory, ionicToast, AttendanceStatisticsFactory, LoginFactory, StudentListFactory) {

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

        $scope.keywords = SelectClassFactory.keywords;

        $scope.selected = {
            range: $scope.ranges[0]
        };

        $scope.rangeSelected = function(range) {
            $scope.getAttendanceStatisticsByRange();
        };

        $scope.getAttendanceStatisticsByRange = function() {
            AttendanceStatisticsFactory.getAttendanceStatisticsByRange(SelectClassFactory.selected.subject.Id, SelectClassFactory.selected.class.Id, LoginFactory.loggedInUser.CollegeId, $scope.selected.range.Id, SelectClassFactory.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.attendanceStats = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.studentSelected = function(student) {
            StudentListFactory.selectedStudent = student;
            $state.go('menu.studentStatistics');
        };

        $scope.getAttendanceStatisticsByRange();
    });