var bootstrap = "bootstrap.php";
var map;

/*
 * CHARGEMENT DES MODULES NECESSAIRES
 */
var app = angular.module('Barathon', ['ngRoute']);

/*
* REGLES DE ROUTAGE DES PAGES
*/
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
	templateUrl: 'views/home.html' 
    })
    .when('/listeBars', {
	templateUrl: 'views/listeBars.html'
    })
    .when('/carte', {
	templateUrl: 'views/carte.html', 
	controller: 'CarteCtrl'
    })
    .when('/login', {
	templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    })
    .when('/listeBarathons', {
	templateUrl: 'views/listeBarathons.html',
        controller: 'ListeBarathonsCtrl'
    })
    .otherwise({
	redirectTo: '/'
    });
});



/**
  * Contrôleur de la page d'accueil
  */
 
/**
 * Contrôleur de la liste des bars
 */
app.controller('BarsListCtrl', function($scope) {
    
    // Le scope récupère la liste des bars depuis un service
    $scope.bars = [
    {
        "id": 0,
        "nom": "Quility",
        "latitude": -77.969742,
        "longitude": -38.513007
    },
    {
        "id": 1,
        "nom": "Plexia",
        "latitude": -16.959234,
        "longitude": 134.023616
    },
    {
        "id": 2,
        "nom": "Halap",
        "latitude": -25.651032,
        "longitude": 10.235857
    },
    {
        "id": 3,
        "nom": "Musanpoly",
        "latitude": -81.267279,
        "longitude": 10.212763
    },
    {
        "id": 4,
        "nom": "Puria",
        "latitude": 62.473652,
        "longitude": -1.497673
    },
    {
        "id": 5,
        "nom": "Enersave",
        "latitude": 21.109301,
        "longitude": -36.156543
    }
    ];
});

/**
  * Contrôleur de la page de carte
  */
app.controller('CarteCtrl', function($scope) {
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
	externalGraphic: "img/logo_dot.png",
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
 * Contrôleur login
 */
app.controller('LoginCtrl', function() {
    
    $("#submitLogin").click(function(){
        
        var login = $("#inputLogin").val();
        var mdp = $("#inputPassword").val();
        
        //bootstrap.php?controller=Users&action=validerUser&userLogin=admin&mdp=1234
        
        // Validate mdp : Controller_Users->validerUsers();
        
    });
});

app.controller('ListeBarathonsCtrl', function(){
    
    $(".backBtn").click(function(){
        //alert("Back");
    });
    
});