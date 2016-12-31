////////////////////// FUNCTIONS

// Log the clicked faust
function logging(search_string, search_or_click, avail_number, floor){
  $.ajax({
      url: '/logging.php',
      async:true, 
      type: "POST",
      dataType: "text",
      data: {
        search_string: search_string,
        search_or_click: search_or_click,
        avail_number: avail_number,
        floor: floor
      },
      success: function (response) {
        // what happens when success
      },  
    error: function (xhr, ajaxOptions, thrownError) {
      // what happens when failed
    }
  });
}

function isInArray(days, day) {
  return days.indexOf(day) > -1;
}

function search_shelf_wrapper(json, json_shelves){

  var found_coords=0;
  for (var faust_i in json){

      var search_results = search_shelf(json[faust_i], json_shelves);

      if (typeof search_results[0] === 'undefined' || search_results[0].length == 0){                           
        // Don't append, in fact, let's remove it 
        delete json[faust_i];
      }
      else{
        found_coords+=1;
        if (isInArray(json[faust_i]['placement'], "Børn")){
          var floor = 2;
        }
        else
        {
          var floor = 1;
        }
        json[faust_i]['floor'] = floor;
        json[faust_i]['coords'] = [search_results[0], search_results[1]];
      }     
  }
  
  if (found_coords == 0){
    return null;  
  }
  else{
    return json;
  }
}


