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

function scrape(response) {

	var faust=[];
	var author=[];
	var title=[];
	var thumb_url=[];

    // Get faust, title, author and thumbnail url
	var elements = $("<div>").html(response)[0].getElementsByClassName("search-result--heading-type");
  	for(var i = 0; i < elements.length; i++) {

  		var parent_element = elements[i].parentElement.parentElement.parentElement;

  		// new, more easily read way
  		console.log('in scrape');

  		/*
  		faust
  		title
  		author
  		thumb
  		*/

  		// Here we should make a check for "870970-basis" (12chars) og "775100-katalog" (14chars) which are the only two cases where the item "might" be available at the library.
	    // As a start, I will simply check for 870970 and 775100
  		var in_faust = parent_element.childNodes[2].childNodes[1].childNodes[1].childNodes[0].getAttribute("href").slice(17, 23);
  		if (in_faust== 870970 || in_faust == 775100){

	  		// Faust
	  		//console.log(parent_element.childNodes[2].childNodes[1].childNodes[1].childNodes[0].getAttribute("href").slice(-8));
	  		faust.push(parent_element.childNodes[2].childNodes[1].childNodes[1].childNodes[0].getAttribute("href").slice(-8));

	  		// Title
	  		var temp_title = parent_element.childNodes[2].childNodes[1].childNodes[1].childNodes[0];
			if (typeof temp_title !== 'undefined'){
				//console.log(parent_element.childNodes[2].childNodes[1].childNodes[1].childNodes[0].innerHTML);
				title.push(temp_title.innerHTML);
			}
			else{
				title.push('Ukendt');
			}
	  	
			// Author
			var temp_author = parent_element.childNodes[2].childNodes[2].nextElementSibling;
			if (typeof temp_author !== 'undefined'){
				//console.log(parent_element.childNodes[2].childNodes[2].nextElementSibling.childNodes[1].innerHTML);
				if (typeof temp_author.childNodes[1] !== 'undefined'){
					author.push(temp_author.childNodes[1].innerHTML);
				}
				else{
				author.push('Ukendt');
				}
			}
			else{
				author.push('Ukendt');
			}

  		// Thumb
  		var temp_thumb = parent_element.childNodes[1].getElementsByTagName('img')[0];
			if (typeof temp_thumb !== 'undefined'){
				//console.log(parent_element.childNodes[1].getElementsByTagName('img')[0].getAttribute('src'));
				thumb_url.push(temp_thumb.getAttribute('src'));
			}
			else{
				thumb_url.push('http://www.dokk1nfo.dk/img/no_image.jpg');
			}	
	  		//console.log('');
  		}
	}

  	// Check if no matches
  	if (faust.length == 0){
  		$("#navid ul").append(
  		'<div class="col-md-3 col-sm-6 hero-feature"><div id="chopper"><a href=""><div class="thumbnail" id="not_found" style="">'
  		+'<img src="http://www.dokk1nfo.dk/img/hjaelp.jpg" style="width:80px; height:110px; border:5px solid purple; border-radius: 5px" alt="">'
  		+'<div class="caption"><h3>Fandt du ikke hvad du søgte?</h3>'
  		+'<p>Klik her for at finde ud af hvorfor</p>'
  		+'</div></div></a></div></div>'
		);
  		return null;
  	}
  	else{

    	// Search each of these faust numbers
      	var part_url = "/ding_availability/holdings/";
      	for(var i = 0; i < faust.length; i++) {
      		part_url+=faust[i]+","
      	};
      	part_url = part_url.slice(0, -1);
	}

	return [faust, author, title, thumb_url, part_url];
}


