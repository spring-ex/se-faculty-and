'use strict';
angular.module('smartFacultyApp')
    .controller('AttendanceListController', function($scope, $state, DashboardFactory, StudentListFactory, ionicToast, AttendanceListFactory, SelectClassFactory) {

        $scope.student = StudentListFactory.selectedStudent;
        StudentListFactory.selectedStudent = null;
        $scope.subject = SelectClassFactory.selected.subject;
        $scope.attendance = [];
        $scope.totalPresent = 0;

        $scope.students = DashboardFactory.StudentsInClass;
        $scope.filteredStudent = $filter('filter')($scope.students, { Id: $scope.student.Id })[0];

        $scope.getAllAttendanceForStudent = function() {
            AttendanceListFactory.getAllAttendance($scope.student.Id, $scope.filteredStudent.NormalSubjectId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.attendance = success.data.Data;
                        angular.forEach($scope.attendance, function(att) {
                            att.IsPresent = (att.IsPresent == "true");
                        });
                        $scope.countAttendance();
                        // $scope.monthwiseAttendance = $scope.groupDatesMonthwise($scope.attendance);
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.attendanceChange = function(att) {
            var obj = {
                Id: att.Id ? att.Id : null,
                IsPresent: att.IsPresent.toString()
            };
            AttendanceListFactory.editAttendance(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.countAttendance();
                        ionicToast.show('Attendance was edited successfully', 'bottom', false, 2500);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })

        };

        $scope.countAttendance = function() {
            $scope.totalPresent = 0;
            for (var i = 0; i < $scope.attendance.length; i++) {
                if ($scope.attendance[i].IsPresent) {
                    $scope.totalPresent++;
                }
            }
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