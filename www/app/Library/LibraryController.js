'use strict';
angular.module('smartFacultyApp')
    .controller('LibraryController', function($scope, $state, LoginFactory, LibraryFactory, ionicToast, $ionicModal, $ionicPopup, ionicDatePicker, $rootScope) {

        $rootScope.$broadcast('userLoggedIn');
        $scope.books = [];

        $scope.options = {
            initialSlide: 0,
            onInit: function(swiper) {
                $scope.swiper = swiper;
            },
            onSlideChangeEnd: function(swiper) {
                if (swiper.activeIndex == 0) {
                    $scope.getAvailableBooks();
                } else {
                    $scope.getBorrowedBooks();
                }
            }
        };

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.selected.returnDate = moment(val).format('YYYY-MM-DD');
            },
            from: new Date(2018, 0, 1), //Optional
            to: new Date(2040, 0, 1), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.selected = {
            book: null,
            student: null,
            returnDate: moment().format('YYYY-MM-DD')
        };

        $scope.entered = {
            rollNumber: null
        };

        $ionicModal.fromTemplateUrl('app/Library/IssueBook.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.getAvailableBooks = function() {
            $scope.books = [];
            LibraryFactory.getAllAvailableBooks(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.books = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getBorrowedBooks = function() {
            $scope.borrowedBooks = [];
            LibraryFactory.getBorrowedBooks(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.borrowedBooks = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.bookSelected = function(book) {
            $scope.selected.book = book;
            $scope.openModal();
        };

        $scope.issueBook = function() {
            var obj = {
                StudentId: $scope.selected.student.Id,
                DeviceId: $scope.selected.student.DeviceId,
                BookId: $scope.selected.book.Id,
                BookName: $scope.selected.book.Name,
                BorrowDate: moment().format('YYYY-MM-DD'),
                ReturnDate: moment($scope.selected.returnDate).format('YYYY-MM-DD')
            };
            LibraryFactory.issueBook(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Book issue was successful', 'bottom', false, 2500);
                        $scope.closeModal();
                        $scope.selected.book = null;
                        $scope.selected.student = null;
                        $scope.selected.returnDate = moment().format('YYYY-MM-DD');
                        $scope.entered.rollNumber = null;
                        $scope.getAvailableBooks();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
            console.log(obj);
        };

        $scope.searchStudent = function() {
            LibraryFactory.getStudentByRollNumber($scope.entered.rollNumber, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show('No Student found for the entered USN', 'bottom', false, 2500);
                    } else {
                        $scope.selected.student = success.data.Data[0];
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Issue Book?',
                            template: 'Are you sure you want to issue ' + $scope.selected.book.Name + ' to ' + $scope.selected.student.Name + '?'
                        });
                        confirmPopup.then(function(res) {
                            if (res) {
                                $scope.issueBook();
                            }
                        });
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.borrowedBookSelected = function(book) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Return Book?',
                template: 'Are you sure you want to return ' + book.Name + ' from ' + book.StudentName + '?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    LibraryFactory.returnBook(book)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Book return was successful', 'bottom', false, 2500);
                                $scope.getBorrowedBooks();
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

        $scope.getAvailableBooks();

    });