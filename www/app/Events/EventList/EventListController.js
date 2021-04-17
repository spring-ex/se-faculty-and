'use strict';
angular.module('smartFacultyApp')
    .controller('EventListController', function($scope, $state, EventsFactory, ionicToast, LoginFactory, $ionicPopover) {

        $scope.events = [];
        $scope.years = [];
        $scope.currentYear = new Date().getFullYear();
        $scope.addEvent = function() {
            $state.go('createEvent');
        };
        $scope.createdAt = moment(LoginFactory.loggedInUser.CreatedAt).format('YYYY');

        $ionicPopover.fromTemplateUrl('app/Events/EventList/EventYearTemplate.html', {
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

        $scope.eventSelected = function(event) {
            EventsFactory.selectedEvent = event;
            $state.go('eventDetails');
        };

        $scope.getAllEvents = function(year) {
            $scope.events = [];
            EventsFactory.getAllEvents(LoginFactory.loggedInUser.CollegeId, year)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.events = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getYearList = function() {
            for (var i = parseInt($scope.createdAt); i <= new Date().getFullYear(); i++) {
                $scope.years.push(i);
            }
        };

        $scope.yearSelected = function(year) {
            $scope.currentYear = year;
            $scope.closePopover();
            $scope.getAllEvents(year);
        };

        $scope.getAllEvents($scope.currentYear);
        $scope.getYearList();
    });