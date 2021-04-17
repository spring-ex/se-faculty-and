'use strict';
angular.module('smartFacultyApp')
    .controller('ExpensesController', function($scope, $state, ExpensesFactory, ionicToast, LoginFactory, ionicDatePicker, $ionicPopup) {

        $scope.expenses = [];
        $scope.sumOfExpenses = 0;
        $scope.selected = {
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            DateRange: {
                startDate: moment().subtract(1, 'month').toISOString(),
                endDate: moment().add(1, 'days').toISOString()
            }
        };

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.selected.DateRange.startDate = moment(val).format('YYYY-MM-DD');
                $scope.getAllExpenses();
            },
            from: new Date(2017, 0, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };
        var ipObj2 = {
            callback: function(val) { //Mandatory
                $scope.selected.DateRange.endDate = moment(val).format('YYYY-MM-DD');
                $scope.getAllExpenses();
            },
            from: new Date(2017, 0, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openStartDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };
        $scope.openEndDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj2);
        };

        $scope.getAllExpenses = function() {
            $scope.expenses = [];
            ExpensesFactory.getAllExpenses($scope.selected)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.expenses = success.data.Data;
                    }
                    $scope.sumOfExpenses = 0;
                    for (var i = 0; i < $scope.expenses.length; i++) {
                        $scope.sumOfExpenses += $scope.expenses[i].Amount;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.addExpense = function() {
            $state.go('menu.addExpense');
        };

        $scope.deleteExpense = function(expense) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Expense',
                template: 'Are you sure you want to delete this expense?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    ExpensesFactory.deleteExpense(expense)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Expense was deleted successfully', 'bottom', false, 2500);
                                $scope.getAllExpenses();
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.getAllExpenses();
    });