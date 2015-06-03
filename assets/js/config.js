/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider', '$locationProvider', 'RestangularProvider',
        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider, $locationProvider, RestangularProvider) {

            $httpProvider.defaults.useXDomain = true;

            RestangularProvider.setBaseUrl('http://office.eposity.com/EposityOffice/api/');
            //add a response intereceptor
            RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                var extractedData;
                // .. to look for getList operations
                if (operation === 'getList') {
                    console.log(url);
                    if (url == 'http://office.eposity.com/EposityOffice/api/Reports/HourlySalesEventSourced') {
                        extractedData = data.HourlySales;
                        extractedData.DailySalesAmount = data.DailySalesAmount;
                    } else {
                        extractedData = data;
                    }
                } else {
                    extractedData = data;
                }
                console.log('steve');
                console.log(extractedData);

                return extractedData;
            });

            $stateProvider
                .state('login', {
                    url: '/login',
                    data: { pageTitle: 'Login' },
                    apiRequest: false,
                    authenticate: false,
                    views: {
                        'base': {
                            templateUrl: 'tpl/views/unauthorized.html',
                            controller: AuthenticationController
                        }
                    }
                })
                .state('register', {
                    url: '/register',
                    data: {pageTitle: 'Registration'},
                    apiRequest: false,
                    authenticate: false,
                    views: {
                        'base': {
                            templateUrl: 'tpl/views/register.html',
                            controller: AuthenticationController
                        }
                    }
                })
                .state('dashboard', {
                    url: '/dashboard',
                    authenticate: true,
                    apiRequest: false,
                    data: { pageTitle: 'Dashboard' },
                    views: {
                        'base': {
                            templateUrl: 'tpl/app.html'
                        },
                        'content@dashboard': {
                            templateUrl: 'tpl/views/dashboard.html'
                        }
                    }
                })
                // Sales
                .state('sales', {
                    url: '/sales',
                    data: { pageTitle: 'Sales Transactions' },
                    authenticate: true,
                    apiRequest: false,
                    views: {
                        'base': {
                            templateUrl: 'tpl/app.html'
                        },
                        'content@sales': {
                            templateUrl: 'tpl/views/sales/index.html',
                            controller: SalesController,
                            resolve: {
                                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'dataTables'
                                    ], {
                                        insertBefore: '#lazyload_placeholder'
                                    })
                                    .then(function() {
                                        return $ocLazyLoad.load('assets/js/controllers/salesCtrl.js');
                                    });
                                }]
                            }
                        }
                    }
                })
                .state('sales.details', {
                    url: '/:id/details',
                    authenticate: true,
                    apiRequest: true,
                    data: { pageTitle: 'Transaction Details' },
                    views: {
                        'base': {
                            templateUrl: 'tpl/app.html'
                        },
                        'content@sales': {
                            templateUrl: 'tpl/views/sales/details.html',
                            controller: SalesController
                        }
                    }
                })
                .state('salesEventSourcing', {
                    url: '/sales/hourly/event-sourcing',
                    data: { pageTitle: 'Event Sourced Hourly Sales' },
                    authenticate: true,
                    apiRequest: false,
                    views: {
                        'base': {
                            templateUrl: 'tpl/app.html'
                        },
                        'content@salesEventSourcing': {
                            templateUrl: 'tpl/views/sales/hourly/event-sourcing.html',
                            controller: HourlySalesController,
                            resolve: {
                                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'dataTables'
                                    ], {
                                        insertBefore: '#lazyload_placeholder'
                                    })
                                    .then(function() {
                                        return $ocLazyLoad.load('assets/js/controllers/hourlyCtrl.js');
                                    });
                                }]
                            }
                        }
                    }
                })

                .state('salesSingleEntry', {
                    url: '/sales/hourly/single-entry',
                    data: {pageTitle: "Single Entry Hourly Sales"},
                    authenticate: true,
                    apiRequest: false,
                    views: {
                        'base': {
                            'templateUrl': 'views/authorized.html'
                        },
                        'content@salesSingleEntry': {
                            templateUrl: 'views/sales/hourly/single-entry.html',
                            //controller: HourlySalesController
                        }
                    }
                })
                .state('salesMultipleEntry', {
                    url: '/sales/hourly/multiple-entry',
                    data: {pageTitle: "Multiple Entry Hourly Sales"},
                    authenticate: true,
                    apiRequest: false,
                    views: {
                        'base': {
                            'templateUrl': 'views/authorized.html'
                        },
                        'content@salesMultipleEntry': {
                            templateUrl: 'views/sales/hourly/multiple-entry.html',
                            //controller: HourlySalesController
                        }
                    }
                })
                .state('otherwise', {
                    url: '/otherwise',
                    views: {
                        'base': {
                            templateUrl: '',
                            controller: function($state) {
                                $state.go('dashboard');
                            }
                        }
                    }
                })
            ;

            // Redirect any unmatched url
            $urlRouterProvider.otherwise("/otherwise");
        }
    ]);