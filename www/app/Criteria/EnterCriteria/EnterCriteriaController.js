'use strict';
angular.module('smartFacultyApp')
    .controller('EnterCriteriaController', function($scope, $state, TestsFactory, ionicToast, CriteriaFactory, LoginFactory, $cordovaCamera, $ionicLoading, $cordovaImagePicker, $acatoImage, DashboardFactory, $ionicHistory) {

        $scope.cos = [];
        $scope.bts = [];
        $scope.tests = [];

        $scope.newCriteria = {
            Id: null,
            Name: "",
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            Topics: CriteriaFactory.Topics,
            Images: [],
            MaxScore: null,
            COId: null,
            BTId: null,
            TestId: null
        };

        $scope.selected = {
            bt: null,
            co: null,
            chapter: null
        };

        $scope.getCourseOutcomes = function() {
            var obj = {
                SubjectIds: DashboardFactory.SubjectIds,
                ClassIds: DashboardFactory.ClassIds,
            };
            CriteriaFactory.getCourseOutcomes(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.cos = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getBloomsTaxonomy = function() {
            CriteriaFactory.getBloomsTaxonomy()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.bts = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.createCriteria = function() {
            if ($scope.selected.co == null || $scope.newCriteria.Name == "" || $scope.newCriteria.MaxScore == null || $scope.newCriteria.MaxScore == undefined) {
                ionicToast.show('Please enter all the fields', 'bottom', false, 2500);
            } else {
                $scope.newCriteria.BTId = $scope.selected.bt.Id;
                $scope.newCriteria.COId = $scope.selected.co.Id;
                $scope.newCriteria.TestId = $scope.selected.test.Id;
                CriteriaFactory.createCriteria($scope.newCriteria)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Criteria created successfully', 'bottom', false, 2500);
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('menu.criteriaList');
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        $scope.capture = function(val) {
            var source;
            if ($scope.newCriteria.Images.length == 0) {
                if (val == 1) {
                    var options = {
                        quality: 40,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        encodingType: Camera.EncodingType.JPEG,
                    };
                    $cordovaCamera.getPicture(options)
                        .then(function(image) {
                                var im = {
                                    src: "data:image/jpeg;base64," + image
                                };
                                $scope.newCriteria.Images.push(im);
                            },
                            function(err) {
                                console.log(err);
                            });
                } else {
                    $scope.checkPermission();
                }
            } else {
                ionicToast.show('You can only select 1 photo', 'bottom', false, 2500);
            }
        };

        $scope.pickImages = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner><div>Loading Images..',
                animation: 'fade-in',
                showBackdrop: false,
            });
            var options = {
                maximumImagesCount: 1,
                quality: 40
            };

            $cordovaImagePicker.getPictures(options)
                .then(function(results) {
                    if (results.length != 0) {
                        var count = 0;
                        for (var i = 0; i < results.length; i++) {
                            $acatoImage.getImageData(results[i]).then(function(imageData) {
                                if ($scope.newCriteria.Images.length == 0) {
                                    $scope.newCriteria.Images.push({
                                        src: imageData
                                    });
                                    count++;
                                    if (results.length == count) {
                                        $ionicLoading.hide();
                                    }
                                } else {
                                    ionicToast.show('You can only select 1 photo', 'bottom', false, 2500);
                                    $ionicLoading.hide();
                                }
                            }, function(error) {
                                ionicToast.show('There was a problem fetching the photo', 'bottom', false, 2500);
                            });
                        }
                    } else {
                        $ionicLoading.hide();
                    }
                }, function(error) {
                    ionicToast.show('There was a problem fetching the photo', 'bottom', false, 2500);
                });
        };

        $scope.checkPermission = function() {
            cordova.plugins.diagnostic.getPermissionAuthorizationStatus(function(status) {
                switch (status) {
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                        console.log("Permission granted to use the gallery");
                        $scope.pickImages();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                        console.log("Permission to use the gallery has not been requested yet");
                        $scope.getPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                        ionicToast.show('Permission denied to use gallery!', 'bottom', false, 2500);
                        $scope.getPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                        ionicToast.show('Permission denied to use gallery!', 'bottom', false, 2500);
                        $scope.getPermission();
                        break;
                }
            }, function(error) {
                console.error("The following error occurred: " + error);
            }, cordova.plugins.diagnostic.runtimePermission.READ_EXTERNAL_STORAGE);
        };

        $scope.getPermission = function() {
            cordova.plugins.diagnostic.requestRuntimePermission(function(status) {
                switch (status) {
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                        console.log("Permission granted to use the gallery");
                        $scope.pickImages();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                        console.log("Permission to use the gallery has not been requested yet");
                        $scope.checkPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                        ionicToast.show('Permission denied to use gallery!', 'bottom', false, 2500);
                        $scope.checkPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                        ionicToast.show('Permission denied to use gallery!', 'bottom', false, 2500);
                        $scope.checkPermission();
                        break;
                }
            }, function(error) {
                console.error("The following error occurred: " + error);
            }, cordova.plugins.diagnostic.runtimePermission.READ_EXTERNAL_STORAGE);
        };

        $scope.removeImage = function(index) {
            $scope.newCriteria.Images.splice(index, 1);
        };

        $scope.getAllTests = function() {
            var conductedTestsOnly = false;
            var obj = {
                SubjectIds: DashboardFactory.SubjectIds,
                ClassIds: DashboardFactory.ClassIds,
                ConductedTestsOnly: conductedTestsOnly
            };
            TestsFactory.getAllTests(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        var tests = success.data.Data;
                        for (var i = 0; i < tests.length; i++) {
                            if (tests[i].IsFinal == '1') {
                                tests.splice(i, 1);
                            }
                        }
                    }
                    $scope.tests = tests;
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getCourseOutcomes();
        $scope.getBloomsTaxonomy();
        $scope.getAllTests();
    });