function get_faust_occurences(json){
	
	var subkey;	
	var place_arr = [];

	//var no_go_list = ["Børn", "Fjerndepot", "Skolebibliotek", "Bibliotekarbord"]; 
	var no_go_list = ["Fjerndepot", "Skolebibliotek", "Bibliotekarbord"];

	// Each key is the item associated with the faust number
	for (var key in json){

		/*
		If json[key]['available'] == false it means that the book is 
		NOT reservable at any lib in Aarhus and thus not available to lend.
		
		This is relevant since the 'available_count' can be > 0 at Dokk1 but 
		in reality it is not available since it is reserved. Therefore we need to make
		a check for that.
		*/

		// Check if holdings is null
		if (json[key]['holdings'] != null){
			n_libs = (json[key]['holdings']).length;        
		
			// Get availability status, placement
			for (var i=0; i<n_libs;i++){

				// Check the no go list
				var go_or_no = true;
				for (var uk=0; uk<no_go_list.length; uk++){
					if (isInArray(json[key]['holdings'][i]['placement'], no_go_list[uk]) == true){
						go_or_no = false;
					};	
				}
				
				// Main criteria
				if (json[key]['holdings'][i]['placement'][0] == 'Hovedbiblioteket' && go_or_no == true){

					if (json[key]['reservable'] == false){
						avail_count = 0;
					}
					else{
						avail_count = json[key]['holdings'][i]['available_count'];
					}

					// Placement and availability
					place_arr.push({faust: key, place: json[key]['holdings'][i]['placement'], avail_num: avail_count})
				}
			}
		}
	}

	// http://stackoverflow.com/questions/19599361/append-values-to-javascript-dictionary
	// Each object has: avail_num, faust and placement
	d = {};

	for (var i = 0; i < place_arr.length; i++) {
	    var datum = place_arr[i];

	    // if NOT undefined
	    if (!d[datum.faust]) {
	        d[datum.faust] = [];
	    }

	    d[datum.faust].push(datum.place);
	    d[datum.faust].push(datum.avail_num);
	}

	return d;
}

function search_shelf_wrapper(faust, d, json_mt){

	var coords_arr = [];
	for (var faust_i in faust){
		// Check if placement arr is defined
		if (d[faust[faust_i]]){
			//console.log("chosen faust: " + faust[faust_i]);

			for (var hj=0; hj<d[faust[faust_i]].length; hj+=2){
				//console.log("location: "+ d[faust[faust_i]][hj]);

				// So here we are. Each found placement array is right here. 
				// how to search and save in a meaningfull manner?

				var search_results = search_shelf(faust, d, json_mt, faust_i, hj);
				//console.log(search_results);

				// Now we have
				// title
				// author
				// coordinates to shelf/shelves
				// availability ([d[faust_id][1+2]])

				// what we need
				// on shelf or not
				// saving in a meaningful manner
				// Return coordinates
				if (typeof search_results[0] === 'undefined' || search_results[0].length == 0){														
					// Don't append
				}
				else{
					//console.log("we are pushing coords");

					if (isInArray(d[faust[faust_i]][hj], "Børn")){
						var floor = 2;
					}
					else
					{
						var floor = 1;
					}
					coords_arr.push({faust: faust[faust_i], floor: floor, coords: [search_results[0], search_results[1]]})
			}
			//console.log('');
		}
	}
	}

	// http://stackoverflow.com/questions/19599361/append-values-to-javascript-dictionary
	// Each object has: coords and faust
	if (coords_arr.length > 0){
		var coords_done = {};
		for (var i = 0; i < coords_arr.length; i++) {
		    var datum = coords_arr[i];
		    // if NOT undefined
		    if (!coords_done[datum.faust]) {
		        coords_done[datum.faust] = [];
		    }
		    coords_done[datum.faust].push([datum.coords, datum.floor]);
		}
		return coords_done;
	}
	else{
		return null;
	}

}


