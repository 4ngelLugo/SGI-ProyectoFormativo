<?php
class CargaMasiva{
    public $file;

	public function __construct($file){
		$this->file = $file;
        $this->formatToJSON();
	}

    public function formatToJSON(){
        $json = [];
        $lines = file($this->file);
        foreach ($lines as $line) {
            $json[] = json_decode($line, true);
        }
        return $json;
    }
}
?>