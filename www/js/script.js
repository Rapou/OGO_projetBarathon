var bootstrap = "bootstrap.php";
var idEtat = 0;
var idEtape = 0;

$(document).ready(function(){
	map = new OpenLayers.Map('map', {
            projection: new OpenLayers.Projection("EPSG:3857"),
            maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508)
        });
        goog = new OpenLayers.Layer.Google("Google layer",
	    {
		type: google.maps.MapTypeId.ROADMAP,
		sphericalMercator: true
	    }
        );
	var hauteur = $(document).height() - 40;
	$("#map").css("height", hauteur + "px");
        map.addLayer(goog);
        map.setCenter(new OpenLayers.LonLat(8, 47).transform("EPSG:4326", "EPSG:900913"), 6);
	
	$(window).resize(function(){
	    var nouvelleHauteur = $(window).height() - 40;
	    $("#map").css("height", nouvelleHauteur + "px");
	});
});


