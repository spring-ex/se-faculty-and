'use strict';
angular.module('smartFacultyApp')
    .controller('AssignmentDetailsController', function($scope, $state, AssignmentFactory, ionicToast, $compile, $ionicHistory, LoginFactory, $sce, $ionicPopup, $ionicPopover, $cordovaInAppBrowser, $ionicLoading, $cordovaFileTransfer, $cordovaSocialSharing, $q) {

        $scope.newAssignment = AssignmentFactory.selectedAssignment;
        var oldDescription = $scope.newAssignment.Description;
        $scope.canEdit = true;

        var str = $scope.newAssignment.Description;
        var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
        var result = str.replace(urlRegEx, "<a ng-click=\"launchExternalLink('$1')\">$1</a>");
        $scope.DescriptionToShow = result;

        $scope.toggleEdit = function() {
            $scope.canEdit = !$scope.canEdit;
            $scope.closePopover();
        };

        $scope.update = function() {
            if ($scope.newAssignment.Name == "") {
                ionicToast.show('Please enter Name of the Assignment', 'bottom', false, 2500);
            } else {
                if ($scope.newAssignment.VideoURL != "" && typeof($scope.newAssignment.VideoURL) == 'string') {
                    $scope.newAssignment.VideoURL = $scope.convertToEmbedURL($scope.newAssignment.VideoURL);
                } else if ($scope.newAssignment.VideoURL != "" && typeof($scope.newAssignment.VideoURL) == 'object') {
                    $scope.newAssignment.VideoURL = $sce.getTrustedResourceUrl($scope.newAssignment.VideoURL);
                }
                AssignmentFactory.updateAssignment($scope.newAssignment)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Assignment updated successfully', 'bottom', false, 2500);
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('menu.assignments');
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        $scope.$watch('newAssignment.Name', function(newVal, oldVal) {
            if (newVal.length > 50) {
                $scope.newAssignment.Name = oldVal;
            }
        });

        $scope.$watch('newAssignment.Description', function(newVal, oldVal) {
            if (newVal.length > 200) {
                $scope.newAssignment.Description = oldVal;
            }
        });

        if ($scope.newAssignment.VideoURL != "" || $scope.newAssignment.VideoURL != null) {
            $scope.newAssignment.VideoURL = $sce.trustAsResourceUrl($scope.newAssignment.VideoURL);
        }
        $scope.newAssignment.Images = [];

        $scope.deleteAssignment = function() {
            $scope.closePopover();
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Share',
                template: 'Are you sure you want to delete this share?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    AssignmentFactory.deleteAssignment($scope.newAssignment)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Share deleted Successfully', 'bottom', false, 2500);
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('menu.assignments');
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            });
        };

        $scope.convertToEmbedURL = function(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) {
                return 'https://www.youtube.com/embed/' + match[2] + '?rel=0&amp;showinfo=0';
            } else {
                return 'error';
            }
        };

        $scope.getImagesForAssignment = function() {
            AssignmentFactory.getAssignmentImages($scope.newAssignment.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show('There are no images attached for this share', 'bottom', false, 2500);
                        $scope.newAssignment.Images = [];
                    } else {
                        for (var i = 0; i < success.data.Data.length; i++) {
                            var template = {
                                src: success.data.Data[i].ImageURL
                            };
                            $scope.newAssignment.Images.push(template);
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $ionicPopover.fromTemplateUrl('app/Assignments/AssignmentActions.html', {
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

        $scope.viewDocument = function() {
            var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'yes',
                shouldPauseOnSuspend: 'yes'
            };
            $cordovaInAppBrowser.open($scope.newAssignment.DocumentURL, '_blank', options)
                .then(function(event) {
                    // success
                    console.log(event);
                })
                .catch(function(event) {
                    // error
                    console.log(event);
                });
        };

        $scope.launchExternalLink = function(url) {
            if (url.indexOf('meet') == -1) {
                var options = {
                    location: 'yes',
                    clearcache: 'yes',
                    toolbar: 'yes',
                    shouldPauseOnSuspend: 'yes'
                };
                $cordovaInAppBrowser.open(url, '_blank', options)
                    .then(function(event) {
                        // success
                        console.log(event);
                    })
                    .catch(function(event) {
                        // error
                        console.log(event);
                    });
            } else {
                window.location.href = url;
            }
        };

        $scope.checkPermission = function(flag) {
            $scope.toShare = flag;
            if ($scope.newAssignment.Images.length != 0) {
                cordova.plugins.diagnostic.getPermissionAuthorizationStatus(function(status) {
                    switch (status) {
                        case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                            console.log("Permission granted to use the storage");
                            $scope.download();
                            break;
                        case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                            console.log("Permission to use the storage has not been requested yet");
                            $scope.getPermission();
                            break;
                        case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                            ionicToast.show('Permission denied to use external storage!', 'bottom', false, 2500);
                            $scope.getPermission();
                            break;
                        case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                            ionicToast.show('Permission denied to use external storage!', 'bottom', false, 2500);
                            $scope.getPermission();
                            break;
                    }
                }, function(error) {
                    console.error("The following error occurred: " + error);
                }, cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE);
            } else {
                if (flag) {
                    $scope.openShareDialog();
                } else {
                    ionicToast.show('There are no images attached to this event to download', 'bottom', false, 2500);
                }
            }
        };

        $scope.getPermission = function() {
            cordova.plugins.diagnostic.requestRuntimePermission(function(status) {
                switch (status) {
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                        console.log("Permission granted to use the storage");
                        $scope.download();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                        console.log("Permission to use the storage has not been requested yet");
                        $scope.getPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                        ionicToast.show('Permission denied to use external storage!', 'bottom', false, 2500);
                        break;
                }
            }, function(error) {
                console.error("The following error occurred: " + error);
            }, cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE);
        };

        $scope.download = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner><div>Loading',
                animation: 'fade-in',
                showBackdrop: false,
            });

            var promises = [];

            $scope.newAssignment.Images.forEach(function(i, x) {
                var targetPath = cordova.file.externalRootDirectory + i.src.split("/").pop();
                promises.push($cordovaFileTransfer.download(i.src, targetPath, {}, true));
            });

            if ($scope.toShare && LoginFactory.loggedInUser.ShareImageURL != null) {
                var targetPath = cordova.file.externalRootDirectory + LoginFactory.loggedInUser.ShareImageURL.split("/").pop();
                promises.push($cordovaFileTransfer.download(LoginFactory.loggedInUser.ShareImageURL, targetPath, {}, true))
            }

            $q.all(promises).then(function(res) {
                $scope.imageNativeUrls = [];
                for (var i = 0; i < res.length; i++) {
                    $scope.imageNativeUrls.push(res[i].nativeURL);
                    refreshMedia.refresh(res[i].nativeURL);
                }
                $ionicLoading.hide();
                ionicToast.show('Download Complete', 'bottom', false, 2500);
                if ($scope.toShare) {
                    $scope.openShareDialog();
                }
            });
        };

        $scope.openShareDialog = function() {
            $cordovaSocialSharing
                .share($scope.newAssignment.Name + " | " + $scope.newAssignment.Description, null, $scope.imageNativeUrls, " | " + $sce.getTrustedResourceUrl($scope.newAssignment.VideoURL)) // Share via native share sheet
                .then(function(result) {
                    console.log(success);
                    ionicToast.show('Sharing was successful!', 'bottom', false, 2500);
                }, function(err) {
                    console.log(err);
                });
        };

        $scope.getImagesForAssignment();

    });