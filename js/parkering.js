$(document).ready(function(){


  /*Virkelig lol
  https://www.odaa.dk/dataset/parkeringshuse-i-aarhus/resource/2a82a145-0195-4081-a13c-b0e587e9b89c
  For at få data for Dokk1 skal man tage summen af tæller 12+13 og IKKE den der hedder Dokk1
  */
  var resource_id = '2a82a145-0195-4081-a13c-b0e587e9b89c&q=urban+level';

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

      var tot_spaces=0;
      var tot_vehicles=0;

      for (var key in json['result']['records']){
/*
        console.log(key);
        console.log(json['result']['records'][key]['garageCode']);
        console.log(json['result']['records'][key]['totalSpaces']);
        console.log(json['result']['records'][key]['vehicleCount']);
*/
        tot_spaces+=json['result']['records'][key]['totalSpaces'];
        tot_vehicles+=json['result']['records'][key]['vehicleCount'];

      }

      console.log("Total antal pladser: "+tot_spaces);
      console.log("Total antal optaget: "+tot_vehicles);
      console.log("Antal ledige: "+(tot_spaces-tot_vehicles));

      $("#parkering_list").append('<h1 class="middle_norm helptext">'
          + 'Dokk1' + '<br>'
          + json['result']['records'][key]['date'] + '<br>'
          + (tot_spaces-tot_vehicles)
          + ' ledige pladser.'
          /*
          + tot_vehicles
          + ' udad '
          + tot_spaces
          + ' pladser taget.'
          */
          + '</h1>');
    },  
    error: function (xhr, ajaxOptions, thrownError) {
      console.log("shit fucked up dog");
    }

  });
});