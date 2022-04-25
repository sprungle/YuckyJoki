<?php
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
          
        function get_data() {
            $datae = array();
            $datae[] = array(
                'seatsC' => $_POST['seatsC'],
                'seatsP' => $_POST['seatsP'],
                'currencyField' => $_POST['ccurrency-field'],
            );
            return json_encode($datae);
        }
          
        $name = "posteddata";
        $file_name = $name . '.json';
       
        if(file_put_contents(
            "$file_name", get_data())) {
                echo $file_name .' file created';
            }
        else {
            echo 'There is some error';
        }
    }
?>