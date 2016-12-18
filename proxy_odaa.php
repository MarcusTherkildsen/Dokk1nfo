<?php

// Function for basic field validation (present and neither empty nor only white space
function IsNullOrEmptyString($question){
    return (!isset($question) || trim($question)==='');
}

if (IsNullOrEmptyString($_POST['resource_id'])){
	// Send to 404 page
	header("Location: http://dokk1nfo.dk/404");
	die();
}
else
{
	$url = 'http://www.odaa.dk/api/3/action/datastore_search?resource_id=' . $_POST['resource_id'];
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec ($ch);
	curl_close ($ch);
	echo $result;
}
?>