function search_shelf(search_object, json_shelves){

  var shelf_id = [];
  var niveau;
  place_len = search_object['placement'].length-1;
  item_placement = search_object['placement'];

  if (isInArray(item_placement, "Børn")){
    //search_query = "boern";
    niveau = '2';
  }
  else
  {
    niveau = '1';
  }

  
  if (place_len == 2){      
    // Check for (first) number in last entry     
    var num = parseFloat(item_placement[place_len].match(/[\d\.]+/));
    var num_or_not = isNaN(num); // True if string
    if (num_or_not == true){
    /*
    var num = item_placement[place_len].replace(/\D+$/g, "");
    if (num.length == 0){*/
      // Getting writers surname. Used for finding item on shelve
      writers_surname = item_placement[place_len].trim().substr(1).trim();
      // Novel/roman. Getting first letter of writer's surname
      if (niveau == '1'){         
        search_query = writers_surname.substr(0, 1).toLowerCase();
      }
      else{
        // Necessary for niveau 2
        search_query = 'roman';
      }
    }
    else
    {
      // Numbered search
      search_query = num;     
      // Getting writers surname. Used for finding item on shelve
      writers_surname = item_placement[place_len].substr(num.length).trim().substr(1).trim();                   
    }
  }
  else
  {
    if (item_placement[2] != null){
      search_query = item_placement[2].toLowerCase();
    }
    else{
      search_query = item_placement[1].toLowerCase();
    }
    // Any æøå characters goes unrecognised so we have to take them into accounts
    search_query = search_query.replace(/æ/g, "ae");
    search_query = search_query.replace(/ø/g, "oe");
    search_query = search_query.replace(/å/g, "aa");
    // Getting writers surname. Used for finding item on shelve
    writers_surname = item_placement[place_len].trim().substr(1).trim();
  }
  //console.log(search_query+', '+ writers_surname);
  // Another check
  if (writers_surname == 'Lokalhistorie'){
    search_query = 'lokalhistorie';
  }

  var music_list = ["Musik", "Flere CD-plader"];

  // The random fix sections
  
  for (var gh in music_list){
    if (isInArray(item_placement, music_list[gh])){
      search_query='musik';
    }   
  }

  if (isInArray(item_placement, "CD-boxsæt")){
    search_query = "boxsaet";
  }

  if (isInArray(item_placement, "Læs selv - 1") ||
    isInArray(item_placement, "Læs selv - 2") ||
    isInArray(item_placement, "Læs selv - 3")){
    search_query = "letlaesning";
  }

  if (niveau == '2'){
    if (isInArray(item_placement, "Polsk") || isInArray(item_placement, "Engelsk")){
      search_query = "andre sprog";
    }
  }

  if (isInArray(item_placement, "Fantasi/Fantasy")){
    search_query = "fantasy";
  }

  if (isInArray(item_placement, "Dramatik")){
    search_query = "drama";
  }

  if (isInArray(item_placement, "Lokalhistorie")){
    search_query = "lokalhistorie";
  }

  if (isInArray(item_placement, "Drengeliv/pigeliv")){
    search_query = "pigeliv";
  }

  if (isInArray(item_placement, "Stort format")){
    search_query = "stor skrift";
  }

  if (isInArray(item_placement, "Lettere bøger")){
    search_query = "lette boeger";
  }

  if (isInArray(item_placement, "Tekst & Ting")){
    search_query = "tekst og ting";
  }

  if (isInArray(item_placement, "Antologi")){
    search_query = "antologier";
  }

  if (isInArray(item_placement, "Pulterkammer")){
    search_query = "pulterkammeret";
  }

  if (isInArray(item_placement, "Fokuspunktet")){
    search_query = "fokuspunktet";
  }

  if (isInArray(item_placement, "Pegebøger")){
    search_query = "billedbog";
  }

  if (isInArray(item_placement, "Lydbog")){
    search_query = "lydbog";
  }

/*
  if (isInArray(d[faust[jk]][hj], "Engelsk")){
    search_query = "engelsk"
  }
*/

  //console.log("Search query: " + search_query);
  // Search string is now decided

  // Check if input search_query is a number or string. Needed for faster search
  var s_valid = isNaN(search_query); // returns true if string              
  var points_x = [];
  var points_y = [];
  
  // Special check for biographies. Worst of practices.         
  if (search_query == '99.4'){// || search_query == '62'|| search_query =='61.642'){      
    for (var key in json_shelves[niveau]){  
      for (var k in json_shelves[niveau][key]["subj_num"]) {
        if (search_query == json_shelves[niveau][key]["subj_num"][k][0] && search_query == json_shelves[niveau][key]["subj_num"][k][1]){
          points_x.push(json_shelves[niveau][key]["pos"][0]);
            points_y.push(json_shelves[niveau][key]["pos"][1]); 
            shelf_id.push(key);
        }
      }
    }
  }
  else{
    // Go through shelf ids
    for (var key in json_shelves[niveau]) { 
      if (s_valid == false){
        // Check numbers
        for (var k in json_shelves[niveau][key]["subj_num"]) {
          if (search_query >= json_shelves[niveau][key]["subj_num"][k][0] && search_query < json_shelves[niveau][key]["subj_num"][k][1]){
            points_x.push(json_shelves[niveau][key]["pos"][0]);
              points_y.push(json_shelves[niveau][key]["pos"][1]); 
              shelf_id.push(key);
          }
        }   
      }
      else {
        // Check texts
        for (var i in json_shelves[niveau][key]["subj_txt"]) {
          if (json_shelves[niveau][key]["subj_txt"][i] == search_query){
            points_x.push(json_shelves[niveau][key]["pos"][0]);
              points_y.push(json_shelves[niveau][key]["pos"][1]); 
              shelf_id.push(key);
          }
        }
      }
    }
  }
  return [points_x, points_y]; 
}

