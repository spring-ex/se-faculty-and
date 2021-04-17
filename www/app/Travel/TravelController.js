'use strict';
angular.module('smartFacultyApp')
    .controller('TravelController', function($scope, $state, TravelFactory, LoginFactory, $cordovaGeolocation, $interval, ionicToast, $ionicPopup) {

        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.startPromise = null;
        $scope.endPromise = null;
        $scope.pickup = 1;
        $scope.options = {
            initialSlide: 0,
            onInit: function(swiper) {
                $scope.swiper = swiper;
            },
            onSlideChangeEnd: function(swiper) {
                if (swiper.activeIndex == 0) {
                    $scope.pickup = 1;
                } else {
                    $scope.pickup = 0;
                }
            }
        };

        $scope.startTravel = function() {
            $scope.getAllStudentsByRoute();
            $scope.startPromise = $interval(function() {
                $cordovaGeolocation.getCurrentPosition({
                    enableHighAccuracy: true
                }).then(function(position) {
                    TravelFactory.updateRoute($scope.loggedInUser.RouteId, position.coords.latitude, position.coords.longitude)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                console.log(success.data.Data);
                            }
                            $scope.$broadcast('scroll.refreshComplete');
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }, function(err) {
                    console.log(err);
                });
            }, 1000 * 10);
        };

        $scope.stopTravel = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Stop travel',
                template: 'Are you sure you want to stop travel?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    TravelFactory.updateRoute($scope.loggedInUser.RouteId, null, null)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                $interval.cancel($scope.startPromise);
                                $scope.startPromise = null;
                                $scope.busReachedDestination(1);
                                $scope.students = [];
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            });
        };

        $scope.startReturnTravel = function() {
            $scope.getAllStudentsByRoute();
            $scope.endPromise = $interval(function() {
                $cordovaGeolocation.getCurrentPosition({
                    enableHighAccuracy: true
                }).then(function(position) {
                    TravelFactory.updateRoute($scope.loggedInUser.RouteId, position.coords.latitude, position.coords.longitude)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                console.log(success.data.Data);
                            }
                            $scope.$broadcast('scroll.refreshComplete');
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }, function(err) {
                    console.log(err);
                });
            }, 1000 * 10);
        };

        $scope.stopReturnTravel = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Stop travel',
                template: 'Are you sure you want to stop travel?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    TravelFactory.updateRoute($scope.loggedInUser.RouteId, null, null)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                $interval.cancel($scope.endPromise);
                                $scope.endPromise = null;
                                $scope.students = [];
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            });
        };

        $scope.logout = function() {
            LoginFactory.logout();
            $state.go('login');
        };

        $scope.getAllStudentsByRoute = function() {
            TravelFactory.getStudentsByRoute($scope.loggedInUser.RouteId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                        if ($scope.pickup) {
                            for (var i = 0; i < $scope.students.length; i++) {
                                $scope.students[i].HasBoarded = false;
                            }
                        } else {
                            for (var i = 0; i < $scope.students.length; i++) {
                                $scope.students[i].HasBoarded = true;
                            }
                            $scope.busReachedDestination(0);
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.studentBoardsBus = function(student) {
            if (student.HasBoarded) {
                TravelFactory.studentBoardsBus(student)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Update successful', 'bottom', false, 2500);
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        $scope.studentLeavesBus = function(student) {
            if (!student.HasBoarded) {
                TravelFactory.studentLeavesBus(student)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Update successful', 'bottom', false, 2500);
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        $scope.busReachedDestination = function() {
            var obj = {
                Students: $scope.students,
                IsPickup: $scope.pickup
            };
            TravelFactory.busReachedDestination(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Update successful', 'bottom', false, 2500);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.checkPermission = function(flag) {
            cordova.plugins.diagnostic.getPermissionAuthorizationStatus(function(status) {
                switch (status) {
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                        console.log("Permission granted to use the location");
                        $scope.startTravel();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                        console.log("Permission to use the location has not been requested yet");
                        $scope.getPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                        ionicToast.show('Permission denied to use location!', 'bottom', false, 2500);
                        $scope.getPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                        ionicToast.show('Permission denied to use location!', 'bottom', false, 2500);
                        $scope.getPermission();
                        break;
                }
            }, function(error) {
                console.error("The following error occurred: " + error);
            }, cordova.plugins.diagnostic.runtimePermission.ACCESS_FINE_LOCATION);
        };

        $scope.getPermission = function() {
            cordova.plugins.diagnostic.requestRuntimePermission(function(status) {
                switch (status) {
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                        console.log("Permission granted to use the location");
                        $scope.startTravel();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                        console.log("Permission to use the location has not been requested yet");
                        $scope.getPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                        ionicToast.show('Permission denied to use location!', 'bottom', false, 2500);
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                        ionicToast.show('Permission denied to use location!', 'bottom', false, 2500);
                        break;
                }
            }, function(error) {
                console.error("The following error occurred: " + error);
            }, cordova.plugins.diagnostic.runtimePermission.ACCESS_FINE_LOCATION);
        };

    });