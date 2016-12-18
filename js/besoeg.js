$(document).ready(function(){


  /*
  Hovedbiblioteket (aka. Dokk1) har libno 775100 fra
  https://www.odaa.dk/dataset/besogstal-og-abningstider-for-aarhus-kommunes-biblioteker/resource/02acfa44-2a6b-4dd8-a433-ad1f16604395

  Vi bruger det til at hive data herfra
  https://www.odaa.dk/dataset/besogstal-og-abningstider-for-aarhus-kommunes-biblioteker/resource/705e6735-9567-48a6-9cf3-6bc89f93e107
  */

  /*
  Historiske data (seneste indgang er fra i går)
  */

  /*
  var resource_id = '705e6735-9567-48a6-9cf3-6bc89f93e107&q=775100';

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
      
      
      for(var key in json['result']['records']){

        console.log(json['result']['records'][key]['time']);
        console.log(json['result']['records'][key]['count']);
        console.log('');
      }
      
    },  
    error: function (xhr, ajaxOptions, thrownError) {
      console.log("shit fucked up dog");
    }

  });

  */


//////////////////////////////////////////////////////////////////////

  /*
  Data fra idag
  https://www.odaa.dk/dataset/taellekamera-pa-dokk1/resource/b82383a4-97ec-4377-b0ea-94b2e6fe70c0
  */

  var resource_id = 'b82383a4-97ec-4377-b0ea-94b2e6fe70c0';

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
      
      var tot_in = 0;
      var tot_out = 0;

      for(var key in json['result']['records']){
        /*
        console.log(json['result']['records'][key]['time']);
        console.log(json['result']['records'][key]['in']);
        console.log(json['result']['records'][key]['out']);
        console.log('');
        */
        tot_in += json['result']['records'][key]['in'];
        tot_out += json['result']['records'][key]['out'];
        /*
        console.log(tot_in);
        console.log(tot_out);
        console.log('');
        */
      }
      console.log("Total ind: " + tot_in);
      console.log("Total ud: " + tot_out);

      var mismatch = tot_in - tot_out;

      if (mismatch > 0){
        console.log("Dokk 1 har i dag spist " + mismatch + " personer");
        $("#besoeg_list ").append('<h1 class="middle helptext">Dokk1 har i dag spist ' + mismatch + ' personer</h1>');
      }
      else{
        console.log("Dokk 1 har i dag givet liv til " + -mismatch + " personer");
        $("#besoeg_list").append('<h1 class="middle helptext">Dokk1 har i dag givet liv til ' + -mismatch + ' personer</h1>');
      }
    },  
    error: function (xhr, ajaxOptions, thrownError) {
      console.log("shit fucked up dog");
    }

  });
});