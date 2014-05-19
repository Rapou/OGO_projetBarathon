var bootstrap = "bootstrap.php";
var map;
var app = angular.module('Barathon', ['ngRoute']);

/*
     * REGLES DE ROUTAGE DES PAGES
     */

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
	templateUrl: 'views/home.html', 
	controller: 'HomeCtrl'
    })
    .when('/bars', {
	templateUrl: 'views/bars.html'
    })
    .when('/carte', {
	templateUrl: 'views/carte.html', 
	controller: 'CarteCtrl'
    })
    .when('/login', {
	templateUrl: 'views/login.html'
    })
    .otherwise({
	redirectTo: '/'
    });
});



/**
  * Controlleur de la page d'accueil
  */
app.controller('HomeCtrl', function() {
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

   /* var hauteur = $(document).height() - 40;
    $("#map").css("height", hauteur + "px");*/
    map.addLayer(goog);
    map.setCenter(new OpenLayers.LonLat(8, 47).transform("EPSG:4326", "EPSG:900913"), 6);

/*
    $(window).resize(function() {
	var nouvelleHauteur = $(window).height() - 40;
	$("#map").css("height", nouvelleHauteur + "px");
    });
*/
    
/*
    vectorLyr = new OpenLayers.Layer.Vector("Vector layer from GeoJSON", {
	protocol: new OpenLayers.Protocol.HTTP({
	    url: bootstrap + "?controller=Bars&action=rends",
	    format: new OpenLayers.Format.GeoJSON({
		ignoreExtraDims: true
	    })
	}),
	strategies: [new OpenLayers.Strategy.Fixed()],
	projection: new OpenLayers.Projection("EPSG:4326")
    });
    console.log(vectorLyr);
    map.addLayer(vectorLyr);*/
});

/**
  * Controlleur de la page de carte
  */
app.controller('CarteCtrl', function() {
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

   /* 
    var hauteur = $(document).height() - 75;
    $("#map").css("height", hauteur + "px");
    */
    map.addLayer(goog);
    map.setCenter(new OpenLayers.LonLat(6.645, 46.53).transform("EPSG:4326", "EPSG:900913"), 14);

/*
    $(window).resize(function() {
	var nouvelleHauteur = $(window).height() - 75;
	$("#map").css("height", nouvelleHauteur + "px");
    });*/
    
    ptSymbolizer = new OpenLayers.Symbolizer.Point({
	externalGraphic: "../img/biereLogo.png",
	graphicWidth: 25,
	graphicHeight: 25,
	graphicOpacity: 1,
	label: "${name}",
	labelYOffset: -30,
	fontColor: "black",
	fontSize: "20px"
    });

    
    vectorLyr = new OpenLayers.Layer.Vector("Vector layer from GeoJSON", {
	protocol: new OpenLayers.Protocol.HTTP({
	    url: bootstrap + "?controller=Bars&action=rendsPub",
	    format: new OpenLayers.Format.GeoJSON({
		ignoreExtraDims: true
	    })
	}),
	styleMap: new OpenLayers.Style(ptSymbolizer),
	strategies: [new OpenLayers.Strategy.Fixed()],
	projection: new OpenLayers.Projection("EPSG:4326")
    });
    map.addLayer(vectorLyr);
});