function search_shelf(faust, d, json_mt, jk, hj){

	var shelf_id = [];
	var niveau;
	place_len = d[faust[jk]][hj].length-1;
	item_placement = d[faust[jk]][hj];

	if (isInArray(d[faust[jk]][hj], "Børn")){
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
		if (isInArray(d[faust[jk]][hj], music_list[gh])){
			search_query='musik';
		}		
	}

	if (isInArray(d[faust[jk]][hj], "CD-boxsæt")){
		search_query = "boxsaet";
	}

	if (isInArray(d[faust[jk]][hj], "Læs selv - 1") ||
		isInArray(d[faust[jk]][hj], "Læs selv - 2") ||
		isInArray(d[faust[jk]][hj], "Læs selv - 3")){
		search_query = "letlaesning";
	}

	if (niveau == '2'){
		if (isInArray(d[faust[jk]][hj], "Polsk") || isInArray(d[faust[jk]][hj], "Engelsk")){
			search_query = "andre sprog";
		}
	}

	if (isInArray(d[faust[jk]][hj], "Fantasi/Fantasy")){
		search_query = "fantasy";
	}

	if (isInArray(d[faust[jk]][hj], "Dramatik")){
		search_query = "drama";
	}

	if (isInArray(d[faust[jk]][hj], "Lokalhistorie")){
		search_query = "lokalhistorie";
	}

	if (isInArray(d[faust[jk]][hj], "Drengeliv/pigeliv")){
		search_query = "pigeliv";
	}

	if (isInArray(d[faust[jk]][hj], "Stort format")){
		search_query = "stor skrift";
	}

	if (isInArray(d[faust[jk]][hj], "Lettere bøger")){
		search_query = "lette boeger";
	}

	if (isInArray(d[faust[jk]][hj], "Tekst & Ting")){
		search_query = "tekst og ting";
	}

	if (isInArray(d[faust[jk]][hj], "Antologi")){
		search_query = "antologier";
	}

	if (isInArray(d[faust[jk]][hj], "Pulterkammer")){
		search_query = "pulterkammeret";
	}

	if (isInArray(d[faust[jk]][hj], "Fokuspunktet")){
		search_query = "fokuspunktet";
	}

	if (isInArray(d[faust[jk]][hj], "Pegebøger")){
		search_query = "billedbog";
	}

	if (isInArray(d[faust[jk]][hj], "Lydbog")){
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
		for (var key in json_mt[niveau]){	
			for (var k in json_mt[niveau][key]["subj_num"]) {
				if (search_query == json_mt[niveau][key]["subj_num"][k][0] && search_query == json_mt[niveau][key]["subj_num"][k][1]){
					points_x.push(json_mt[niveau][key]["pos"][0]);
	  				points_y.push(json_mt[niveau][key]["pos"][1]);	
	  				shelf_id.push(key);
				}
			}
		}
	}
	else{
		// Go through shelf ids
		for (var key in json_mt[niveau]) {	
			if (s_valid == false){
				// Check numbers
				for (var k in json_mt[niveau][key]["subj_num"]) {
					if (search_query >= json_mt[niveau][key]["subj_num"][k][0] && search_query < json_mt[niveau][key]["subj_num"][k][1]){
						points_x.push(json_mt[niveau][key]["pos"][0]);
		  				points_y.push(json_mt[niveau][key]["pos"][1]);	
		  				shelf_id.push(key);
					}
				}		
			}
			else {
				// Check texts
				for (var i in json_mt[niveau][key]["subj_txt"]) {
					if (json_mt[niveau][key]["subj_txt"][i] == search_query){
						points_x.push(json_mt[niveau][key]["pos"][0]);
		  				points_y.push(json_mt[niveau][key]["pos"][1]);	
		  				shelf_id.push(key);
					}
				}
			}
		}
	}
	return [points_x, points_y]; 
}

