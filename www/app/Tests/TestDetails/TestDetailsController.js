'use strict';
angular.module('smartFacultyApp')
    .controller('TestDetailsController', function($scope, $state, $ionicModal, $ionicHistory, ionicToast, SelectClassFactory, LoginFactory, TestsFactory, ionicDatePicker, $ionicPopup, $ionicListDelegate, CriteriaFactory, $timeout) {

        $scope.test = TestsFactory.selectedTest;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.criterias = [];
        $scope.student = null;
        $scope.isModalOpen = false;

        $ionicModal.fromTemplateUrl('app/Tests/TestDetails/MarksEntryTemplate.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(student) {
            $scope.student = student;
            if ($scope.student.Marks != 'Ab') {
                $scope.student.Marks = parseFloat($scope.student.Marks);
                $scope.student.IsAbsent = false;
            } else {
                $scope.student.IsAbsent = true;
            }
            $scope.getAllCriteriaForTest(student.Id, $scope.test.Id);
            $scope.modal.show();
            $scope.isModalOpen = true;
        };
        $scope.closeModal = function() {
            if ($scope.isModalOpen) {
                $scope.modal.hide();
                $scope.isModalOpen = false;
            }
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.getTestDetails = function() {
            var obj = {
                Id: $scope.test.Id,
                ClassIds: TestsFactory.ClassIds,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                SubjectIds: TestsFactory.SubjectIds,
                IsElective: SelectClassFactory.selected.subject.IsElective
            };
            TestsFactory.getTestDetails(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.test.TestDate = moment(val).format('YYYY-MM-DD');
            },
            from: new Date(), //Optional
            to: new Date(2040, 12, 31), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.updateMarks = function() {
            TestsFactory.updateMarks($scope.student.Id, $scope.test.Id, $scope.student.Marks, ($scope.student.Marks / $scope.test.MaxMarks) * 100)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        if ($scope.criterias.length > 0) {
                            var obj = {
                                Criteria: $scope.criterias,
                                Test: $scope.test,
                                Student: $scope.student
                            };
                            for (var i = 0; i < $scope.criterias.length; i++) {
                                if (!$scope.criterias[i].IsAbsent) {
                                    $scope.criterias[i].ResultPercentage = ($scope.criterias[i].MarksScored / $scope.criterias[i].MaxScore) * 100;
                                } else {
                                    $scope.criterias[i].ResultPercentage = 0;
                                }
                            }
                            TestsFactory.updateCriteriaForStudent(obj)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                                    } else {
                                        $scope.marksUpdateSuccessful();
                                    }
                                }, function(error) {
                                    ionicToast.show(error, 'bottom', false, 2500);
                                });
                        } else {
                            $scope.marksUpdateSuccessful();
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.marksUpdateSuccessful = function() {
            ionicToast.show('Successfully updated the marks of student', 'bottom', false, 2500);
            $ionicListDelegate.closeOptionButtons();
            $scope.student.Marks = null;
            $scope.getTestDetails();
            $scope.closeModal();
        };

        $scope.markAbsent = function(student) {
            TestsFactory.updateMarks(student.Id, $scope.test.Id, "Ab", 0)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Successfully updated the marks of student', 'bottom', false, 2500);
                        $ionicListDelegate.closeOptionButtons();
                        $scope.getTestDetails();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.deleteTest = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Assessment',
                template: 'Are you sure you want to delete this Assessment?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    TestsFactory.deleteTest($scope.test)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Assessment was successfully deleted', 'bottom', false, 2500);
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('menu.tests');
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            });
        };

        $scope.getAllCriteriaForTest = function(studentId, testId) {
            $scope.criterias = [];
            CriteriaFactory.getAllCriteriaForStudentAndTest(studentId, testId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.criterias = success.data.Data;
                        for (var i = 0; i < $scope.criterias.length; i++) {
                            $scope.criterias[i].MaxScore = parseFloat($scope.criterias[i].MaxScore);
                            if ($scope.criterias[i].MarksScored != null) {
                                $scope.criterias[i].IsAbsent = false;
                                $scope.criterias[i].MarksScored = parseFloat($scope.criterias[i].MarksScored);
                            } else {
                                $scope.criterias[i].IsAbsent = true;
                            }
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.criteriaMarksEntered = function(criteriaIndex) {
            if ($scope.criterias[criteriaIndex].MarksScored > $scope.criterias[criteriaIndex].MaxScore || $scope.criterias[criteriaIndex].MarksScored == undefined) {
                ionicToast.show('Marks should be less than max marks', 'bottom', false, 2500);
                $scope.criterias[criteriaIndex].MarksScored = null;
            }
            var total = 0;
            for (var i = 0; i < $scope.criterias.length; i++) {
                if ($scope.criterias[i].MarksScored != undefined) {
                    total = total + $scope.criterias[i].MarksScored;
                }
            }
            $scope.student.Marks = total;
        };

        $scope.isMarksMoreThanMaxMarks = function() {
            if (parseFloat($scope.student.Marks) > parseInt($scope.test.MaxMarks)) {
                ionicToast.show('Marks should be less than or equal to Max Marks', 'bottom', false, 2500);
                $scope.student.Marks = "";
            }
        };

        $scope.addCriteria = function() {
            $state.go('menu.criteriaList');
        };

        $scope.criteriaSwitchChanged = function(criteria) {
            if (criteria.IsAbsent) {
                if ($scope.student.Marks != 0) {
                    $scope.student.Marks = $scope.student.Marks - criteria.MarksScored;
                }
                criteria.MarksScored = null;
            } else {
                $timeout(function() {
                    document.getElementById('input-' + criteria.Id).focus();
                }, 50);
            }
        };

        $scope.getTestDetails();
    });