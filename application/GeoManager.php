<?php

class Feature
{
	public $type;
	public $geometry;
	public $id;
	public $properties;
	
	function Feature($id,$geom,$properties) {
		$this->type = "Feature";
		$this->geometry = $geom;
		$this->id = $id;
		$this->properties = $properties;
	}
}

class FeatureCollection
{
	public $type;
	public $features;
	
	function FeatureCollection()
	{
		$this->type = "FeatureCollection";
		$this->features = array();
	}
	
	function addFeature($feature) {
		array_push($this->features,$feature);
	} 
}
?>