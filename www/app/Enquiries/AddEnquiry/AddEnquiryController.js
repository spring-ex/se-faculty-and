'use strict';
angular.module('smartFacultyApp')
    .controller('AddEnquiryController', function($scope, ionicToast, LoginFactory, $state, EnquiriesFactory, SelectSemesterFactory, ionicDatePicker, $stateParams, DashboardFactory, SelectClassFactory) {

        $scope.isEdit = parseInt($stateParams.isEdit);
        $scope.newEnquiry = {
            Id: null,
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            CollegeName: LoginFactory.loggedInUser.Nickname,
            CollegePhone: LoginFactory.loggedInUser.CollegePhone,
            EnquirySession: "",
            Name: null,
            GenderId: null,
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            DateOfBirth: new Date(),
            FatherName: null,
            MotherName: null,
            PhoneNumber: null,
            UniqueId: null,
            Status: 'ACTIVE',
            Searchterm: null,
            MotherPhoneNumber: null,
            FollowUpDate: new Date(),
            Note: null
        };

        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.keywords = [];

        $scope.genders = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];

        $scope.getAllGenders = function() {
            EnquiriesFactory.getAllGenders()
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.genders = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllCourses = function() {
            $scope.courses = [];
            SelectSemesterFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.courses = success.data.Data;
                        if ($scope.isEdit) {
                            $scope.getBranches(EnquiriesFactory.selectedEnquiry.CourseId);
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters - [];
            $scope.newEnquiry.BranchId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.newEnquiry.SemesterId = null;
            $scope.getSemesters(branchId);
        };

        $scope.getBranches = function(courseId) {
            SelectSemesterFactory.getAllBranches(courseId, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.branches = success.data.Data;
                        if ($scope.isEdit) {
                            $scope.getSemesters($scope.newEnquiry.BranchId);
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getSemesters = function(branchId) {
            SelectSemesterFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.newEnquiry.CourseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.addEnquiry = function() {
            if ($scope.newEnquiry.Name == null ||
                $scope.newEnquiry.PhoneNumber == null ||
                $scope.newEnquiry.FatherName == null ||
                $scope.newEnquiry.GenderId == null ||
                $scope.newEnquiry.CourseId == null ||
                $scope.newEnquiry.BranchId == null ||
                $scope.newEnquiry.DateOfBirth == null ||
                $scope.newEnquiry.Name == "" ||
                $scope.newEnquiry.PhoneNumber == undefined ||
                $scope.newEnquiry.FatherName == "" ||
                $scope.newEnquiry.DateOfBirth == ""
            ) {
                ionicToast.show('Please add all the required information in this form', 'bottom', false, 2500);
            } else {
                $scope.newEnquiry.DateOfBirth = moment($scope.newEnquiry.DateOfBirth).format("YYYY-MM-DD");
                $scope.newEnquiry.FollowUpDate = moment($scope.newEnquiry.FollowUpDate).format("YYYY-MM-DD");
                EnquiriesFactory.addEnquiry($scope.newEnquiry)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Code, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Enquiry was added successfully', 'bottom', false, 2500);
                            $state.go('menu.enquiries');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.updateEnquiry = function() {
            if ($scope.newEnquiry.Name == null ||
                $scope.newEnquiry.PhoneNumber == null ||
                $scope.newEnquiry.FatherName == null ||
                $scope.newEnquiry.GenderId == null ||
                $scope.newEnquiry.CourseId == null ||
                $scope.newEnquiry.BranchId == null ||
                $scope.newEnquiry.DateOfBirth == null ||
                $scope.newEnquiry.Name == "" ||
                $scope.newEnquiry.PhoneNumber == undefined ||
                $scope.newEnquiry.FatherName == "" ||
                $scope.newEnquiry.DateOfBirth == ""
            ) {
                ionicToast.show('Please add all the required information in this form', 'bottom', false, 2500);
            } else {
                $scope.newEnquiry.DateOfBirth = moment($scope.newEnquiry.DateOfBirth).format("YYYY-MM-DD");
                $scope.newEnquiry.FollowUpDate = moment($scope.newEnquiry.FollowUpDate).format("YYYY-MM-DD");
                EnquiriesFactory.updateEnquiry($scope.newEnquiry)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Code, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Enquiry was updated successfully', 'bottom', false, 2500);
                            $state.go('menu.enquiries');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.newEnquiry.DateOfBirth = moment(val).format('YYYY-MM-DD');
                $scope.calculateAge();
                $scope.calculateAgeAsOfJune();
            },
            from: new Date(1990, 0, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        var ipObj2 = {
            callback: function(val) { //Mandatory
                $scope.newEnquiry.FollowUpDate = moment(val).format('YYYY-MM-DD');
            },
            from: new Date(), //Optional
            to: new Date(2030, 0, 1), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker2 = function() {
            ionicDatePicker.openDatePicker(ipObj2);
        };

        $scope.calculateAge = function() {
            var a = moment();
            var b = moment($scope.newEnquiry.DateOfBirth);

            var years = a.diff(b, 'year');
            b.add(years, 'years');

            var months = a.diff(b, 'months');
            b.add(months, 'months');

            var days = a.diff(b, 'days');

            $scope.age = {
                Years: years,
                Months: months,
                Days: days
            };
        };

        $scope.calculateAgeAsOfJune = function() {
            var dateObj = new Date();
            dateObj.setDate(1);
            dateObj.setMonth(5);
            var a = moment(dateObj);
            var b = moment($scope.newEnquiry.DateOfBirth);

            var years = a.diff(b, 'year');
            b.add(years, 'years');

            var months = a.diff(b, 'months');
            b.add(months, 'months');

            var days = a.diff(b, 'days');

            $scope.ageAsOfJune = {
                Years: years,
                Months: months,
                Days: days
            };
        };

        $scope.getAllGenders();
        $scope.getAllCourses();
        $scope.calculateAge();
        $scope.calculateAgeAsOfJune();

        if ($scope.isEdit) {
            EnquiriesFactory.getEnquiryById(EnquiriesFactory.selectedEnquiry.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Code, 'bottom', false, 2500);
                    } else {
                        $scope.newEnquiry = success.data.Data;
                        $scope.newEnquiry.PhoneNumber = parseInt($scope.newEnquiry.PhoneNumber);
                        $scope.newEnquiry.MotherPhoneNumber = parseInt($scope.newEnquiry.MotherPhoneNumber);
                        $scope.calculateAge();
                        $scope.calculateAgeAsOfJune();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        }

        $scope.getAllKeywords = function() {
            SelectClassFactory.getAllKeywords(LoginFactory.loggedInUser.Type)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.keywords = success.data.Data[0];
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllKeywords();
    });