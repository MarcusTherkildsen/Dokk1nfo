$(document).ready(function(){


  /*Should work in the day time
  Realtime kødata på Dokk1
  https://www.odaa.dk/dataset/kodata/resource/38d6520a-b1b9-4224-a7ae-23d4b14f598f#

  They have this structure
  http://www.odaa.dk/api/3/action/datastore_search?resource_id=251528ca-8ec9-4b70-9960-83c4d0c4e7b6
  */

  //Sun
  //var resource_id = '251528ca-8ec9-4b70-9960-83c4d0c4e7b6';
  // Kø dokk1
  var resource_id = '38d6520a-b1b9-4224-a7ae-23d4b14f598f';

  $.ajax({
    url: '/proxy_odaa.php',
    async:true,
    type: "POST",
    dataType: "json",
    data: {
      resource_id: resource_id // This is parsed to the php curl function 
    },
    cache:false,
    success: function (json) {

      for (var key in json['result']['records']){
        console.log(json['result']['records'][key]['ServiceTypeName']);

        /*Number of people currently waiting in line for this service*/
        console.log(json['result']['records'][key]['WaitingCustomersMQ']);

        // Avg. waiting pr. person in line (avg over last 10 people)
        console.log(json['result']['records'][key]['AvgWaitingSQ']);
        
        /*Often undefined*/
        //console.log(json['result']['records'][key]['WaitingCustomersSQ ']);
        
        /*Don't get this one*/
        //console.log(json['result']['records'][key]['LongestWaitingTimeTicketSQ']);
        
        /*Longest waiting in line. Often makes no sense since the timer begins in the middle of the night
        and this, this value is grossly exaggerated*/
        console.log(json['result']['records'][key]['LongestWaitingTimeTicketMQ']);
        
        var d = JSON.stringify(json['result']['records'][key]['AvgWaitingSQ']).slice(-9, -1);

        console.log(d);
        console.log(d.slice(-8,-6));
        console.log(d.slice(-5,-3));
        console.log(d.slice(-2));
        console.log('');

        $("#koe_list").append('<li style="list-style:none"><h1>'
        + json['result']['records'][key]['ServiceTypeName'] + '</h1>'
        + '<hr class="slim-margin"><h2>'
        + 'Antal personer i kø: '
        + json['result']['records'][key]['WaitingCustomersMQ'] + '<br>'
        + 'Gennemsnitlig ventetid for de sidste 10 personer: '
        + d
        /*
        + d.slice(-8,-6)
        + ' time(r), '
        + d.slice(-5,-3)
        + ' minut(ter), '
        + d.slice(-2)
        + ' sekund(er).'
        */
        + '<br><br>'
        + '</h2></li>');

        }

    },  
    error: function (xhr, ajaxOptions, thrownError) {
      console.log("shit fucked up dog");
    }

  });
});