angular.module('history-project')

.filter('idBeautifier', function() {
  return function(input) {
    //[210273] playontv
    var result = input.split('[')[1].split(']')[0];
    return result;
  };
});
