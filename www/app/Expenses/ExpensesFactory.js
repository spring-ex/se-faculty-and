'use strict';

angular.module('smartFacultyApp').factory('ExpensesFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllExpenses = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/expense/getAllByBranch',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addExpense = function(newExpense) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/expense',
            data: newExpense,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteExpense = function(expense) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/expense',
            data: expense,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});