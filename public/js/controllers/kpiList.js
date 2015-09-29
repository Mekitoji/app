angular.module('project')

.controller('kpi-list', function ($scope, iTester) {

  $scope.loading = true;
  $scope.currentYear = document.location.pathname.split('/')[2];
  $scope.currentRegion = document.location.pathname.split('/')[1];

  $scope.filter = {};
  $scope.filter.year= $scope.currentYear;

  $scope.year = [2015, 2016, 2017, 2018, "all"];
  iTester.get()
    .success(function (testers) {
      $scope.testers = testers;
      $scope.kpi = [];
      _.each($scope.year, function (year) {
        _.each($scope.testers, function (v) {
          var url = "tester/" + v._id;
          if(v.user === null) {
            v.user = {local:{username:{first:"",last:""}}};
          }
          var total = {
            id: v.name,
            username: v.user.local.username.first + " " + v.user.local.username.last,
            year: year,
            respTime: 0,
            testCycles: 0,
            countResp: 0,
            countCycle: 0,
            url: url,
          };
          _.each(v.appStorage, function (z) {
          if (year === z.year || year ==="all") {
            z.year = "all";
            if (z.app === null) {
              z.app = {};
            }

            if (z.respTime !== 0) {
              total.countResp++;
              total.respTime += z.respTime;
            }

            if (z.app.tv === "Approved" || z.app.tv === "Partial") {
              total.testCycles += z.testCycle;
              total.countCycle++;
            }
          }
          });
          total.respTime = total.respTime / total.countResp;
          total.testCycles = total.testCycles / total.countCycle;
          total.respTime = total.respTime.toFixed(2);
          total.testCycles = total.testCycles.toFixed(2);
          if(isNaN(total.respTime)) {
            total.respTime = "N/A";
          }
          if(isNaN(total.testCycles)) {
            total.testCycles = "N/A";
          }
          $scope.kpi.push(total);
        });
      });
    })
    .finally(function(){
      $scope.loading = false;
    });
})

.factory('Rate', function($http) {
  return {
    get: function() {
      return $http.get('/api/rate');
    },
    getRegion: function(region) {
      return $http.get('/api/rate/' + region);
    },
    sendMail: function(region, year) {
      return $http.post('/' + region + '/' + year +'/tester');
    }
  };
})

.filter('month', function(){
  return function(input) {
    var date = new Date(2015, input, 1);
    var month = date.toLocaleString('en-us', { month: "long" });
    return month;
  };
})

.controller('rateSettings', function($scope, Rate) {

  var region = document.location.pathname.split('/')[1].toUpperCase();

  $scope.data = {};

  $scope.currentYear = $scope.currentYear;
  $scope.region = region.toLowerCase();

  // status of sent email
  // true - already sent;
  // false - not yet;
  $scope.successStatus = false;

  // count total data;
  $scope.average = {};

  $scope.sendMail = function(region, year) {
    Rate.sendMail(region, year)
    .success(function() {
      // get message visible
      $scope.successStatus = true;
    });
  };

  $scope.$watch('filter.year', function(newVal) {
    $scope.currentYear = newVal;
    Rate.getRegion(region)
    .success(function(data) {
      // get only data adjuct to current year
      var months = data.months.filter(function(v, k) {
        if(v.year != $scope.currentYear)
          return false;
        else
          return true;
      });

      $scope.data = data;
      $scope.data.months = months;
      $scope.average.total = countTotal(data, 'total');
      $scope.average.pass = countTotal(data, 'pass');
      $scope.average.fail = countTotal(data, 'fail');
      $scope.average.passRate = countAveragePassRate(data);
      console.log($scope.data, $scope.average);
    });
  });
  function countTotal(obj, param) {
      var count = 0;
      obj.months.forEach(function(v, k) {
        count += v[param];
      });
      return count;
  }
  function countAveragePassRate(obj) {
    var count = 0;
    var rate = 0;
    var result;
    obj.months.forEach(function(v) {
      count++;
      rate += (v.pass/v.total) * 100;
    });
    result = (rate/count).toFixed(2);
    return result;
  }
  Rate.getRegion(region)
    .success(function(data) {
      var months = data.months.filter(function(v, k) {
      if(v.year != $scope.currentYear)
          return false;
        else
          return true;
      });


      $scope.data = data;
      $scope.data.months = months;
      $scope.average.total = countTotal(data, 'total');
      $scope.average.pass = countTotal(data, 'pass');
      $scope.average.fail = countTotal(data, 'fail');
      $scope.average.passRate = countAveragePassRate(data);
      console.log($scope.data, $scope.average);
    });
})

.directive('rateChart', function($parse, $window) {
  return {
    restrict: 'A',
    scope: {data:"=chartData", year: "@year"},
    link: function(scope, elem) {

      var lineData = [];
      var year;

      var margin = {top: 80, right: 80, bottom: 80, left: 80};
      var width = 960 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;


      var svg = d3.select(elem[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      scope.$watch('data', function(newVal){
        svg.selectAll('*').remove();
        if(year === undefined) {
          year = 2015;
        }
        lineData = parseData(newVal, year);
        lineData.sort(function(a, b) {
          if(a.month > b.month) {
            return 1;
          } else if(a.month < b.month) {
            return -1;
          }
          return 0;
        });
        console.log(year, lineData);
        // if(lineData.length !== 0 ) {
         drawData();
        // }
      });

      scope.$watch('year', function(newVal) {
        svg.selectAll('*').remove();
        year = Number(newVal);
        lineData = parseData(scope.data, year);
        lineData.sort(function(a, b) {
          if(a.month > b.month) {
            return 1;
          } else if(a.month < b.month) {
            return -1;
          }
          return 0;
        });
        console.log(newVal, lineData);
         // if(lineData.length !== 0 ) {
          drawData();
        // }
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
            .tickFormat(d3.time.format("%B"))
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
