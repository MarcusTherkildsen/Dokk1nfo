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


// Static address, just for testing
$query = 'https://www.aakb.dk/search/ting/snowden';//'https://www.aakb.dk/search/ting/harry%20potter';

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

    // Out starting point for scraping
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
        $title = $temp_title->textContent;
      }
      else
      {
        $title = 'Ukendt';//null; // Insert 'Ukendt' in JS
      }

      // Author (will show only release year if no author available) but that might very well change when/if they ever finish the new system. 
      $author = $first_children->item(2)->nextSibling->textContent;

      // Thumb
      $temp_thumb = $parent_element->childNodes->item(1)->getElementsByTagName('img')->item(0);
      if (!is_null($temp_thumb))
      {
        $thumb = $temp_thumb->getAttribute('src');
      }
      else
      {
        $thumb = 'No thumbnail';//null; // Insert http://www.dokk1nfo.dk/img/no_image.jpg' in JS
      }

      // http://php.net/manual/en/language.operators.string.php
      $part_url.="{$faust},";

      echo $faust;
      echo '<br>';
      echo $thumb;
      echo '<br>';
      echo $author;
      echo '<br>';
      echo $title;
      echo '<br>';
      echo '<br>';

      array_push($arr_faust, $faust);
    }
  }
}

echo $part_url;
echo '<br>';
// Remove trailing comma http://stackoverflow.com/a/5593009/5241172
$part_url = rtrim($part_url, ",");
echo $part_url;

echo '<br>';

/*
foreach($arr_faust as $real_faust){
  echo $real_faust;
  echo '<br>';
}
*/


// Get the json object http://stackoverflow.com/a/15617547/5241172
ini_set("allow_url_fopen", 1);
$json = file_get_contents("https://www.aakb.dk/{$part_url}");
echo "https://www.aakb.dk/{$part_url}";
echo '<br>';
echo $json;
// Return as array http://stackoverflow.com/a/6815562/5241172
$obj = json_decode($json, true);
echo '<br>';
echo '<br>';
echo '<br>';

foreach($arr_faust as $real_faust){
  
  
  // Count number of array entries (each count is a library)
  $lib_count = count($obj[$real_faust]['holdings']);
  for($i=0;$i<$lib_count;$i++){
  
    $placement_count = count($obj[$real_faust]['holdings'][$i]['placement']);

    echo "[";
    for($k=0;$k<$placement_count;$k++){

      echo $obj[$real_faust]['holdings'][$i]['placement'][$k];


      if($k!=($placement_count-1)){
        echo ",";
      }


    }

    echo "]";
  

    echo '<br>';
  }
  /*
  echo $obj[$real_faust]['holdings'][0]['placement'][0];
  echo '<br>';
*/
}

?>