function publish_results(json){

  // Push search results to html
  if (json == null  || '-1' in json){
    $("#navid ul").append("<div><h3>Ingen match (overhovedet) fundet på Dokk1 <br> Buhu :(</h3></div>");
  }
  else{
    var border_c;
    //console.log("ready to publish");

    for (var faust_i in json){

      // If item available then green, else red
      if (json[faust_i]['avail_num']>0){
        border_c = "#009900";
      }
      else{
        border_c = "#990000";
      }

      // Check if placement arr is defined
      if (json[faust_i]['placement']){

        $("#navid ul").append(
              '<div class="col-md-3 col-sm-6 hero-feature"><div id="chopper"><a href=""><div class="thumbnail" id="' + (faust_i+'_'+0) + '" style="">'
              +'<img src=' + json[faust_i]['thumb'] +' style="width:80px; height:110px; border:5px solid ' + border_c + '; border-radius: 5px" alt="">'
              +'<div class="caption"><h3>'+json[faust_i]['title']+'</h3>'
              +'<p>'+json[faust_i]['author']
              /*
              +'. ['
              +d[faust[faust_i]][hj].slice(-1) +']'
              */
              + '</p>'
              +'</div></div></a></div></div>');
      }
    }
  }

  $("#navid ul").append(
    '<div class="col-md-3 col-sm-6 hero-feature"><div id="chopper"><a href=""><div class="thumbnail" id="not_found" style="">'
    +'<img src="http://www.dokk1nfo.dk/img/hjaelp.jpg" style="width:80px; height:110px; border:5px solid purple; border-radius: 5px" alt="">'
    +'<div class="caption"><h3>Fandt du ikke hvad du søgte?</h3>'
    +'<p>Klik her for at finde ud af hvorfor</p>'
    +'</div></div></a></div></div>'
  );

  // Get the max height
    var heights = $("div.thumbnail").map(function ()
    {
        return $(this).height();
    }).get();

    maxHeight = Math.max.apply(null, heights);

    var styles = {"border-radius": "5px", "background-color":"transparent", "height": maxHeight}
    // This is the height to set for all elements maxHeight
    $("div.thumbnail").each(function() {
      $(this).css( styles );
  });
}

