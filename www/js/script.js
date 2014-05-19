var bootstrap = "bootstrap.php";
var map;
var app = angular.module('Barathon', ['ngRoute']);

/*
* REGLES DE ROUTAGE DES PAGES
*/
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
	templateUrl: 'views/home.html' 
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
    .when('/nouvel-utilisateur', {
	templateUrl: 'views/user-nouveau.html'
    })
    .otherwise({
	redirectTo: '/'
    });
});



/**
  * Controlleur de la page d'accueil
  */

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
	sphericalMercator: true,
	maxZoomLevel:20
    }
    );

    map.addLayer(goog);
    map.setCenter(new OpenLayers.LonLat(6.645, 46.53).transform("EPSG:4326", "EPSG:900913"), 14);
    
    ptSymbolizer = new OpenLayers.Symbolizer.Point({
	externalGraphic: "../img/logo_dot.png",
	graphicWidth: 40,
	graphicHeight: 50,
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
}); // controlleur carte

/**
 * Controlleur login
 */
app.controller('LoginCtrl', function() {
    $("#submitLogin").click(function(){
        
        var login = $("#inputLogin").val();
        var mdp = $("#inputPassword").val();
        
        
        
    });
});

