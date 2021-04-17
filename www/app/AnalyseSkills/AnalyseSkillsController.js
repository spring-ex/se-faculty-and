'use strict';
angular.module('smartFacultyApp')
    .controller('AnalyseSkillsController', function($scope, $state, ionicToast, DashboardFactory, $ionicModal, LearningReportFactory, LoginFactory) {

        $scope.tags = DashboardFactory.tags.filter(x => x.Result > 0.01);

        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'graph',
                type: 'column'
            },
            title: {
                text: 'Skill Report'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    var format = '<b>' + this.x + '</b>' + ': ' + Highcharts.numberFormat(this.y, 2);
                    return format;
                }
            },
            xAxis: {
                categories: $scope.tags.map(a => a.Name),
                crosshair: true
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            series: [{
                showInLegend: false,
                data: $scope.tags.map(x => x.Result)
            }]
        });


    });