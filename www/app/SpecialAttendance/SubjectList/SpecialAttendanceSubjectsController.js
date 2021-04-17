'use strict';
angular.module('smartFacultyApp')
    .controller('SpecialAttendanceSubjectsController', function($scope, $state, ionicToast, LoginFactory, ObservationFactory, SpecialAttendanceFactory) {

        $scope.subjects = [];

        $scope.getAllSubjects = function() {
            ObservationFactory.getAllSubjects(SpecialAttendanceFactory.selectedCourse, SpecialAttendanceFactory.selectedBranch, SpecialAttendanceFactory.selectedSemester)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show('There are no subjects for this course!', 'bottom', false, 2500);
                    } else {
                        $scope.subjects = success.data.Data;
                        var obj = {
                            ClassId: SpecialAttendanceFactory.selectedStudents[0].ClassId,
                            Day: moment(SpecialAttendanceFactory.selectedDate).format('dddd')
                        };
                        console.log(obj);
                        SpecialAttendanceFactory.getDaysTimetable(obj)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    ionicToast.show('Timetable has not been set for this day!');
                                } else {
                                    $scope.timeTable = success.data.Data;
                                    for (var i = 0; i < $scope.subjects.length; i++) {
                                        for (var j = 0; j < $scope.timeTable.length; j++) {
                                            if ($scope.subjects[i].Id == $scope.timeTable[j].SubjectId) {
                                                $scope.subjects[i].isSelected = true;
                                            }
                                        }
                                    }
                                }
                            }, function(error) {
                                ionicToast.show(error);
                            });
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.submitAttendance = function() {
            var obj = {
                AttendanceDate: SpecialAttendanceFactory.selectedDate,
                TakenBy: LoginFactory.loggedInUser.Id,
                ClassId: SpecialAttendanceFactory.selectedStudents[0].ClassId,
                Students: SpecialAttendanceFactory.selectedStudents,
                Subjects: $scope.subjects.filter(s => s.isSelected == true)
            };
            SpecialAttendanceFactory.takeSpecialAttendance(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show('There was a problem. Please try later!', 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Attendance submitted successfully!', 'bottom', false, 2500);
                        $state.go('selectClass');
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllSubjects();

    });