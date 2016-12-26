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
$query = 'https://www.aakb.dk/search/ting/harry%20potter';

$dom = new DOMDocument('1.0');
$classname = "search-result--heading-type";
@$dom->loadHTMLFile($query);
$nodes = array();
$nodes = $dom->getElementsByTagName("span");

foreach ($nodes as $element)
{
   $classy = $element->getAttribute("class");
   if ($classy == $classname)
   {

    $parent_element = $element->parentNode->parentNode->parentNode;

    // Here we should make a check for "870970-basis" (12chars) og "775100-katalog" (14chars) which are the only two cases where the item "might" be available at the library.
    // As a start, I will simply check for 870970 and 775100
    $in_faust = substr($parent_element->childNodes->item(2)->childNodes->item(1)->childNodes->item(1)->childNodes->item(0)->getAttribute('href'), 17, 6);
    if ($in_faust == 870970 || $in_faust == 775100)
    {

      // Faust
      $faust = substr($parent_element->childNodes->item(2)->childNodes->item(1)->childNodes->item(1)->childNodes->item(0)->getAttribute('href'), -8);

      // Title
      $title = $parent_element->childNodes->item(2)->childNodes->item(1)->childNodes->item(1)->childNodes->item(0)->textContent;

      // Author
      $author = DOMinnerHTML($parent_element->childNodes->item(2)->childNodes->item(2)->nextSibling);

      // Thumb
      $temp_thumb = $parent_element->childNodes->item(1)->getElementsByTagName('img')->item(0);
      if (!is_null($temp_thumb))
      {
        $thumb = $temp_thumb->getAttribute('src');
      }
      else
      {
        $thumb = 'No thumbnail';
      }

      echo $in_faust;
      echo '<br>';
      echo $faust;
      echo '<br>';
      echo $thumb;
      echo '<br>';
      echo $author;
      echo '<br>';
      echo $title;
      echo '<br>';
      echo '<br>';
    }
  }
}

?>