function publish_results(coords_done, d, faust, thumb_url, title, author){

	// Push search results to html
	if (coords_done === null){
		$("#navid ul").append("<div><h3>Ingen match (overhovedet) fundet på Dokk1 <br> Buhu :(</h3></div>");
	}
	else{
		var border_c;
		//console.log("ready to publish");

		// Now we have to be able to print out
		/*
		title
		author
		thumbnail url
		placement
		coordinates
		avail or not
		*/

		for (var faust_i in faust){
			if (typeof coords_done[faust[faust_i]] === 'undefined' && typeof d[faust[faust_i]] !== 'undefined'){
				// If item not at dokk1 then don't append this item
				console.log(title[faust_i]);
				console.log(author[faust_i]);
				console.log(faust[faust_i] + " ikke fundet i Dokk1, men det burde den have været");
				for (var spas = 0; spas < d[faust[faust_i]].length;spas+=2){

					console.log(d[faust[faust_i]][spas]);	
				}
				console.log('');
			}
			else if (typeof coords_done[faust[faust_i]] === 'undefined' && typeof d[faust[faust_i]] === 'undefined'){
				// If item not at dokk1 then don't append this item
				/*
				console.log(faust[faust_i] + " ikke fundet i Dokk1, OG det burde den heller ikke have været");
				console.log(d[faust[faust_i]]);
				console.log('');
				*/
			}
			else{

				// Check if placement arr is defined
				if (d[faust[faust_i]]){
					/*
					console.log("chosen faust: " + faust[faust_i]);
					console.log("title: " + title[faust_i]);
					console.log("author: " + author[faust_i]);
					console.log("thumbnail url: " + thumb_url[faust_i]);
					*/
					var upcount=-1;
					for (var hj=0; hj<d[faust[faust_i]].length; hj+=2){
						upcount+=1;
						if (typeof coords_done[faust[faust_i]][upcount] !== 'undefined'){
							/*
							console.log("location: "+ d[faust[faust_i]][hj]);
							console.log("point_x: " + coords_done[faust[faust_i]][upcount][0][0]);
							console.log("point_y: " + coords_done[faust[faust_i]][upcount][0][1]);
							console.log("avail: " + [d[faust[faust_i]][1+hj]]);
							*/
							// If item available then green, else red
							if ([d[faust[faust_i]][1+hj]]>0){
								border_c = "#009900";
							}
							else{
								border_c = "#990000";
							}

							$("#navid ul").append(
			          		'<div class="col-md-3 col-sm-6 hero-feature"><div id="chopper"><a href=""><div class="thumbnail" id="' + (faust[faust_i]+'_'+upcount) + '" style="">'
			          		+'<img src=' + thumb_url[faust_i] +' style="width:80px; height:110px; border:5px solid ' + border_c + '; border-radius: 5px" alt="">'
			          		+'<div class="caption"><h3>'+title[faust_i]+'</h3>'
			          		+'<p>'+author[faust_i]
			          		/*
			          		+'. ['
			          		+d[faust[faust_i]][hj].slice(-1) +']'
			          		*/
			          		+ '</p>'
			          		+'</div></div></a></div></div>'
							);		
						}	
					}
				}
				//console.log('');
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
	//imageObj.src = 'img/1_svg_clean.svg';

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

////////////////////// FUNCTIONS END

$(document).ready(function(){
	
	// Setup Loading overlay
	var customElement   = $("<div>", {
	    id      : "countdown",
	    css     : {
	        "font-size" : "40px",
	        "z-index" : "1000",
	        "padding-bottom" : "170px", 
	        "text-align": "center"
	    },
	    text    : "Venter på aakb.dk"
	});

	var options = {
	    custom  : customElement    
	};

	$.LoadingOverlaySetup(options)

$('#plot_form').submit(function(ev) {
    ev.preventDefault();

	// Check if search is empty or just whitespaces
	if ($('#shelf_id').val().replace(/ /g, '').length != 0){

		// Parse the input field into a search form
		search_query = $('#shelf_id').val().split(' ').join('%20');

		// from http://gasparesganga.com/labs/jquery-loading-overlay/
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

		// Search and scrape from aakb.dk
		var part_url = "/search/ting/";
		$.ajax({
		    url: '/proxy.php',
		    async:true, 
		    type: "POST",
		    dataType: "text",
		    data: {
				// This is parsed to the php curl function. 
		    	search_string: part_url + search_query + "?size=40"//&facets[]=facet.type%3Abog"
		    },
		    success: function (response) {

		    	var scrape_response = scrape(response);

		    	console.log(scrape_response);

		    	if (scrape_response == null){
		    		// Don't do more
		    		$.LoadingOverlay("hide");
		    	}
		    	else{
			    	faust = scrape_response[0];
			    	var author = scrape_response[1];
			    	title = scrape_response[2];
			    	var thumb_url = scrape_response[3];
			    	var part_url = scrape_response[4];

		          	// Make a bundled request with all faust numbers	
					$.ajax({
						url: '/proxy.php',
						async:true,
						type: "POST",
						dataType: "json",
						data: {
						search_string: part_url
						},
						cache:false,
						success: function (json) {

						// d has faust as key which contain placement_arr and avail_num
						d = get_faust_occurences(json);

						// CHECK IF FOUND ON SHELF
						$.getJSON( "data/full_final.json", function( json_mt ) {
							coords_done = search_shelf_wrapper(faust, d, json_mt);	
							$.LoadingOverlay("hide");
							publish_results(coords_done, d, faust, thumb_url, title, author);		
			        	});	
						
						},  
						error: function (xhr, ajaxOptions, thrownError) {

							/*
							This will also fire even if all status responses are 200 OK because the ajax call expects
		          			json response. When the aakb.dk server is down for maintenance every night at around 2-3 o'clock
		          			this means that the response is not proper json and thus we end up here. */
		          			//$(".dokknav").LoadingOverlay("hide");

		          			$.LoadingOverlay("hide");
		          			$("#navid ul").append("<div><h3>Data ikke tilgængelig fra aakb.dk <br> De er nok nede for vedligeholdelse, buhu :(</h3></div>");
							console.log(xhr);
						}
					});

				}
			},
		    error: function (xhr, ajaxOptions, thrownError) {
		    	//$(".dokknav").LoadingOverlay("hide");
		    	$.LoadingOverlay("hide");
		    	$("#navid ul").append("<div><h3>Ingen kontakt til aakb.dk <br> De er nok HELT nede, buhu :(</h3></div>");
		        console.log(xhr);
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
		var upcount = (this.id).slice(-1);
		var hj = upcount*2;

		// function to show our popups
		function showPopup(whichpopup){
			var docHeight = $(document).height();
			var scrollTop = $(window).scrollTop(); 
			$(".overlay-bg").show().css({"height" : docHeight}); 
			$(".popup"+whichpopup).show().css({"top": scrollTop+20+"px"}); 
		}
		
		
		if (typeof coords_done[faust_id][upcount] !== 'undefined'){

			var points_x = coords_done[faust_id][upcount][0][0];
			var points_y = coords_done[faust_id][upcount][0][1];
			var avail_or_not = parseInt([d[faust_id][1+hj]], 10);
			var floor = coords_done[faust_id][upcount][1];

			showPopup("1"); 

			logging(faust_id, "C", avail_or_not, floor);

/*
			console.log('faust id: ' + faust_id);
			console.log('upcount: ' + upcount);
			console.log('hj: ' + hj);

			console.log('location: '+ d[faust_id][hj]);
			console.log('point_x: ' + points_x);
			console.log('point_y: ' + points_y);
			console.log('avail: ' + parseInt(avail_or_not, 10));
			console.log('avail datatype: ' + (typeof parseInt(avail_or_not, 10)));
			console.log('floor: ' + floor);
			console.log('');
*/

			
			// Find title with this faust
			var faust_title = title[faust.indexOf(faust_id)];
			// d[faust_id][hj].slice(-1)
			plot_shelf(points_x, points_y, avail_or_not, d[faust_id][hj], faust_title, floor)
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