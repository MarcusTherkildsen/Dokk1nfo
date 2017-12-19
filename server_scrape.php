<?php

/*
The goal of this serverside-script is to get the source code of a aakb.dk search result and then extract stuff corresponding to 
faust = scrape_response[0];
var author = scrape_response[1];
title = scrape_response[2];
var thumb_url = scrape_response[3];
var part_url = scrape_response[4];
https://www.aakb.dk/ding_availability/holdings/29567239
*/

// Pretty print array for debugging
function print_arr($in_arr){
  echo "<pre>";
  print_r($in_arr);
  echo "</pre>";
  return None;
}

// Function for basic field validation (present and neither empty nor only white space
function IsNullOrEmptyString($question){
    return (!isset($question) || trim($question)==='');
}

// Temporary "solution" until Dokk1 solves the real problem
function searchStringForNumber($in_string){


  //echo $in_string;
  // Skip the first part of the string since it contain some unwanted information
  //$in_string = substr($in_string, 

  // Find numbers in the string http://www.regexr.com/ http://www.phpliveregex.com/ in the form of "> number"
  preg_match_all("/> (?:\d*\.)?\d+/", $in_string, $myArray);
  
  // Get last entry (the one with most occurences) and remove "> "
  $myString = str_replace('> ', '', end(end($myArray)));

  return $myString;
}

// http://stackoverflow.com/a/2087136/5241172
function DOMinnerHTML(DOMNode $element) 
{ 
    $innerHTML = ""; 
    $children  = $element->childNodes;

    foreach ($children as $child) 
    { 
        $innerHTML .= $element->ownerDocument->saveHTML($child);
    }

    return $innerHTML; 
}

/*Retrieve the json elements in parallel since dokk1 has ****** the previous format up

$arr_faust = ['51271661', '51810694'];
$json = file_get_contents('https://www.aakb.dk/ding_availability/holdings/51271661,51810694');
// Return as array http://stackoverflow.com/a/6815562/5241172
$obj = json_decode($json, true);
print_arr($obj);

This should return 
51271661 -> 64.14
51810694 -> 99.4

but it returns whatever comes first for every faust number (in this case 64.14). If I try switching the order of my request I get 99.4 for both. Broken as ****.

*/
//////////////////////////////////
// http://tech.vg.no/2013/07/23/php-perform-requests-in-parallel/
function parallel_calls($urls){
  $multi = curl_multi_init();
  $channels = array();

  $return_arr = array();
   
  // Loop through the URLs, create curl-handles
  // and attach the handles to our multi-request
  foreach ($urls as $url) {
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_HEADER, false);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   
      curl_multi_add_handle($multi, $ch);
   
      $channels[$url] = $ch;
  }
   
  // While we're still active, execute curl
  $active = null;
  do {
      $mrc = curl_multi_exec($multi, $active);
  } while ($mrc == CURLM_CALL_MULTI_PERFORM);
   
  while ($active && $mrc == CURLM_OK) {
      // Wait for activity on any curl-connection
      if (curl_multi_select($multi) == -1) {
          continue;
      }
   
      // Continue to exec until curl is ready to
      // give us more data
      do {
          $mrc = curl_multi_exec($multi, $active);
      } while ($mrc == CURLM_CALL_MULTI_PERFORM);
  }
   
  // Loop through the channels and retrieve the received
  // content, then remove the handle from the multi-handle
  foreach ($channels as $channel) {
      //echo curl_multi_getcontent($channel);
      
      // Had to cast to array to get proper format
      array_push($return_arr, (array) curl_multi_getcontent($channel));

      curl_multi_remove_handle($multi, $channel);
  }
   
  // Close the multi-handle and return our results
  curl_multi_close($multi);

  return $return_arr;
}

function combined($scrambled_arr){
  $return_arr = array();

  $scrambled_arr_count = count($scrambled_arr);
  for($i=0;$i<$scrambled_arr_count;$i++){

    $temp_arr = json_decode($scrambled_arr[$i][0], true);

    $return_arr[key($temp_arr)] = $temp_arr[key($temp_arr)];
  
  }
  return $return_arr;
}

