// Set new default font family and font color to mimic Bootstrap's default styling

var url = "http://localhost:9000/admin/api/revenue";
var data
function doGetJSON() {
  // Call fetch(url) with default options.
  // It returns a Promise object:
  var aPromise = fetch(url);
  // Work with Promise object:
  aPromise
    .then(function (response) {
      console.log("OK! Server returns a response object:");
      console.log(response);
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      // Get JSON Promise from response object:
      var myJSON_promise = response.json();
      // Returns a Promise object.
      return myJSON_promise;
    })
    .then(function (myJSON) {
      var arrayOrder = Object.values(myJSON)
      var lengthOrder = Object.keys(myJSON).length
      var revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      var numberRequest = 0
      for (var i = 0; i < lengthOrder; i++) {
        if (arrayOrder[i].status == "processing") {
          numberRequest++
        }
        if (arrayOrder[i].status == "completed") {

          var month = new Date(arrayOrder[i].createdAt.toString()).getMonth() + 1
          switch (month) {
            case 1:
              revenue[1] += arrayOrder[i].cart.totalPrice
              break;
            case 2:
              revenue[2] += arrayOrder[i].cart.totalPrice
              break;
            case 3:
              revenue[3] += arrayOrder[i].cart.totalPrice
              break;
            case 4:
              revenue[4] += arrayOrder[i].cart.totalPrice
              break;
            case 5:
              revenue[5] += arrayOrder[i].cart.totalPrice
              break;
            case 6:
              revenue[6] += arrayOrder[i].cart.totalPrice
              break;
            case 7:
              revenue[7] += arrayOrder[i].cart.totalPrice
              break;
            case 8:
              revenue[8] += arrayOrder[i].cart.totalPrice
              break;
            case 9:
              revenue[9] += arrayOrder[i].cart.totalPrice
              break;
            case 10:
              revenue[10] += arrayOrder[i].cart.totalPrice
              break;
            case 11:
              revenue[11] += arrayOrder[i].cart.totalPrice
              break;
            case 12:
              revenue[12] += arrayOrder[i].cart.totalPrice
              break;
          }
        }
      }
      document.getElementById('numberRequest').innerHTML = numberRequest
      for (var i = 1; i <= 12; i++) {
        const currentMonth = new Date().getMonth() + 1;
        if (i == currentMonth) {
          htmlRevenue = revenue[i].toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
          htmlRevenue = htmlRevenue.replace('VND', '');
          document.getElementById("earningsMonthly").innerHTML = htmlRevenue
          break;
        }
      }
      var earningAnnual = 0
      for (var i = 0; i <= 12; i++) {
        console.log(typeof revenue[i])
        earningAnnual += revenue[i]
      }
      htmlRevenueAnnual = earningAnnual.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
      htmlRevenueAnnual = htmlRevenueAnnual.replace('VND', '');
      document.getElementById("earningAnnual").innerHTML = htmlRevenueAnnual

      

    })
    .catch(function (error) {
      console.log("Noooooo! Something error:");
      console.log(error);
    });
}
doGetJSON()
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

new Chart(document.getElementById("myBarChart1"), {
  type: 'bar',
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [{
      label: "Revenue",
      backgroundColor: "#4e73df",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#4e73df",

      data: [10000000, 20000000, 0, 0, 0, 0, 60000000, 0, 0, 0, 0, 100000000, 0],
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 12
        },
        maxBarThickness: 25,
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 150000000,
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return 'VND ' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function (tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        }
      }
    },
  }
});

// Bar Chart Example

