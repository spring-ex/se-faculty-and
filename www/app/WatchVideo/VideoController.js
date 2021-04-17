'use strict';
angular.module('smartFacultyApp')
    .controller('VideoController', function($scope, TopicDetailsFactory, $sce) {
        $scope.selectedVideo = $sce.trustAsResourceUrl(TopicDetailsFactory.selectedVideo);
    });