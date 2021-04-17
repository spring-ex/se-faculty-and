'use strict';
angular.module('smartFacultyApp')
    .controller('AddExpenseController', function($scope, $state, ionicDatePicker, LoginFactory, ionicToast, ExpensesFactory, $ionicHistory) {

        $scope.newExpense = {
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            Particulars: null,
            Amount: null,
            ExpenseDate: moment().format("YYYY-MM-DD")
        };

        $scope.addExpense = function() {
            if ($scope.newExpense.Particulars == "" || $scope.newExpense.Particulars == null ||
                $scope.newExpense.Amount == "" || $scope.newExpense.Amount == undefined) {
                ionicToast.show('Please enter all the details', 'bottom', false, 2500);
            } else {
                ExpensesFactory.addExpense($scope.newExpense)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Expense added successfully', 'bottom', false, 2500);
                            $scope.newExpense.Particulars = null;
                            $scope.newExpense.Amount = null;
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('menu.expenses');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.newExpense.ExpenseDate = moment(val).format('YYYY-MM-DD');
            },
            from: new Date(2017, 0, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

    });