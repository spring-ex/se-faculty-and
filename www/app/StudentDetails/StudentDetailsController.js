'use strict';
angular.module('smartFacultyApp')
    .controller('StudentDetailsController', function($scope, $state, StudentListFactory, $stateParams, ionicToast, $ionicHistory, $ionicPopup, LoginFactory, $ionicListDelegate, ionicDatePicker) {

        $scope.studentDetails = {};
        $scope.feesPending = 0;
        $scope.v1 = true;

        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.updatePhoneNumber = {
            StudentId: null,
            PhoneNumber: null,
            NumberType: null
        };

        $scope.updatePayment = {
            Id: null,
            FeesPaid: null
        };

        $scope.updateDOB = {
            StudentId: null,
            DateOfBirth: moment().format('YYYY-MM-DD')
        };

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.updateDOB.DateOfBirth = moment(val).format('YYYY-MM-DD');
                $scope.editDateOfBirth($scope.updateDOB.DateOfBirth);
            },
            from: new Date(1980, 0, 1), //Optional
            to: new Date(), //Optional
            setLabel: 'Update',
            titleLabel: 'Choose updated DOB',
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDateOfBirthPicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.getStudentDetails = function() {
            StudentListFactory.getStudentDetails($stateParams.studentId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.studentDetails = success.data.Data[0];
                        $scope.calculateFeesPending();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.deleteStudent = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Student',
                template: 'Are you sure you want to delete ' + $scope.studentDetails.Name + '?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    var obj = {
                        Id: $scope.studentDetails.Id
                    };
                    StudentListFactory.deleteStudent(obj)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Student was deleted successfully', 'bottom', false, 2500);
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('menu.students');
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.sendMessage = function() {
            $state.go('menu.personalMessages', { StudentId: $stateParams.studentId });
        };

        $scope.call = function(PhoneNumber) {
            var call = "tel:" + PhoneNumber;
            document.location.href = call;
        };

        $scope.email = function(email) {
            var email = "mailto:" + email;
            document.location.href = email;
        };

        $scope.calculateFeesPending = function() {
            var feesPaid = 0;
            for (var i = 0; i < $scope.studentDetails.Payment.length; i++) {
                feesPaid += parseFloat($scope.studentDetails.Payment[i].FeesPaid);
            }
            $scope.feesPending = parseFloat($scope.studentDetails.TotalFees) - feesPaid;
        };

        $scope.editPhoneNumber = function(PhoneNumber, numberType) {
            var myPopup = $ionicPopup.show({
                template: '<input type="number" ng-model="updatePhoneNumber.PhoneNumber">',
                title: "Enter updated phone number",
                scope: $scope,
                buttons: [{
                        text: 'Cancel'
                    },
                    {
                        text: '<b>Update</b>',
                        type: 'button-custom',
                        onTap: function(e) {
                            if ($scope.updatePhoneNumber.PhoneNumber.length == 0 || $scope.updatePhoneNumber.PhoneNumber < 0) {
                                ionicToast.show('Please enter proper phone number', 'bottom', false, 2500);
                                e.preventDefault();
                            } else {
                                return $scope.updatePhoneNumber;
                            }
                        }
                    }
                ]
            });

            myPopup.then(function(res) {
                if (res == undefined) {
                    myPopup.close();
                } else {
                    $scope.updatePhoneNumber.NumberType = numberType;
                    $scope.updatePhoneNumber.StudentId = $scope.studentDetails.Id;
                    StudentListFactory.updatePhoneNumber($scope.updatePhoneNumber)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Successfully updated the phone number', 'bottom', false, 2500);
                                $ionicListDelegate.closeOptionButtons();
                                $scope.updatePhoneNumber.PhoneNumber = null;
                                $scope.updatePhoneNumber.NumberType = null;
                                $scope.updatePhoneNumber.StudentId = null;
                                $scope.getStudentDetails();
                                myPopup.close();
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            });
        };

        $scope.editDateOfBirth = function(DateOfBirth) {
            $scope.updateDOB.StudentId = $scope.studentDetails.Id;
            $scope.updateDOB.DateOfBirth = moment($scope.updateDOB.DateOfBirth).format("YYYY-MM-DD");
            StudentListFactory.updateDateOfBirth($scope.updateDOB)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Successfully updated the date of birth', 'bottom', false, 2500);
                        $ionicListDelegate.closeOptionButtons();
                        $scope.updateDOB.DateOfBirth = null;
                        $scope.getStudentDetails();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.resetPassword = function() {

            if ($scope.studentDetails.PhoneNumber == null || $scope.studentDetails.PhoneNumber == "") {
                ionicToast.show('To reset password, please update the Student Contact Number', 'bottom', false, 2500);
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Reset Password?',
                    template: 'Reset password as Student Phone Number?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        var obj = {
                            StudentId: $scope.studentDetails.Id,
                            PhoneNumber: $scope.studentDetails.PhoneNumber
                        };
                        StudentListFactory.resetPassword(obj)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    ionicToast.show(success.data.Message, 'bottom', false, 2500);
                                } else {
                                    ionicToast.show('Password reset successful. The new password is same as the Student Contact Number!', 'bottom', false, 2500);
                                    $scope.getStudentDetails();
                                }
                            }, function(error) {
                                ionicToast.show(error, 'bottom', false, 2500);
                            });
                    } else {
                        console.log('You are not sure');
                    }
                });
            }
        };

        $scope.getStudentDetails();
    });