(function () {
    'use strict';
    angular
        .module('app')
        .directive('formatsModal', function ($http) {
            var directive = {
                link: link,
                restrict: 'E',
                replace: true,
                templateUrl: 'components/formats.html'
            };
            return directive;

            function link(scope, element, attrs) {

            }
        });
})();