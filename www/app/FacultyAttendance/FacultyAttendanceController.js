'use strict';
angular.module('smartFacultyApp')
    .controller('FacultyAttendanceController', function($scope, ionicToast, DashboardFactory, SelectClassFactory, FacultyAttendanceFactory) {

        $scope.attendance = [];

        $scope.getAllAttendanceForFaculty = function() {
            var obj = {
                ClassIds: DashboardFactory.ClassIds,
                SubjectIds: DashboardFactory.SubjectIds,
                IsElective: SelectClassFactory.selected.subject.IsElective,
                SpecialClassId: null
            }
            if (obj.IsElective == "true") {
                obj.SpecialClassId = SelectClassFactory.selected.class.Id
            }
            FacultyAttendanceFactory.getAllAttendance(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.attendance = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getAllAttendanceForFaculty();

    });