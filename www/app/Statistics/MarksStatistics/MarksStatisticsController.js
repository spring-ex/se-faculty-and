'use strict';
angular.module('smartFacultyApp')
    .controller('MarksStatisticsController', function($scope, $state, TakeAttendanceFactory, DashboardFactory, LessonPlanFactory, SelectClassFactory, LoginFactory, MarksStatisticsFactory, ionicToast, StudentListFactory, $ionicSlideBoxDelegate, $ionicPopover, CriteriaFactory, $ionicModal, $filter) {

        $scope.tags = [{
            Id: 999990,
            Name: "Basic",
            DisplayType: 0
        }, {
            Id: 999991,
            Name: "Intermediary",
            DisplayType: 0
        }, {
            Id: 999992,
            Name: "Advanced",
            DisplayType: 0
        }, {
            Id: 999993,
            Name: "Easy",
            DisplayType: 1
        }, {
            Id: 999994,
            Name: "Moderate",
            DisplayType: 1
        }, {
            Id: 999995,
            Name: "Hard",
            DisplayType: 1
        }];
        $scope.chapters = [];
        $scope.tests = [];
        $scope.items = [];
        $scope.currentPage = StudentListFactory.selectedPage;
        StudentListFactory.selectedPage = 0;
        $scope.keywords = SelectClassFactory.keywords;
        $scope.studentsToShow = [];
        $scope.idList = {
            ClassIds: [],
            SubjectIds: []
        };
        $scope.sortOrder = 'Name';
        $scope.pageTitle = "Scorecard";
        $scope.rangeSlider = {
            Start: 0,
            End: 100
        };
        $scope.selectedItem = 1;
        $scope.sliderOptions = {
            minValue: MarksStatisticsFactory.sliderValues.min,
            maxValue: MarksStatisticsFactory.sliderValues.max,
            options: {
                floor: 0,
                ceil: 100,
                step: 5,
                onEnd: function(sliderId, modelValue, highValue, pointerType) {
                    if ($scope.students.length > 0) {
                        $scope.marksRangeChanged(modelValue, highValue);
                    }
                },
            }
        };
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $ionicPopover.fromTemplateUrl('app/Statistics/MarksStatistics/FilterResultTemplate.html', {
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

        $ionicPopover.fromTemplateUrl('app/Statistics/MarksStatistics/SortResultTemplate.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover2 = popover;
        });

        $scope.openPopover2 = function($event) {
            $scope.popover2.show($event);
        };

        $scope.closePopover2 = function() {
            $scope.popover2.hide();
        };

        $ionicModal.fromTemplateUrl('app/Statistics/MarksStatistics/BTPopoverTemplate.html', {
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

        $scope.ranges = [{
            Id: 1,
            Name: "All students"
        }, {
            Id: 2,
            Name: "< 50%"
        }, {
            Id: 3,
            Name: "50% - 75%"
        }, {
            Id: 4,
            Name: "> 75%"
        }];

        $scope.students = [];
        $scope.selected = {
            marksRange: $scope.ranges[0],
            test: null,
            item: {
                Id: 0,
                Name: "All"
            },
            showStudentCount: ($scope.currentPage == 1) ? true : false,
            Tags: MarksStatisticsFactory.selectedTags
        };

        $scope.options = {
            initialSlide: $scope.currentPage,
            onInit: function(swiper) {
                $scope.swiper = swiper;
            },
            onSlideChangeEnd: function(swiper) {
                $scope.currentPage = swiper.activeIndex;
                if ($scope.currentPage == 0) {
                    $scope.selected.showStudentCount = false;
                    $scope.getLessonPlan();
                    if ($scope.selected.Tags.length > 0) {
                        MarksStatisticsFactory.selectedTags = [];
                        $scope.selected.Tags = [];
                        for (var i = 0; i < $scope.tags.length; i++) {
                            $scope.tags[i].IsSelected = false;
                        }
                    }
                } else {
                    $scope.selected.showStudentCount = true;
                    $scope.getAllStudentsInClass();
                }
            }
        };

        $scope.getMarksStatisticsByRange = function(classIds, subjectIds) {
            $scope.marksStatistics = null;
            //hardcoding the tests dropdown to all tests by sending 0 in the test id field
            var obj = {
                SubjectIds: subjectIds,
                ClassIds: classIds,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                TestId: 0,
                RangeId: $scope.selected.marksRange.Id,
                IsElective: SelectClassFactory.selected.subject.IsElective
            };
            MarksStatisticsFactory.getMarksStatisticsByRange(obj)
                .then(function(success) {
                    $scope.studentsToShow = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                        calculateAverageWithWeightage();
                        $scope.studentsToShow = angular.copy($scope.students);
                        $scope.marksRangeChanged(MarksStatisticsFactory.sliderValues.min, MarksStatisticsFactory.sliderValues.max);
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.marksRangeChanged = function(modelValue, highValue) {
            MarksStatisticsFactory.sliderValues.min = modelValue;
            MarksStatisticsFactory.sliderValues.max = highValue;
            $scope.studentsToShow = $scope.students.filter(function(obj) {
                if (obj.Marks == 0) {
                    return true;
                } else {
                    return (obj.Marks >= modelValue && obj.Marks <= highValue)
                }
            });
        };

        $scope.studentSelected = function(student) {
            StudentListFactory.selectedStudent = student;
            StudentListFactory.selectedPage = $scope.currentPage;
            $state.go('menu.studentStatistics');
            MarksStatisticsFactory.sliderValues.min = $scope.sliderOptions.minValue;
            MarksStatisticsFactory.sliderValues.max = $scope.sliderOptions.maxValue;
            if ($scope.selected.Tags.length > 0) {
                MarksStatisticsFactory.selectedTags = $scope.selected.Tags.map(a => a.Name);
            }
        };

        $scope.getLessonPlan = function() {
            var obj = {
                SubjectIds: DashboardFactory.SubjectIds,
                ClassIds: DashboardFactory.ClassIds,
                DateRange: {
                    startDate: moment().subtract(1, 'year').toISOString(),
                    endDate: moment().toISOString()
                }
            };
            LessonPlanFactory.getLessonPlan(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.chapters = success.data.Data;
                        $scope.chaptersToShow = angular.copy($scope.chapters);
                        $scope.getTopicsForClass();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getTopicsForClass = function() {
            var obj = {
                SubjectIds: DashboardFactory.SubjectIds,
                ClassIds: DashboardFactory.ClassIds
            };
            MarksStatisticsFactory.getTopicsForClass(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.chaptersToShow = [];
                        $scope.completedTopics = success.data.Data;
                        if ($scope.completedTopics[0].TopicId != null) {
                            var chapterScore = 0,
                                topicsCompleted = 0;
                            for (var i = 0; i < $scope.chapters.length; i++) {
                                chapterScore = 0;
                                topicsCompleted = 0;
                                for (var j = 0; j < $scope.chapters[i].Topics.length; j++) {
                                    $scope.chapters[i].Topics[j].IsCompleted = false;
                                    for (var k = 0; k < $scope.completedTopics.length; k++) {
                                        if ($scope.chapters[i].Topics[j].Id == $scope.completedTopics[k].TopicId) {
                                            if ($scope.completedTopics[k].TopicAverage == null && $scope.completedTopics[k].TopicTestAverage == null) {
                                                $scope.chapters[i].Topics[j].TopicAverage = null;
                                            } else {
                                                $scope.chapters[i].Topics[j].IsCompleted = true;
                                                if ($scope.completedTopics[k].TopicAverage == null) {
                                                    $scope.chapters[i].Topics[j].TopicAverage = $scope.completedTopics[k].TopicTestAverage;
                                                } else {
                                                    $scope.chapters[i].Topics[j].TopicAverage = $scope.completedTopics[k].TopicAverage;
                                                }
                                                topicsCompleted++;
                                            }
                                        }
                                    }
                                    if ($scope.chapters[i].Topics[j].TopicAverage != null) {
                                        chapterScore += parseFloat($scope.chapters[i].Topics[j].TopicAverage);
                                    }
                                }
                                if (topicsCompleted) {
                                    $scope.chapters[i].ChapterAverage = chapterScore / topicsCompleted;
                                } else {
                                    $scope.chapters[i].ChapterAverage = null;
                                }
                            }
                        }
                        $scope.chaptersToShow = angular.copy($scope.chapters);
                        $ionicSlideBoxDelegate.update();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.toggleChapter = function(chapter) {
            chapter.show = !chapter.show;
            for (var i = 0; i < $scope.chaptersToShow.length; i++) {
                if ($scope.chaptersToShow[i].Id != chapter.Id) {
                    $scope.chaptersToShow[i].show = false;
                }
            }
        };

        $scope.isChapterShown = function(chapter) {
            return chapter.show;
        };

        $scope.getAllStudentsInClass = function() {
            TakeAttendanceFactory.getAllStudentsInClass(LoginFactory.loggedInUser.CollegeId, SelectClassFactory.selected.subject.Id, SelectClassFactory.selected.class.Id, SelectClassFactory.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                        $scope.idList.ClassIds = $scope.getUniqueIds($scope.students, 'ClassId');
                        $scope.idList.SubjectIds = [];
                        if (SelectClassFactory.selected.subject.IsElective == "true") {
                            $scope.idList.SubjectIds = $scope.getUniqueIds($scope.students, 'NormalSubjectId');
                        } else {
                            $scope.idList.SubjectIds.push(SelectClassFactory.selected.subject.Id);
                        }
                        if ($scope.loggedInUser.PackageCode == 'BASIC') {
                            $scope.getMarksStatisticsByRange($scope.idList.ClassIds, $scope.idList.SubjectIds);
                        } else {
                            if ($scope.currentPage == 1) {
                                //if there are tags selected
                                if ($scope.selected.Tags.length != 0) {
                                    var obj = {
                                        ClassIds: $scope.idList.ClassIds,
                                        SubjectIds: $scope.idList.SubjectIds,
                                        Tags: MarksStatisticsFactory.selectedTags,
                                        Quizzes: [],
                                        CollegeId: LoginFactory.loggedInUser.CollegeId,
                                        IsElective: SelectClassFactory.selected.subject.IsElective
                                    }
                                    $scope.getMarksStatisticsByTags(obj);
                                } else {
                                    $scope.getMarksStatisticsByRange($scope.idList.ClassIds, $scope.idList.SubjectIds);
                                }
                            }
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getUniqueIds = function(array, key) {
            return $scope.students.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        function calculateAverageWithWeightage() {
            angular.forEach($scope.students, function(student) {
                student.Marks = SelectClassFactory.calculateAverageWithWeightage(student.TestScore, student.ExamScore, student.QuizScore);
            });
        };


        $scope.getBloomsTaxonomy = function() {
            CriteriaFactory.getBloomsTaxonomy()
                .then(function(success) {
                    $scope.bts = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.bts = success.data.Data;
                        var firstObject = {
                            Id: 0,
                            Name: 'Scorecard'
                        };
                        $scope.bts.unshift(firstObject);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.btSelected = function(bt) {
            $scope.pageTitle = bt.Name;
            $scope.closePopover();
            if (bt.Id == 0) {
                $scope.getMarksStatisticsByRange($scope.idList.ClassIds, $scope.idList.SubjectIds);
            } else {
                var obj = {
                    ClassIds: $scope.idList.ClassIds,
                    SubjectIds: $scope.idList.SubjectIds,
                    BTId: bt.Id,
                    CollegeId: LoginFactory.loggedInUser.CollegeId,
                    IsElective: SelectClassFactory.selected.subject.IsElective
                }
                MarksStatisticsFactory.getStatisticsByBloomsLevel(obj)
                    .then(function(success) {
                        $scope.students = [];
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            $scope.students = success.data.Data;
                            calculateAverageWithWeightage();
                            $scope.studentsToShow = angular.copy($scope.students);
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        $scope.classFilterSelected = function(value) {
            $scope.closePopover();
            if (value == 1) {
                var chaps = [];
                angular.forEach($scope.chapters, function(chapter) {
                    var chap = angular.copy(chapter);
                    chap.Topics = [];
                    angular.forEach(chapter.Topics, function(topic) {
                        if (topic.TopicAverage < 50) {
                            chap.Topics.push(topic);
                        }
                    });
                    if (chap.Topics.length > 0) {
                        chaps.push(chap);
                    }
                });
                $scope.chaptersToShow = chaps;
            } else if (value == 2) {
                var chaps = [];
                angular.forEach($scope.chapters, function(chapter) {
                    var chap = angular.copy(chapter);
                    chap.Topics = [];
                    angular.forEach(chapter.Topics, function(topic) {
                        if (topic.TopicAverage < 75 && topic.TopicAverage >= 50) {
                            chap.Topics.push(topic);
                        }
                    });
                    if (chap.Topics.length > 0) {
                        chaps.push(chap);
                    }
                });
                $scope.chaptersToShow = chaps;
            } else if (value == 3) {
                var chaps = [];
                angular.forEach($scope.chapters, function(chapter) {
                    var chap = angular.copy(chapter);
                    chap.Topics = [];
                    angular.forEach(chapter.Topics, function(topic) {
                        if (topic.TopicAverage >= 75) {
                            chap.Topics.push(topic);
                        }
                    });
                    if (chap.Topics.length > 0) {
                        chaps.push(chap);
                    }
                });
                $scope.chaptersToShow = chaps;
            } else {
                $scope.chaptersToShow = angular.copy($scope.chapters);
            }
        };

        $scope.getAllTags = function() {
            var obj = {
                SubjectId: SelectClassFactory.selected.subject.Id,
                Type: 1
            };
            MarksStatisticsFactory.getAllTags(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.tags.length = 6; // chop the tags array to contain only hardcoded tags
                        //get the new tags and push it to tags array
                        for (var i = 0; i < success.data.Data.length; i++) {
                            success.data.Data[i].DisplayType = 2;
                            $scope.tags.push(success.data.Data[i]);
                        }
                        for (var i = 0; i < $scope.tags.length; i++) {
                            $scope.tags[i].IsSelected = false;
                            for (var j = 0; j < $scope.selected.Tags.length; j++) {
                                if ($scope.tags[i].Id == $scope.selected.Tags[j].Id) {
                                    $scope.tags[i].IsSelected = true;
                                }
                            }
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.openFilterModal = function() {
            // $scope.getBloomsTaxonomy();
            $scope.getAllTags();
            // $scope.getAllQuizzes();
            $scope.openModal();
        };

        $scope.filtersSelected = function() {
            $scope.closeModal();

            var selectedTags = [];
            $scope.selected.Tags = [];
            for (var i = 0; i < $scope.tags.length; i++) {
                if ($scope.tags[i].IsSelected) {
                    selectedTags.push($scope.tags[i].Name);
                    $scope.selected.Tags.push($scope.tags[i]);
                }
            }
            if (selectedTags.length == 0) {
                $scope.getMarksStatisticsByRange($scope.idList.ClassIds, $scope.idList.SubjectIds);
            } else {
                var obj = {
                    ClassIds: $scope.idList.ClassIds,
                    SubjectIds: $scope.idList.SubjectIds,
                    Tags: selectedTags,
                    Quizzes: [],
                    CollegeId: LoginFactory.loggedInUser.CollegeId,
                    IsElective: SelectClassFactory.selected.subject.IsElective
                }
                $scope.getMarksStatisticsByTags(obj);
            }
        };

        $scope.getMarksStatisticsByTags = function(obj) {
            MarksStatisticsFactory.getStatisticsByTags(obj)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                        calculateAverageWithWeightage();
                        $scope.studentsToShow = angular.copy($scope.students);
                        $scope.marksRangeChanged(MarksStatisticsFactory.sliderValues.min, MarksStatisticsFactory.sliderValues.max);
                        //sort based on name 
                        $scope.sortOrder = 'Name';
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.searchwordItemSelected = function(value) {
            $scope.selectedItem = value;
        };

        $scope.isActive = function(value) {
            return $scope.selectedItem == value;
        };

        $scope.sortStudents = function(value) {
            $scope.closePopover2();
            if (value == 1) {
                $scope.sortOrder = 'Marks';
            } else {
                $scope.sortOrder = '-Marks';
            }
        };

        $scope.reset = function() {
            $scope.closeModal();
            for (var i = 0; i < $scope.tags.length; i++) {
                $scope.tags[i].IsSelected = false;
            }
            $scope.selected.Tags = [];
            MarksStatisticsFactory.selectedTags = [];
            $scope.getMarksStatisticsByRange($scope.idList.ClassIds, $scope.idList.SubjectIds);
        };

        // $scope.getAllStudentsInClass();
        if ($scope.loggedInUser.PackageCode == 'BASIC') {
            $scope.getAllStudentsInClass();
        } else {
            $scope.getLessonPlan();
        }
    });