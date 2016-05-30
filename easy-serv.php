<?php
$answerJson = file_get_contents('php://input');
$answer = json_decode($answerJson, true);

if (isset($_GET['email']) && isset($_GET['password']) && $_GET['email']!="undefined" && $_GET['password']!="undefined") {
	
	$file = 'data/users.json';
    $users = file_get_contents($file);

    $users = substr($users, 5, -2);

    $users_arr = explode("},{", $users);
    
    foreach ($users_arr as $value) {
    	if( strripos($value, '"email":"'.$_GET['email'].'"') !==false && strripos($value, '"password":"'.$_GET['password'].'"') !==false){
			
			echo $value; die();
    	}
    }
    echo ""; die();
}

if(isset($answer['title']) && isset($answer['mess']) && !isset($answer['messId'])) {
	$file = 'data/messages.json';
    $messages = file_get_contents($file);
    $sms = ','.$answerJson.']';
    $messages = substr($messages, 0, -1).$sms;    
    file_put_contents($file, $messages);
    echo $messages; die();
 
} else if(isset($answer['messId'])) {  
    $file = 'data/answers.json';
    $answers = file_get_contents($file);
    $sms = ','.$answerJson.']';
    $answers = substr($answers, 0, -1).$sms;    
    file_put_contents($file, $answers);
    echo $answers; die();
}



/*long polling*/
if (isset($_GET['polling'])) {
    
if ($_GET['polling'] == 'messages') {

    $messages_file   = 'data/messages.json';
    $lastmodif = isset($_GET['timestamp']) ? $_GET['timestamp'] : 0;
    $currentmodif  = filemtime($messages_file);
    while ($currentmodif <= $lastmodif)
    {
        usleep(10000);
        clearstatcache();
        
        $currentmodif =  filemtime($messages_file);
    } 
    $data = file_get_contents($messages_file);
    $aa = array($data, $currentmodif);
    echo $aa[0]; 
    echo $aa[1]; die();
   
   
}else if ($_GET['polling'] == 'answers'){

    $answers_file = 'data/answers.json';
    $lastmodif = isset($_GET['timestamp']) ? $_GET['timestamp'] : 0;
    $currentmodif   = filemtime($answers_file);
    
    while ($currentmodif <= $lastmodif)
    {
        usleep(10000);
        clearstatcache();
        
        $currentmodif =  filemtime($answers_file);
        
    } 

    $data = file_get_contents($answers_file);
    $aa = array($data, $currentmodif);
    echo $aa[0]; 
    echo $aa[1]; die();

    }
}


?>