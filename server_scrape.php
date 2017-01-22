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

// Function for basic field validation (present and neither empty nor only white space
function IsNullOrEmptyString($question){
    return (!isset($question) || trim($question)==='');
}

// Temporary "solution" until Dokk1 solves the real problem
function searchStringForNumber($in_string){
  // Find numbers in the string http://www.regexr.com/ http://www.phpliveregex.com/ in the form of " number"
  preg_match_all("/ (?:\d*\.)?\d+/", $in_string, $myArray);

  // Get last entry (the one with most occurences) and strip spaces
  /*
  print_r($myString);
  echo '<br>';
  print_r($myArray); 
  */
  return str_replace(' ', '', end(end($myArray)));
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

if (IsNullOrEmptyString($_POST['search_string'])){
  // Send to 404 page  
  header("Location: http://dokk1nfo.dk/404");
  die();
}
else
{
  // The query string containing the properly formatted (from JS) search_string
  $query = 'https://www.aakb.dk/search/ting/' . $_POST['search_string'] . '?size=40';
}

$dom = new DOMDocument('1.0');
$classname = "search-result--heading-type";
@$dom->loadHTMLFile($query); // Returns true for success and false otherwise. Should make a check.
$nodes = array();
$nodes = $dom->getElementsByTagName("span");
$arr_faust = array();

$part_url = "/ding_availability/holdings/";

foreach ($nodes as $element)
{

   $classy = $element->getAttribute("class");
   if ($classy == $classname)
   {

    // Our starting point for scraping
    $parent_element = $element->parentNode->parentNode->parentNode;
    $first_children = $parent_element->childNodes->item(2)->childNodes;

    // Here we should make a check for "870970-basis" (12chars) og "775100-katalog" (14chars) which are the only two cases where the item "might" be available at the library.
    // As a start, I will simply check for 870970 and 775100
    $in_faust = substr($first_children->item(1)->childNodes->item(1)->childNodes->item(0)->getAttribute('href'), 17, 6);
    if ($in_faust == 870970 || $in_faust == 775100)
    {

      // Faust
      $faust = substr($first_children->item(1)->childNodes->item(1)->childNodes->item(0)->getAttribute('href'), -8);

      // Note: use DOMinnerHTML($element) if you want hyperlink
      // use ->textContent if you simply want the text.

      // Title
      $temp_title = $first_children->item(1)->childNodes->item(1)->childNodes->item(0);
      if (!is_null($temp_title))
      {
        $title[$faust] = $temp_title->textContent;
      }
      else
      {
        $title[$faust] = 'Ukendt';
        //$title[$faust] = null; // Insert 'Ukendt' in JS
      }

      // Author (will show only release year if no author available) but that might very well change when/if they ever finish the new system. 
      $author[$faust] = $first_children->item(2)->nextSibling->textContent;

      // Thumb
      $temp_thumb = $parent_element->childNodes->item(1)->getElementsByTagName('img')->item(0);
      if (!is_null($temp_thumb))
      {
        $thumb[$faust] = $temp_thumb->getAttribute('src');
      }
      else
      {
        $thumb[$faust] = 'http://www.dokk1nfo.dk/img/no_image.jpg';
        //$thumb[$faust] = null; // Insert http://www.dokk1nfo.dk/img/no_image.jpg' in JS
      }

      // http://php.net/manual/en/language.operators.string.php
      $part_url.="{$faust},";

      array_push($arr_faust, $faust);
    }
  }
}

// Remove trailing comma http://stackoverflow.com/a/5593009/5241172
$part_url = rtrim($part_url, ",");

// Get the json object http://stackoverflow.com/a/15617547/5241172
ini_set("allow_url_fopen", 1);
$json = file_get_contents("https://www.aakb.dk{$part_url}");

// Return as array http://stackoverflow.com/a/6815562/5241172
$obj = json_decode($json, true);

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
          array_push($placement[$real_faust], searchStringForNumber($obj[$real_faust]['html']));
        }

        /*
        If $obj[$key]['reservable'] == false it means that the book is 
        NOT reservable at any lib in Aarhus and thus not available to lend.
        
        This is relevant since the 'available_count' can be > 0 at Dokk1 but 
        in reality it is not available since it is reserved. Therefore we need to make
        a check for that.
        */
        if ($obj[$key]['reservable'] == false){
          $availability[$real_faust] = 0;
        }
        else{
          $availability[$real_faust] = $obj[$key]['holdings'][i]['available_count'];
        }
      }
    }
  }
}

$no_go_list = ["Fjerndepot", "Skolebibliotek", "Bibliotekarbord"];

// Prepare the final json  object to transfer to the client
if (1==1){//defined($placement)){
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

// https://www.aakb.dk/ding_availability/holdings/51989252,45753476,51979591,51671414,51980204,51980239,51980190,51671457,51975952

?>
