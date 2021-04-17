// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('smartFacultyApp', ['ionic',
    'ionic-datepicker',
    'angular-svg-round-progressbar',
    'ionic-toast',
    'ngCordova',
    'ion-gallery',
    '720kb.tooltips',
    'ti-segmented-control',
    'ion-floating-menu',
    'rzModule',
    'highcharts-ng',
    'ionic-timepicker'
])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $state, $ionicHistory, $cordovaNetwork, ionicToast, LoginFactory) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }
        $ionicPlatform.registerBackButtonAction(function(e) {
            if ($state.is('menu.dashboard') || $state.is('selectClass') || $state.is('login') || $state.is('welcome') || $state.is('menu.enquiries') || $state.is('menu.library')) {
                if (confirm('Are you sure you want to Exit?')) {
                    ionic.Platform.exitApp();
                    return false;
                } else {
                    e.preventDefault();
                    return false;
                }
            } else if ($state.is('menu.takeAttendance') || $state.is('menu.assignments') || $state.is('menu.tests') || $state.is('menu.lessonPlan') || $state.is('menu.marksStatistics') || $state.is('menu.questions') || $state.is('menu.onlineClass')) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('menu.dashboard');
            } else if ($state.is('smartLearning')) {
                e.preventDefault();
                return false;
            } else {
                $ionicHistory.goBack();
            }
        }, 100);

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            $ionicLoading.hide();
        });
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner><div>Waiting for network connection...',
                animation: 'fade-in',
                showBackdrop: false,
            });
        });

        if (!$cordovaNetwork.isOnline()) {
            ionicToast.show('There is no network connection..', 'bottom', false, 2500);
        }

        // FCMPlugin.onNotification(
        //     function(data) {
        //         if (data.wasTapped) {
        //             //Notification was received on device tray and tapped by the user. 
        //             console.log(JSON.stringify(data));
        //         } else {
        //             //Notification was received in foreground. Maybe the user needs to be notified. 
        //             console.log(JSON.stringify(data));
        //         }
        //     },
        //     function(msg) {
        //         console.log('onNotification callback successfully registered: ' + msg);
        //         $rootScope.$broadcast('fcm-plugin-loaded');
        //     },
        //     function(err) {
        //         console.log('Error registering onNotification callback: ' + err);
        //     });

    });

    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: false,
        });
    });

    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    });

}).config(function($stateProvider, $urlRouterProvider, $httpProvider, ionGalleryConfigProvider, $ionicConfigProvider) {

    ionGalleryConfigProvider.setGalleryConfig({
        action_label: 'Close'
    });

    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.views.swipeBackEnabled(false);

    $httpProvider.interceptors.push(function($rootScope) {
        return {
            request: function(config) {
                $rootScope.$broadcast('loading:show');
                return config;
            },
            requestError: function(requestError) {
                $rootScope.$broadcast('loading:hide');
                return requestError;
            },
            response: function(response) {
                $rootScope.$broadcast('loading:hide');
                return response;
            },
            responseError: function(rejection) {
                $rootScope.$broadcast('loading:hide');
                return rejection;
            }
        }
    });

    $stateProvider
        .state('login', {
            url: '/login',
            cache: false,
            templateUrl: 'app/Login/Login.html',
            controller: 'LoginController'
        })
        .state('selectClass', {
            url: '/selectClass',
            cache: false,
            templateUrl: 'app/SelectClass/SelectClass.html',
            controller: 'SelectClassController'
        })
        .state('welcome', {
            url: '/welcome',
            cache: false,
            templateUrl: 'app/SkillsAndYou/WelcomePage/Welcome.html',
            controller: 'WelcomeController'
        })
        .state('observation', {
            url: '/observation',
            cache: false,
            templateUrl: 'app/SkillsAndYou/ObservationPage/Observation.html',
            controller: 'ObservationController'
        })
        .state('travel', {
            url: '/travel',
            cache: false,
            templateUrl: 'app/Travel/Travel.html',
            controller: 'TravelController'
        })
        .state('changePassword', {
            url: '/changePassword',
            cache: false,
            templateUrl: 'app/ChangePassword/ChangePassword.html',
            controller: 'ChangePasswordController'
        })
        .state('events', {
            url: '/events',
            cache: false,
            templateUrl: 'app/Events/EventList/EventList.html',
            controller: 'EventListController'
        })
        .state('eventDetails', {
            url: '/eventDetails',
            cache: false,
            templateUrl: 'app/Events/EventDetails/EventDetails.html',
            controller: 'EventDetailsController'
        })
        .state('calendar', {
            url: '/calendar',
            cache: false,
            templateUrl: 'app/CalendarList/CalendarList.html',
            controller: 'CalendarListController'
        })
        .state('selectSemester', {
            url: '/selectSemester/:from',
            cache: false,
            templateUrl: 'app/SelectSemester/SelectSemester.html',
            controller: 'SelectSemesterController'
        })
        .state('studentList', {
            url: '/studentList',
            cache: false,
            templateUrl: 'app/Students/StudentList.html',
            controller: 'StudentListController'
        })
        .state('studentDetails', {
            url: '/studentDetails/:studentId',
            cache: false,
            templateUrl: 'app/StudentDetails/StudentDetails.html',
            controller: 'StudentDetailsController'
        })
        .state('smartLearning', {
            url: '/smartLearning',
            cache: false,
            templateUrl: 'app/SmartLearning/SmartLearning.html',
            controller: 'SmartLearningController'
        })
        .state('topicDetails', {
            url: '/topicDetails',
            cache: false,
            templateUrl: 'app/TopicDetails/TopicDetails.html',
            controller: 'TopicDetailsController'
        })
        .state('specialAttendance', {
            url: '/specialAttendance',
            cache: false,
            templateUrl: 'app/SpecialAttendance/Selection/SpecialAttendance.html',
            controller: 'SpecialAttendanceController'
        })
        .state('specialAttendanceList', {
            url: '/specialAttendanceList',
            cache: false,
            templateUrl: 'app/SpecialAttendance/AttendanceList/SpecialAttendanceList.html',
            controller: 'SpecialAttendanceListController'
        })
        .state('specialAttendanceSubjects', {
            url: '/specialAttendanceSubjects',
            cache: false,
            templateUrl: 'app/SpecialAttendance/SubjectList/SpecialAttendanceSubjects.html',
            controller: 'SpecialAttendanceSubjectsController'
        })
        .state('chapters', {
            url: '/chapters',
            cache: false,
            templateUrl: 'app/Elearning/Chapters/Chapters.html',
            controller: 'ChaptersController'
        })
        .state('video', {
            url: '/video',
            cache: false,
            templateUrl: 'app/WatchVideo/Video.html',
            controller: 'VideoController'
        })
        .state('menu', {
            abstract: true,
            templateUrl: 'app/Sidemenu/Sidemenu.html',
            controller: 'SidemenuController'
        })
        .state('menu.takeAttendance', {
            url: '/takeAttendance',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/TakeAttendance/TakeAttendance.html',
                    controller: 'TakeAttendanceController'
                }
            }
        })
        .state('menu.attendanceList', {
            url: '/attendanceList',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/EditAttendance/AttendanceList/AttendanceList.html',
                    controller: 'AttendanceListController'
                }
            }
        })
        .state('menu.studentAttendanceList', {
            url: '/studentAttendanceList',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/EditAttendance/StudentList/StudentAttendanceList.html',
                    controller: 'StudentAttendanceListController'
                }
            }
        })
        .state('menu.assignments', {
            url: '/assignments',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Assignments/AssignmentList/Assignments.html',
                    controller: 'AssignmentsController'
                }
            }
        })
        .state('menu.assignmentDetails', {
            url: '/assignmentDetails',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Assignments/AssignmentDetails/AssignmentDetails.html',
                    controller: 'AssignmentDetailsController'
                }
            }
        })
        .state('menu.publishAssignment', {
            url: '/publishAssignment',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Assignments/PublishAssignment/PublishAssignment.html',
                    controller: 'PublishAssignmentController'
                }
            }
        })
        .state('menu.tests', {
            url: '/tests',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Tests/TestsList/Tests.html',
                    controller: 'TestsController'
                }
            }
        })
        .state('menu.testDetails', {
            url: '/testDetails',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Tests/TestDetails/TestDetails.html',
                    controller: 'TestDetailsController'
                }
            }
        })
        .state('menu.createTest', {
            url: '/createTest',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Tests/CreateTest/CreateTest.html',
                    controller: 'CreateTestController'
                }
            }
        })
        .state('menu.dashboard', {
            url: '/dashboard',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Statistics/Dashboard/Dashboard.html',
                    controller: 'DashboardController'
                }
            }
        })
        .state('menu.attendanceStatistics', {
            url: '/attendanceStatistics',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Statistics/AttendanceStatistics/AttendanceStatistics.html',
                    controller: 'AttendanceStatisticsController'
                }
            }
        })
        .state('menu.marksStatistics', {
            url: '/marksStatistics',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Statistics/MarksStatistics/MarksStatistics.html',
                    controller: 'MarksStatisticsController'
                }
            }
        })
        .state('menu.studentStatistics', {
            url: '/studentStatistics',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Statistics/StudentStatistics/StudentStatistics.html',
                    controller: 'StudentStatisticsController'
                }
            }
        })
        .state('menu.studentAttendance', {
            url: '/studentAttendance',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Statistics/StudentAttendance/StudentAttendance.html',
                    controller: 'StudentAttendanceController'
                }
            }
        })
        .state('menu.showIndex', {
            url: '/showIndex',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/ShowIndex/ShowIndex.html',
                    controller: 'ShowIndexController'
                }
            }
        })
        .state('menu.lessonPlan', {
            url: '/lessonPlan',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/LessonPlan/LessonPlan.html',
                    controller: 'LessonPlanController'
                }
            }
        })
        .state('menu.createSmartTest', {
            url: '/createSmartTest',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/CreateSmartTest/CreateSmartTest.html',
                    controller: 'CreateSmartTestController'
                }
            }
        })
        .state('menu.learningReport', {
            url: '/learningReport',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/LearningReport/LearningReport.html',
                    controller: 'LearningReportController'
                }
            }
        })
        .state('menu.chapterAndTopics', {
            url: '/chapterAndTopics/:from',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Criteria/ChapterAndTopics/ChapterAndTopics.html',
                    controller: 'ChapterAndTopicsController'
                }
            }
        })
        .state('menu.criteriaList', {
            url: '/criteriaList',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Criteria/CriteriaList/CriteriaList.html',
                    controller: 'CriteriaListController'
                }
            }
        })
        .state('menu.enterCriteria', {
            url: '/enterCriteria',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Criteria/EnterCriteria/EnterCriteria.html',
                    controller: 'EnterCriteriaController'
                }
            }
        })
        .state('menu.facultyAttendance', {
            url: '/facultyAttendance',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/FacultyAttendance/FacultyAttendance.html',
                    controller: 'FacultyAttendanceController'
                }
            }
        })
        .state('menu.lmTest', {
            url: '/lmTest',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Tests/LMTest/LMTest.html',
                    controller: 'LMTestController'
                }
            }
        })
        .state('menu.enquiries', {
            url: '/enquiries',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Enquiries/EnquiryList/Enquiries.html',
                    controller: 'EnquiriesController'
                }
            }
        })
        .state('menu.addEnquiry', {
            url: '/addEnquiry/:isEdit',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Enquiries/AddEnquiry/AddEnquiry.html',
                    controller: 'AddEnquiryController'
                }
            }
        })
        .state('menu.expenses', {
            url: '/expenses',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Expenses/ExpenseList/Expenses.html',
                    controller: 'ExpensesController'
                }
            }
        })
        .state('menu.addExpense', {
            url: '/addExpense',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Expenses/AddExpense/AddExpense.html',
                    controller: 'AddExpenseController'
                }
            }
        })
        .state('menu.library', {
            url: '/library',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Library/Library.html',
                    controller: 'LibraryController'
                }
            }

        })
        .state('menu.skillReport', {
            url: '/skillReport',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/SkillReport/SkillReport.html',
                    controller: 'SkillReportController'
                }
            }

        })
        .state('menu.questions', {
            url: '/questions',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Questions/Questions.html',
                    controller: 'QuestionsController'
                }
            }

        })
        .state('menu.analyseSkills', {
            url: '/AnalyseSkills',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/AnalyseSkills/AnalyseSkills.html',
                    controller: 'AnalyseSkillsController'
                }
            }
        })
        .state('menu.onlineClass', {
            url: '/onlineClass',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/OnlineClass/OnlineClass.html',
                    controller: 'OnlineClassController'
                }
            }
        });

    $urlRouterProvider.otherwise('/login');

});