'use strict';
angular.module('smartFacultyApp')
    .controller('StudentAttendanceController', function($scope, $state, $filter, DashboardFactory, AttendanceListFactory, StudentListFactory, SelectClassFactory, ionicToast) {

        $scope.student = StudentListFactory.selectedStudent;

        $scope.attendance = [];

        $scope.students = DashboardFactory.StudentsInClass;
        $scope.filteredStudent = $filter('filter')($scope.students, { Id: $scope.student.Id })[0];

        $scope.getAllAttendanceForStudent = function() {
            var subjectId;
            if (SelectClassFactory.selected.subject.IsElective == "true") {
                subjectId = $scope.filteredStudent.NormalSubjectId;
            } else {
                subjectId = SelectClassFactory.selected.subject.Id;
            }
            AttendanceListFactory.getAllAttendance($scope.student.Id, subjectId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.attendance = success.data.Data;
                        // $scope.monthwiseAttendance = $scope.groupDatesMonthwise($scope.attendance);
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.groupDatesMonthwise = function(items) {
            var groups = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                ],
                itemGroupedByMonths = [],
                monthLabels = ["January", "February", "March",
                    "April", "May", "June",
                    "July", "August", "September",
                    "October", "November", "December"
                ];
            for (var i = 0; i < items.length; i++) {
                groups[new Date(items[i].AttendanceDate).getMonth()].push(items[i]);
            }
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].length) {
                    itemGroupedByMonths.push({
                        name: monthLabels[i],
                        items: groups[i]
                    });

                }
            }
            return itemGroupedByMonths;
        };

        $scope.getAllAttendanceForStudent();

    });