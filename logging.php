<?php
function append_to_file($path, $text)
{
	$handle = fopen($path, "a");
	fwrite($handle, $text);
	fclose($handle);
}

// Function for basic field validation (present and neither empty nor only white space
function IsNullOrEmptyString($question){
    return (!isset($question) || trim($question)==='');
}

if (IsNullOrEmptyString($_POST['search_or_click'])){
	// Send to 404 page
	header("Location: http://dokk1nfo.dk/404");
	die();
}
else
{
	$time = date("m-d H:i:s");
	$address = $_SERVER['REMOTE_ADDR'];
	$year = date("Y");

	if ($_POST['search_or_click'] == "C"){
		append_to_file("logs/$year.log", $time . ", " . $address . ", " . $_POST['search_or_click'] . ", [" . $_POST['search_string'] . "], " . $_POST['avail_number'] . ", " . $_POST['floor'] . "\n");
	}	
	elseif ($_POST['search_or_click'] == "S") {
		append_to_file("logs/$year.log", $time . ", " . $address . ", " . $_POST['search_or_click'] . ", [" . $_POST['search_string'] . "]\n");
	}
	elseif ($_POST['search_or_click'] == "E") {
		append_to_file("logs/$year.log", $time . ", " . $address . ", " . $_POST['search_or_click'] . "\n");
	}
}
?>