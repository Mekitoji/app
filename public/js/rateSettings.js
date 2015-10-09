'use strict';
angular.module('rate', [])

.factory('Rate', function($http) {
  return {
    get: function() {
      return $http.get('/api/rate');
    },
    getRegion: function(region) {
      return $http.get('/api/rate/' + region);
    }
  };
})

.filter('month', function(){
  return function(input) {
    var date = new Date(2015, input, 1);
    var month = date.toLocaleString('en-us', { month: 'long' });
    return month;
  };
})

.controller('rateSettings', function($scope, Rate) {

  $scope.data = {};
  // var region = document.location.split('/')[1];
  Rate.getRegion('CIS')
    .success(function(data) {
      $scope.data = data;
      console.log($scope.data);
    });

})

.directive('rateChart', function($parse, $window) {
  return {
    restrict: 'A',
    scope: {data:'=chartData'},
    link: function(scope, elem) {

      scope.currentYear = Number(document.location.pathname.split('/')[1]);

      var lineData = [];
      scope.$watch('data', function(newVal){
            lineData = parseData(newVal, scope.currentYear);
            lineData.sort(function(a, b) {
              if(a.month > b.month) {
                return 1;
              } else if(a.month < b.month) {
                return -1;
              }
              return 0;
            });
            if(lineData.length !== 0 ) {
             drawData();
            }
      });

      function parseData(val, year) {
        var result = [];
        if(val.region !== undefined) {
          val.months.forEach(function(d) {
            if(d.year === year) {
              var rate = ((d.pass/d.total) * 100).toFixed(2);
              result.push({rate: rate, month: d.monthNumber});
            }
          });
        }
        return result;
      }

      var margin = {top: 80, right: 80, bottom: 80, left: 80};
      var width = 960 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;

      function drawData() {

    var xLabels = d3.time.scale()
        .domain([ new Date(2012, d3.min(lineData, function(d) { return d.month; }), 1), new Date(2012, d3.max(lineData,function(d) { return d.month; }), 31)])
        .range([0, width]);

    var x = d3.scale.linear()
        .domain([0, lineData.length])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
    .scale(xLabels)
    .ticks(d3.time.months)
    .tickFormat(d3.time.format('%B'))
    .tickSize(-height)
    .tickSubdivide(true);

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(20)
        .orient('left');

    var line = d3.svg.line()
    .x(function(d,i) {
      return x(i);
    })
    .y(function(d) {
      return y(d.rate);
    });

    var svg = d3.select(elem[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll(".tick text")
        .style("text-anchor", "start")
        .attr("x", 6)
        .attr("y", 8);

     svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
          .selectAll(".tick text")
          .style("text-anchor", "start")
          .attr('x', -25)
          .attr('y', 4)
    .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Percent");
    svg.append("path")
      .datum(lineData)
      .attr('d', line)
      .attr('class', 'line');
      }
    }
  };
});
