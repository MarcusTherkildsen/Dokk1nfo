$(document).ready(function(){


  /*Solcelle
  https://www.odaa.dk/dataset/solcelleanlaeg/resource/251528ca-8ec9-4b70-9960-83c4d0c4e7b6
  Dokk1 har sid 15523
  */
  var resource_id = '251528ca-8ec9-4b70-9960-83c4d0c4e7b6&q=15523';

  $.ajax({
    url: '/proxy_odaa.php',
    async:true,
    type: "POST",
    dataType: "json",
    data: {
      resource_id: resource_id
    },
    cache:false,
    success: function (json) {

      console.log(json['result']['records'][0]['time']);
      console.log(json['result']['records'][0]['current'] + " W"); // W lige nu
      console.log(json['result']['records'][0]['currentmax'] + " W"); // Dagens max instantane W
      console.log(json['result']['records'][0]['daily'] + " Wh"); // Dagens produktion i Wh
      console.log(json['result']['records'][0]['total'] + " Wh"); // Produktionen siden start i Wh

/*
      var tot_spaces=0;
      var tot_vehicles=0;

      for (var key in json['result']['records']){

        tot_spaces+=json['result']['records'][key]['totalSpaces'];
        tot_vehicles+=json['result']['records'][key]['vehicleCount'];

      }
*/

/*
      console.log("Total antal pladser: "+tot_spaces);
      console.log("Total antal optaget: "+tot_vehicles);
      console.log("Antal ledige: "+(tot_spaces-tot_vehicles));

      $("#parkering_list").append('<h1 class="middle_norm helptext">'
          + 'Dokk1' + '<br>'
          + json['result']['records'][key]['date'] + '<br>'
          + (tot_spaces-tot_vehicles)
          + ' ledige pladser.'
          + '</h1>');
          */
    },  
    error: function (xhr, ajaxOptions, thrownError) {
      console.log("shit fucked up dog");
    }

  });
});