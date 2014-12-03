<?php    

	header("Content-Type: text/html; charset=UTF-8"); 
	
	error_reporting ( E_ALL  ^  E_NOTICE ); 

	$array = array("name" => "pandao", work => "Web Designer & Web Developer");

	$array = array_merge($array, $_GET);

	if(isset($_GET['callbackName'])) {
		echo $_GET['callbackName'].'('.json_encode($array).')';  
	} else {
		echo json_encode($array);  
	}
?>