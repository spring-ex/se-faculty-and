'use strict';
angular.module('smartFacultyApp')
    .controller('LoginController', function($scope, $state, LoginFactory) {

        $scope.loginData = {
            PhoneNumber: null,
            Password: '',
            DeviceId: null,
            FacultyAppVersion: LoginFactory.AppVersion,
            OperatingSystem: ionic.Platform.platform()
        };

        $scope.errorMessage = null;
        $scope.showUpdateButton = false;

        $scope.performLogin = function() {
            LoginFactory.login($scope.loginData)
                .then(function(success) {
                    if (success.data.Code == "E010") {
                        $scope.errorMessage = success.data.Message;
                        $scope.showUpdateButton = true;
                    } else if (success.data.Code != "S001") {
                        $scope.errorMessage = success.data.Message;
                    } else {
                        $scope.errorMessage = null;
                        $scope.showUpdateButton = false;
                        if (success.data.Data[0].Role == "DRIVER") {
                            $state.go('travel');
                        } else if (success.data.Data[0].Role == "LIBRARIAN") {
                            $state.go('menu.library');
                        } else {
                            if (success.data.Data[0].PackageCode == 'EXTENDED') {
                                $state.go('welcome');
                            } else {
                                if (success.data.Data[0].Role == "STAFF") {
                                    $state.go('menu.enquiries');
                                } else {
                                    $state.go('selectClass');
                                }
                            }
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.login = function() {
            if ($scope.loginData.PhoneNumber == undefined || $scope.loginData.PhoneNumber == "") {
                $scope.errorMessage = 'Enter a valid Phone Number';
            } else if ($scope.loginData.Password == undefined || $scope.loginData.Password == "") {
                $scope.errorMessage = 'Enter Password';
            } else {
                $scope.performLogin();
            }
        };

        $scope.$on('fcm-plugin-loaded', function() {
            if (typeof(FCMPlugin) != 'undefined') {
                console.log('autologin 2');
                FCMPlugin.getToken(function(token) {
                    LoginFactory.DeviceId = token;
                    cordova.getAppVersion(function(version) {
                        LoginFactory.FacultyAppVersion = version;
                        $scope.loginData.DeviceId = LoginFactory.DeviceId;
                        $scope.loginData.FacultyAppVersion = LoginFactory.FacultyAppVersion;
                        if (localStorage.getItem("isLoggedIn")) {
                            $scope.loginData.PhoneNumber = parseInt(localStorage.getItem("PhoneNumber"));
                            $scope.loginData.Password = localStorage.getItem("Password");
                            $scope.login();
                        }
                    });
                });
            }
        });

        $scope.update = function() {
            window.location.href = "https://play.google.com/store/apps/details?id=com.findinboxFaculty.www";
        };
    });