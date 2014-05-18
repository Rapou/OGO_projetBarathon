var bootstrap = "bootstrap.php";
var app = angular.module('MonApp', ['ngRoute']);
var map;
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
	templateUrl: 'views/home.html', 
	controller: 'HomeCtrl'
    })
    .when('/bars', {
	templateUrl: 'views/bars.html'
    })
    .otherwise({
	redirectTo: '/'
    });
});

app.controller('HomeCtrl', function() {
    map = new OpenLayers.Map('map', {
	projection: new OpenLayers.Projection("EPSG:900913"),
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

    $(window).resize(function() {
	var nouvelleHauteur = $(window).height() - 40;
	$("#map").css("height", nouvelleHauteur + "px");
    });
	
	vectorLyr = new OpenLayers.Layer.Vector("Vector layer from GeoJSON", {
	    protocol: new OpenLayers.Protocol.HTTP({
		url: "bootstrap.php?controller=Bars&action=rends",
		format: new OpenLayers.Format.GeoJSON({
		    ignoreExtraDims: true
		})
	    }),
	    strategies: [new OpenLayers.Strategy.Fixed()],
	    projection: new OpenLayers.Projection("EPSG:4326")
	});
	console.log(vectorLyr);
	map.addLayer(vectorLyr);
});