/////////////////////////////////////////////////////////

if (IsNullOrEmptyString($_POST['search_string'])){
  // Send to 404 page  
  //header("Location: http://dokk1nfo.dk/404");
  //die();

  //$query = 'https://www.aakb.dk/search/ting/dr%C3%B8mmeprinsessen';
  //$query = 'https://www.aakb.dk/search/ting/Helt%20igennem%20sund%20%26%20frisk';
  //$query = 'https://www.aakb.dk/search/ting/wehatisgoingonwfbdsa';
  //$query = 'https://www.aakb.dk/search/ting/turen%20til';
  //$query = 'https://www.aakb.dk/search/ting/snack';
  $query = 'https://www.aakb.dk/search/ting/golf';
  //$query = 'https://www.aakb.dk/search/ting/51443195';
}
else
{
  // The query string containing the properly formatted (from JS) search_string
  $query = 'https://www.aakb.dk/search/ting/' . $_POST['search_string'] . '?size=40';
}

$dom = new DOMDocument();
$dom->validateOnParse = true; // <-- This is just for testing if we get more images loaded.. 
$classname = "ting-object view-mode-search-result imagestyle-ding-list-medium list-item-style clearfix";
//$classname = "availability search-result--availability";
@$dom->loadHTMLFile($query, LIBXML_COMPACT); // Returns true for success and false otherwise. Should make a check.


// discard white space
//$dom->preserveWhiteSpace = false;

$nodes = array();
$nodes = $dom->getElementsByTagName("div");
$arr_faust = array();

$part_url = "/ding_availability/holdings/";

foreach ($nodes as $element)
{

   $classy = $element->getAttribute("class");

   // If the current class equal to the "parent" we expect
   if ($classy == $classname)
   {

    /*
    - faust
    - title
    - author
    - thumb
    */

    $parent = $element->childNodes->item(1);

    // FAUST
    $faust_str = $parent->childNodes->item(1)->getAttribute('href');
    // Returns something like /ting/collection/870970-basis%3A53119867

// http://php.net/manual/en/language.operators.string.php

    // Here we should make a check for "870970-basis" (12chars) og "775100-katalog" (14chars) which are the only two cases where the item "might" be available at the library.
    // As a start, I will simply check for 870970 and 775100
    $in_faust = substr($faust_str, 17, 6);

    if ($in_faust == 870970 || $in_faust == 775100)
    {
    
      // The last 8 chars is the faust number
      $faust = substr($faust_str, -8);

      // Thumb (1->1->1)
      $temp_thumb = $parent->childNodes->item(1)->childNodes->item(1)->childNodes->item(1)->getElementsByTagName("img")->item(0);
      if (!is_null($temp_thumb))
      {
        $thumb[$faust] = $temp_thumb->getAttribute('src');
      }
      else
      {
        $thumb[$faust] = 'http://www.dokk1nfo.dk/img/no_image.jpg';
        //$thumb[$faust] = null; // Insert http://www.dokk1nfo.dk/img/no_image.jpg' in JS
      }

      // This is not the most robust or effective way but it works for now.. 
      $tempolol = $parent->getElementsByTagName('a');

      // Title
      $temp_title = $tempolol->item(1);
      if (!is_null($temp_title))
      {
        $title[$faust] = $temp_title->textContent;
      }
      else
      {
        $title[$faust] = 'Ukendt';
        //$title[$faust] = null; // Insert 'Ukendt' in JS
      }

      $temp_title = $tempolol->item(2);
      if (!is_null($temp_title))
      {
        $author[$faust] = $temp_title->textContent;
      }
      else
      {
        $author[$faust] = 'Ukendt';
        //$author[$faust] = null; // Insert 'Ukendt' in JS
      }

      $part_url.="{$faust},";
      
      array_push($arr_faust, $faust);      
    }
  }
}

