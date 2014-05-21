var bootstrap = "bootstrap.php";
var map;
var geoBars = "UNDEFINED";
var listeBarsAValider = "UNDEFINED";

var loggedUserId = -1; // Par défaut, le user n'est pas loggé (= -1)

/**
 * Représentation d'un Bar
 * @type OpenLayers.Symbolizer.Point
 */
var ptsBar = new OpenLayers.Symbolizer.Point({
    externalGraphic: "${myImage}",
    graphicWidth: "${myWidth}",
    graphicHeight: 50,
    graphicOpacity: 1,
    label:"${nombre}",
    fontColor: "#2980B9",
    fontSize: "14pt",
    fontWeight: "bold",
    labelOutlineColor: "#FFFFFF",
    labelOutlineWidth: 4,
    labelOutlineOpacity: 0.6,
    labelSelect:true
});

/**
 * Fonction qui définit les paramètres selon le contexte
 * @type type
 */
var ctxBar = { 
    nombre: function(feature) {
	if(feature.attributes.count>=2){
	    return feature.attributes.count;
	}else{
	    return "";
	}
    },
    myImage: function(feature) {
	if(feature.attributes.count>=2){
	    return "img/logo_multi2.png";
	}else{
	    return "img/logo_dot.png";
	}
    },
    myWidth: function(feature) {
	if(feature.attributes.count>=2){
	    return 50;
	}else{
	    return 40;
	}
    }
};
    
/**
 * Fonction qui définit les paramètres selon le contexte en mode :hover
 * @type type
 */
var ctxBarOver = { 
    nombre: function(feature) {
	if(feature.attributes.count>=2){
	    return feature.attributes.count;
	}else{
	    return feature.cluster[0].attributes.name;
	}
    },
    myImage: function(feature) {
	if(feature.attributes.count>=2){
	    return "img/logo_multi_over.png";
	}else{
	    return "img/logo_dot_over.png";
	}
    },
    myWidth: function(feature) {
	if(feature.attributes.count>=2){
	    return 50;
	}else{
	    return 40;
	}
    }
};

/**
 * Représentation d'un Bar:hover
 * @type OpenLayers.Symbolizer.Point
 */
var ptsBarOver = new OpenLayers.Symbolizer.Point({
    externalGraphic: "${myImage}",
    graphicWidth: "${myWidth}",
    graphicHeight: 50,
    graphicOpacity: 1,
    label:"${nombre}",
    fontColor: "#e67e22",
    fontSize: "14pt",
    fontWeight: "bold",
    labelOutlineColor: "#FFFFFF",
    labelOutlineWidth: 4,
    labelOutlineOpacity: 0.6,
    labelSelect:true,
    labelPosition:30
});
/**
 * Représentation d'un Bar de ListeBarathon
 * @type OpenLayers.Symbolizer.Point
 */
var ptsBarValider = new OpenLayers.Symbolizer.Point({
    externalGraphic: "img/icon_bar_valider.png",
    graphicWidth: 40,
    graphicHeight: 50,
    graphicOpacity: 1,
    label:"",
    fontColor: "#e67e22",
    fontSize: "14pt",
    fontWeight: "bold",
    labelOutlineColor: "#FFFFFF",
    labelOutlineWidth: 4,
    labelOutlineOpacity: 0.6,
    labelSelect:true,
    labelPosition:30
});

/**
 *                       ---- DOC READY
 * @param {type} param
*/
$(document).ready(function(){
    // crée la map OpenLayers tirée de Google
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
	
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addLayer(goog);
    map.setCenter(new OpenLayers.LonLat(6.645, 46.53).transform("EPSG:4326", "EPSG:900913"), 14); 
    
}); // DOC READY

/*******************************************************************************
 *  CHARGEMENT DES MODULES ANGULAR NECESSAIRES
 ******************************************************************************/
var app = angular.module('Barathon', ['ngRoute']);

/*******************************************************************************
 * REGLES DE ROUTAGE DES PAGES   - Angular
 ******************************************************************************/
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
	templateUrl: 'views/home.html',
        controller: 'homeCtrl'
    })
    .when('/listeBars', {
	templateUrl: 'views/listeBars.html',
	controller: 'testNicoCtrl'
    })
    .when('/carte', {
	templateUrl: 'views/carte.html',
	controller: 'CarteCtrl'
    })
    .when('/creationBarathon', {
	templateUrl: 'views/creationBarathon.html',
	controller: 'CreationBarathonCtrl'
    })
    .when('/validerBarathon', {
	templateUrl: 'views/validerBarathon.html',
	controller: 'ValiderBarathonCtrl'
    })
    .when('/login', {
	templateUrl: 'views/login.html',
	controller: 'LoginCtrl'
    })
    .when('/barathons', {
	templateUrl: 'views/barathons.html',
	controller: 'BarathonsCtrl'
    })
    .when('/barathons/:id', {
	templateUrl: 'views/barathon.html',
	controller: 'BarathonCtrl'
    })
    .when('/partieEnCours', {
	templateUrl: 'views/partieEnCours.html',
	controller: 'partieEnCoursCtrl'
    })
    .otherwise({
	redirectTo: '/'
    });
});