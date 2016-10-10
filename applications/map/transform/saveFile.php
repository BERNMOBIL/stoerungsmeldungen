<?php
    $dataFile = fopen('applications/map/data/data.json', 'w'); //open data.json (file where final data will go) write-only, create if doesn't exist
    $data = $_POST['data']; //retrieve transformed data from POST

    fwrite($dataFile, $data); //write transformed $data to loaded $dataFile
    fclose($dataFile); //close file connection
?>