// Remove trailing comma http://stackoverflow.com/a/5593009/5241172
$part_url = rtrim($part_url, ",");

/*
echo $part_url;

print_arr($arr_faust);
print_arr($thumb);
*/

////////////////////////////////////////////////////////////////////
// This should be the way but as explained below this does not work
// Get the json object http://stackoverflow.com/a/15617547/5241172 
/*
ini_set("allow_url_fopen", 1);
$json = file_get_contents("https://www.aakb.dk{$part_url}");

// Return as array http://stackoverflow.com/a/6815562/5241172
$obj = json_decode($json, true);
*/
////////////////////////////////////////////////////////////////////


// The stupid parallel way since we cannot get the proper result when making direct calls 
$arr_faust_urls = array();
foreach($arr_faust as $spec_faust_url){
  array_push($arr_faust_urls, 'https://www.aakb.dk/ding_availability/holdings/' . $spec_faust_url);
}

$obj_temp = parallel_calls($arr_faust_urls);
$obj = combined($obj_temp);

//print_arr($obj_temp);

//print_arr($obj);

foreach($arr_faust as $real_faust){

  // Check if holdings is null 
  if(!is_null($obj[$real_faust]['holdings'])){

    // Count number of array entries (each count is a library)
    $lib_count = count($obj[$real_faust]['holdings']);
    for($i=0;$i<$lib_count;$i++){
      if($obj[$real_faust]['holdings'][$i]['placement'][0] == 'Hovedbiblioteket'){

        // Save this placement
        $placement[$real_faust] = $obj[$real_faust]['holdings'][$i]['placement'];
        if(count($placement[$real_faust]) > 2){

          // If the placement array has a length larger than 2 it probably means it has the full path to the item
          // And thus we do nothing more
        }
        else{

          // Else it means that we could not find the full path to the item and we need to search the html string for a number
          // which we then append
          
          $temp_numb = searchStringForNumber($obj[$real_faust]['html']);

          if($temp_numb == ""){

            // Weird stuff. Append a value that I know will be filtered away later on
            array_push($placement[$real_faust], 'Fjerndepot'); 
          }
          else{
            array_push($placement[$real_faust], $temp_numb);
          }
          
        }

        /*
        If $obj[$key]['reservable'] == false it means that the book is 
        NOT reservable at any lib in Aarhus and thus not available to lend.
        
        This is relevant since the 'available_count' can be > 0 at Dokk1 but 
        in reality it is not available since it is reserved. Therefore we need to make
        a check for that.
        */
        
        if ($obj[$real_faust]['reservable'] == false){
          $availability[$real_faust] = 0;
        }
        else{
          $availability[$real_faust] = $obj[$real_faust]['holdings'][$i]['available_count'];
        }
      }
    }
  }
}

$no_go_list = ["Fjerndepot", "Skolebibliotek", "Bibliotekarbord"];

// Prepare the final json  object to transfer to the client
if (!is_null($placement)){
  foreach ($placement as $key => $value) {
    // Key are the faust numbers which we found at Hovedbiblioteket/Dokk1
    // We check if on the no-go list
    $go_or_no = true;
    foreach ($no_go_list as $no_go_keys){
      if (in_array($no_go_keys, $placement[$key])){
        $go_or_no = false;
      }  
    }

    if ($go_or_no == true){
      $final_json[$key]['author'] = $author[$key];
      $final_json[$key]['thumb'] = $thumb[$key];
      $final_json[$key]['title'] = $title[$key];
      $final_json[$key]['placement'] = $placement[$key];
      $final_json[$key]['avail_num'] = $availability[$key];
    }
  }
}else
{
  $final_json['-1'] = -1; // No matches
}

// Encode to json and return 
echo json_encode($final_json);

//print_arr($final_json);

// https://www.aakb.dk/ding_availability/holdings/51989252,45753476,51979591,51671414,51980204,51980239,51980190,51671457,51975952

?>
