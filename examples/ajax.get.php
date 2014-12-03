<?php    

	header("Content-Type: text/html; charset=UTF-8"); 
	
	error_reporting ( E_ALL  ^  E_NOTICE );

	if(isset($_GET['timeout'])) {
		sleep(5);
		print_r($_GET); 
	} else {
		print_r($_GET); 
	}
?>