<?php
	// ## Log the last Request for debug purposes #############################
	$summary  =   "POST\n"   . print_r($_POST, true);
	$summary .= "\nGET\n"    . print_r($_GET, true);
	$summary .= "\nSERVER\n" . print_r($_SERVER, true);
	
	file_put_contents('lister.log', $summary);
	
	
	// ## Create an dummy response and post it as JSON ########################
	// Concatinate the already selected answers
	$fields = array(
		'subject',
		'degree',
		'lecture',
		'type',
		'subtype',
		'prof',
		'jear'
	);
	
	$base = "";
	
	foreach($fields as $field) {
		if(isset($_POST[$field])) {
			$base .= $_POST[$field];
		}
	}
	
	
	// Create a list of possible answers for the next field in question
	$letters = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j');
	
	$result = array();
	
	foreach($letters as $letter) {
		$result[] = array(
			'k' => $letter,
			'v' => $base.strtoupper($letter)
		);
	}
	
	
	// Simulate a slow internet connection and return the dummy result
	//sleep(2);
	echo json_encode($result);