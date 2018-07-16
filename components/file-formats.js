(function () {
    'use strict';
    angular
        .module('app')
        .directive('fileFormatsModal', function ($http) {
            var directive = {
                link: link,
                restrict: 'E',
                replace: true,
                templateUrl: 'components/file-formats.html'
            };
            return directive;

            function link(scope, element, attrs) {

            }
        });
})();