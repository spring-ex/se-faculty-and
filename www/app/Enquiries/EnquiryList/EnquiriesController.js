'use strict';
angular.module('smartFacultyApp')
    .controller('EnquiriesController', function($scope, $state, $filter, ionicToast, EnquiriesFactory, LoginFactory, $ionicPopover, $ionicPopup, $rootScope) {

        $rootScope.$broadcast('userLoggedIn');
        $scope.enquiries = [];
        $scope.send = {
            Message: null
        };

        $scope.selected = {
            LikelyToJoin: null,
            Note: null
        };

        $scope.branches = [];
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.getAllEnquiries = function() {
            $scope.enquiries = [];
            EnquiriesFactory.getAllEnquiries(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.enquiries = success.data.Data;
                        $scope.searchableEnquiries = $scope.enquiries;
                        $scope.selectAll();
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $ionicPopover.fromTemplateUrl('app/Enquiries/FilterEnquiries.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
            $scope.getAllBranches();
        };

        $scope.closePopover = function() {
            $scope.popover.hide();
        };

        $scope.call = function(enquiry) {
            var call = "tel:" + enquiry.PhoneNumber;
            document.location.href = call;
        };

        $scope.edit = function(enquiry) {
            EnquiriesFactory.selectedEnquiry = enquiry;
            $state.go('menu.addEnquiry', { isEdit: 1 });
        };

        $scope.sendSMS = function() {
            var smsNumbers = [];
            $scope.send = {
                Message: null
            };
            for (var i = 0; i < $scope.enquiries.length; i++) {
                if ($scope.enquiries[i].isChecked) {
                    smsNumbers.push($scope.enquiries[i].PhoneNumber);
                }
            };
            if (smsNumbers.length == 0) {
                ionicToast.show('Please select at least 1 enquiry to send SMS', 'bottom', false, 2500);
            } else {
                var myPopup = $ionicPopup.show({
                    template: '<textarea ng-model="send.Message" rows="5" placeholder="Message.."></textarea>',
                    title: "Enter a message",
                    scope: $scope,
                    buttons: [{
                            text: 'Cancel'
                        },
                        {
                            text: '<b>Send</b>',
                            type: 'button-custom',
                            onTap: function(e) {
                                if ($scope.send.Message == "") {
                                    ionicToast.show('Please enter proper message', 'bottom', false, 2500);
                                    e.preventDefault();
                                } else {
                                    return $scope.send.Message;
                                }
                            }
                        }
                    ]
                });

                myPopup.then(function(res) {
                    if (res == undefined) {
                        myPopup.close();
                    } else {
                        $scope.send = {
                            PhoneNumbers: smsNumbers,
                            Message: $scope.send.Message
                        };
                        EnquiriesFactory.sendSms($scope.send)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    ionicToast.show(success.data.Message, 'bottom', false, 2500);
                                } else {
                                    ionicToast.show('SMS sent successfully', 'bottom', false, 2500);
                                }
                            }, function(error) {
                                ionicToast.show(error);
                            });
                    }
                });
            }
        };

        $scope.selectAll = function() {
            for (var i = 0; i < $scope.enquiries.length; i++) {
                $scope.enquiries[i].isChecked = true;
            };
        };

        $scope.searchEnquiry = function() {
            $scope.enquiries = [];
            var values = [];
            for (var i = 0; i < $scope.branches.length; i++) {
                if ($scope.branches[i].isSelected) {
                    values = $filter('filter')($scope.searchableEnquiries, $scope.branches[i].Name);
                    $scope.enquiries = $scope.enquiries.concat(values);
                }
            }
            $scope.closePopover();
        };

        $scope.$watch('send.Message', function(newVal, oldVal) {
            if (newVal != undefined && newVal.length > 160) {
                $scope.send.Message = oldVal;
            }
        });

        $scope.addEnquiry = function() {
            $state.go('menu.addEnquiry', { isEdit: 0 });
        };

        $scope.delete = function(enquiry) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Enquiry',
                template: 'Are you sure you want to delete this enquiry?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    EnquiriesFactory.deleteEnquiry(enquiry)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Enquiry was deleted successfully', 'bottom', false, 2500);
                                $scope.getAllEnquiries();
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.getAllBranches = function() {
            $scope.branches = [];
            EnquiriesFactory.getAllBranchesForCollege(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.logout = function() {
            LoginFactory.logout();
            $state.go('login');
        };

        $scope.getAllEnquiries();
    });