function plot_shelf(points_x, points_y, avail_or_not, placement, faust_title, floor){

  // Draw layout
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d'); // Global since used by plotting function
  imageObj = new Image();
  canvas.width = 1782;
  canvas.height = 1795;
  imageObj.onload = function() {
  ctx.drawImage(imageObj, 0, 0);
  };
  imageObj.src = 'img/'+floor+'_jpeg_clean.jpg';

  // Make sure markings are on top
  // from http://stackoverflow.com/a/26064753/5241172
  ctx.globalCompositeOperation='destination-over';

  // Plot the found shelves 
  var radius = 15;
  for (var j = 0; j < points_x.length; j++) {

    // If item available then green, else red
    if (avail_or_not>0){
      ctx.fillStyle = "#009900";
    }
    else{
      ctx.fillStyle = "#990000";
    }

    // Draw dot   
    ctx.beginPath();
    ctx.arc(points_x[j], points_y[j], radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();    
  }

  for (var j = 0; j < points_x.length; j++) {

    // Draw larger ring around
    ctx.beginPath();
    ctx.arc(points_x[j], points_y[j], 2*radius, 0, Math.PI * 2, true);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#235587";
        ctx.stroke();
    ctx.closePath();    
  }

  // Append faust to box class
  $(".box").append("<h3 style='text-align:center'>" + faust_title + ".<br>[" + placement + "]</h3>");
            
}

// function to close our popups
function closePopup(){
$(".overlay-bg, .overlay-content").hide(); //hide the overlay

// remove text from box
$(".box h3").each(function() {
    $(this).remove();
});
}

// show popup when you click on the link
$(".show-popup").click(function(event){
event.preventDefault(); 
var selectedPopup = $(this).data("showpopup"); 
showPopup(selectedPopup); 
});

// hide popup when user clicks on close button or if user clicks anywhere outside the container
$(".close-btn, .overlay-bg").click(function(){
closePopup();
});

// hide the popup when user presses the esc key
$(document).keyup(function(e) {
if (e.keyCode == 27) { // if user presses esc key
closePopup();
}
});

function overlay_text(text_to_display){
  var customElement   = $("<div>", {
      id      : "countdown",
      css     : {
          "font-size" : "40px",
          "z-index" : "1000",
          "padding-bottom" : "170px", 
          "text-align": "center"
      },
      text    : text_to_display
  });

  var options = {
      custom  : customElement    
  };

  $.LoadingOverlaySetup(options)
};
////////////////////// FUNCTIONS END

$(document).ready(function(){
  
$('#plot_form').submit(function(ev) {
    ev.preventDefault();

  // Check if search is empty or just whitespaces
  if ($('#shelf_id').val().replace(/ /g, '').length != 0){

    // Parse the input field into a search form
    search_query = $('#shelf_id').val().split(' ').join('%20');

    // from http://gasparesganga.com/labs/jquery-loading-overlay/
    // Setup Loading overlay
    overlay_text("Venter på aakb.dk");
    $.LoadingOverlay("show");

    // Remove old search results
    $("#navid ul div").each(function() {
            $(this).remove();
        });

    // Log the search string
    logging($('#shelf_id').val(), "S", null, null);

    // TODO
    // Check for XSS

    // Problematic since it can be other places
    place_txt = ["Non Dokk1 item"];
    should_txt = ["Should have found a match, plizz fix"];

    // Search and scrape from aakb.dk on serverside to avoid browser specific DOM handling
    $.ajax({
        url: '/server_scrape.php',
        async: true, 
        type: "POST",
        dataType: "json",
        data: {
        // This is parsed to the php function where the scraping occurs 
          search_string: search_query
        },
        cache: false,
        success: function (json) {

            /* The returned object has json[$faust][$stuff] where
            $stuff can be
            $author
            $thumb
            $title
            $placement
            $avail_num
            */
            //console.log(json);

            $.LoadingOverlay("hide");
            overlay_text("Tjekker hylder");
            $.LoadingOverlay("show");

            // Let's check the shelves
            $.getJSON( "data/full_final.json", function( json_shelves ) {
              
              if(json == null || '-1' in json){
                //console.log("no matches found");
                publish_results(json);
              }
              else{
                //console.log("Matches found");
                json_done = search_shelf_wrapper(json, json_shelves); 
                publish_results(json_done);
              }
                
              $.LoadingOverlay("hide");

              });

            },  
            error: function (xhr, ajaxOptions, thrownError) {

            }
          });

        }

});
});

// Make all elements in search list clickable
$(document).on('click', '.thumbnail', function(ev) {
  ev.preventDefault();

  if (this.id == 'not_found'){

    logging(null, "E", null, null); 
    window.location = "http://www.dokk1nfo.dk/om";
  }
  else
  {
    // First 8 digits is the faust numba
    var faust_id = (this.id).slice(0, 8);
    var upcount = 0;//(this.id).slice(-1);

    // function to show our popups
    function showPopup(whichpopup){
      var docHeight = $(document).height();
      var scrollTop = $(window).scrollTop(); 
      $(".overlay-bg").show().css({"height" : docHeight}); 
      $(".popup"+whichpopup).show().css({"top": scrollTop+20+"px"}); 
    }
    
    
    if (json_done != null){

      var points_x = json_done[faust_id]['coords'][0];
      var points_y = json_done[faust_id]['coords'][1];
      var avail_or_not = parseInt(json_done[faust_id]['avail_num'], 10);
      var floor = json_done[faust_id]['floor'];

      showPopup("1"); 

      logging(faust_id, "C", avail_or_not, floor);
/*
      console.log('faust id: ' + faust_id);
      console.log('location: '+ json_done[faust_id]['placement']);
      console.log('point_x: ' + points_x);
      console.log('point_y: ' + points_y);
      console.log('avail: ' + parseInt(avail_or_not, 10));
      console.log('avail datatype: ' + (typeof parseInt(avail_or_not, 10)));
      console.log('floor: ' + floor);
      console.log('');
*/
      var faust_title = json_done[faust_id]['title'];
      plot_shelf(points_x, points_y, avail_or_not, json_done[faust_id]['placement'], faust_title, floor);
    }
    else{ // This is superflous since it should (ideally) never trigger.
      console.log("This should never trigger");
      // Clear markings
      /*
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageObj, 0, 0);
      */
    }
    
  }
});
