/**
 * Created by Heinfried on 5/25/2015.
 */
'use strict';

var HourlySalesController = function ($scope, $timeout, Restangular, AccessToken, DTOptionsBuilder, DTColumnDefBuilder) {
    var token = AccessToken.get();

    var recalcFromServer = function (inputDate) {
        Restangular.setDefaultHeaders({'Authorization': 'Bearer ' + token.access_token});
        Restangular.setDefaultRequestParams({'date': inputDate});
        Restangular.all('Reports/HourlySalesEventSourced').getList().then(function (entries) {
            //console.log(entries);
            $scope.entries = entries;
            $scope.DailySalesAmount = entries.DailySalesAmount;
        });

        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rtip').withDisplayLength(-1);
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            //DTColumnDefBuilder.newColumnDef(1).notVisible(),
            DTColumnDefBuilder.newColumnDef(2).notSortable().withOption('sWidth', '130px')
        ];
        $('.page-spinner-bar').addClass('hide');
    }

    $scope.initEventSource = function () {
        if (token) {
            //console.log($scope.salesDate);

            var todaysDate = new Date();
            recalcFromServer(todaysDate);

            $scope.recalcSalesDate = function (data) {
                var newDate = new Date($scope.salesDate.getTime() + 180 * 60000);
                console.log('steve:' + newDate);
                recalcFromServer(newDate);
            }
        }
    }

    $scope.initSingleEntry = function () {
        if (token) {
            //Restangular.setDefaultRequestParams({'access_token': token.access_token});
            Restangular.setDefaultHeaders({'Authorization': token.token_type + " " + token.access_token});
            Restangular.setDefaultRequestParams({'date': '2015-04-30'});
            Restangular.one('Reports/HourlySalesSingleEntry').get().then(function(entries){
                $scope.entries = entries.HourlySales;
            });

            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rtip').withDisplayLength(-1);
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                //DTColumnDefBuilder.newColumnDef(1).notVisible(),
                DTColumnDefBuilder.newColumnDef(2).notSortable().withOption('sWidth', '130px')
            ];
            $('.page-spinner-bar').addClass('hide');
        }
    }

    $scope.initMultiEntry = function () {
        if (token) {
            //Restangular.setDefaultRequestParams({'access_token': token.access_token});
            Restangular.setDefaultHeaders({'Authorization': 'Bearer ' + token.access_token});
            Restangular.setDefaultRequestParams({'date': "2015-04-30"});
            Restangular.all('Reports/HourlySalesMultipleEntries').getList().then(function(entries){
                $scope.entries = entries;
            });

            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rtip').withDisplayLength(-1);
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                //DTColumnDefBuilder.newColumnDef(1).notVisible(),
                DTColumnDefBuilder.newColumnDef(2).notSortable().withOption('sWidth', '130px')
            ];
            $('.page-spinner-bar').addClass('hide');
        }
    }
};