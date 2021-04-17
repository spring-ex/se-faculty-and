'use strict';
angular.module('smartFacultyApp')
    .controller('SpecialAttendanceListController', function($scope, $state, $ionicPopover, ionicDatePicker, SelectClassFactory, StudentListFactory, LoginFactory, ionicToast, SpecialAttendanceFactory) {

        $scope.students = [];
        $scope.attendanceList = [];
        $scope.presentCount = 0;
        $scope.class = SpecialAttendanceFactory.selectedClass.Id;
        $scope.collegeId = LoginFactory.loggedInUser.CollegeId;
        $scope.keywords = SelectClassFactory.keywords;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.selected = {
            attendanceDate: moment().format('YYYY-MM-DD H:mm:ss')
        };
        var ipObj1 = {
            callback: function(val) { //Mandatory
                var now = new Date();
                $scope.selected.attendanceDate = moment(val).set({ h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() }).format('YYYY-MM-DD H:mm:ss');
            },
            from: new Date(2010, 0, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.getAllStudents = function() {
            StudentListFactory.getAllByCourseBranchSem(LoginFactory.loggedInUser.CollegeId, SpecialAttendanceFactory.selectedCourse, SpecialAttendanceFactory.selectedBranch, SpecialAttendanceFactory.selectedSemester, SpecialAttendanceFactory.selectedClass)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                        $scope.selectAll();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.gotoSubjects = function() {
            SpecialAttendanceFactory.selectedStudents = $scope.students;
            SpecialAttendanceFactory.selectedDate = $scope.selected.attendanceDate;
            $state.go('specialAttendanceSubjects');
        };

        $scope.updateStudentsCount = function() {
            $scope.presentCount = 0;
            angular.forEach($scope.students, function(student) {
                if (student.isPresent) {
                    $scope.presentCount++;
                }
            });
        };

        $ionicPopover.fromTemplateUrl('app/TakeAttendance/SelectUnselectTemplate.html', {
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

        $scope.selectAll = function() {
            for (var i = 0; i < $scope.students.length; i++) {
                $scope.students[i].isPresent = true;
            };
            $scope.updateStudentsCount();
            $scope.closePopover();
        };

        $scope.unselectAll = function() {
            for (var i = 0; i < $scope.students.length; i++) {
                $scope.students[i].isPresent = false;
            };
            $scope.updateStudentsCount();
            $scope.closePopover();
        };

        function twoDigits(d) {
            if (0 <= d && d < 10) return "0" + d.toString();
            if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
            return d.toString();
        }
        Date.prototype.toMysqlFormat = function() {
            return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
        }

        $scope.getAllStudents();
    });