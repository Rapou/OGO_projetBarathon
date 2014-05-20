var bootstrap = "bootstrap.php";
var map;
var loggedUserId;
var geoBar;

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
    
var ctxBarOver = { 
	nombre: function(feature) {
	    if(feature.attributes.count>=2){
		return feature.attributes.count;
	    }else{
		console.log(feature);
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


$(document).ready(function(){
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
});
/*******************************************************************************
 *  CHARGEMENT DES MODULES NECESSAIRES
 ******************************************************************************/
var app = angular.module('Barathon', ['ngRoute']);

/*******************************************************************************
 * REGLES DE ROUTAGE DES PAGES
 ******************************************************************************/
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
	templateUrl: 'views/home.html'
    })
    .when('/listeBars', {
	templateUrl: 'views/listeBars.html',
        controller: 'testNicoCtrl'
    })
    .when('/carte', {
	templateUrl: 'views/carte.html',
	controller: 'CarteCtrl'
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
    .otherwise({
	redirectTo: '/'
    });
});

/*******************************************************************************
 *  SERVICES
 ******************************************************************************/
/*
 * A TESTER - Factory pour gérer un bar dans la base de données
 */
app.factory('Bar', function($http, $q){
    var factory = {
        bars : false,
        // Permet de retourner tous les bars, ou de faire une recherche si un paramètre est renseigné.
        find : function(params){
            //var val = $http.get(bootstrap + "?controller=Bars&action=rendBarEtPub"); // TODO Adresse à modifier pour utiliser le proxy
            var deferred = $q.defer();
            $http.get(bootstrap + "?controller=Bars&action=rendBarEtPub")
                .success(function(data, status){
                    factory.bars = data;
                    deferred.resolve(factory.bars);
                        })
                .error(function(){
                    deferred.reject("msg");
                });
                return deferred.promise;
        },
        // Permet de rendre un bar si on a son ID
        get : function(id){
            var bar = {};
            angular.forEach(factory.bars, function(value, key){
                if(value.id == key){
                    bar = value;
                }
            });
            return bar;
        },
        // Permet d'ajouter un bar
        addBar : function(bar){
            var deferred = $q.defer();
            /* TODO ...*/
            deferred.resolve();
            return deferred.promise;
        }
        
    };
    return factory;
});

/*******************************************************************************
 *  CONTROLEURS
 ******************************************************************************/
/**
 * Contrôleur de la page d'accueil
 */

/**
 * Controleur affichage des bars dans les environs
 */     
app.controller('testNicoCtrl', function($scope, Bar){
    $scope.bars = Bar.find().then(function(bars){
        $scope.bars = bars;
        console.log(bars);
    }, function(msg){
        alert(msg);
    });
    
    geoBars  = new OpenLayers.Layer.Vector("Features", {
	strategies: [
	    new OpenLayers.Strategy.Fixed(),
	    new OpenLayers.Strategy.AnimatedCluster({
		distance: 45,
		animationMethod: OpenLayers.Easing.Expo.easeOut,
		animationDuration: 10
	    })
	],
	styleMap: new OpenLayers.Style(ptsBar, {context: ctxBar}),
	projection: new OpenLayers.Projection("EPSG:4326")
    });
    
    map.addLayer(geoBars);
    features = new OpenLayers.Feature.Vector();
    var feature;
    $.each($scope.bars.features, function(i, elem){
	feature = new OpenLayers.Feature();
	feature.geometry = new OpenLayers.Geometry.Point(elem.geometry.coordinates);
	feature.attributes = {
	    name: elem.properties.name,
	    id: elem.properties.id
	};
	geoBars.addFeatures([feature]);
    });
});


/**
 * Contrôleur de la page de carte
 */

app.controller('CarteCtrl', function($scope) {

    
    $("#barathonCreation").hide();
    
    $("#newBarathonBtn").click(function(){
        $("#barathonCreation").fadeToggle("slow", "linear");
    });
   
   $(".logo").click(function(){
        history.back();
    });

    $scope.bars  = new OpenLayers.Layer.Vector("Features", {
	protocol: new OpenLayers.Protocol.HTTP({
	    url: bootstrap + "?controller=Bars&action=rendBarEtPub",
	    format: new OpenLayers.Format.GeoJSON()
	}),
	strategies: [
	    new OpenLayers.Strategy.Fixed(),
	    new OpenLayers.Strategy.AnimatedCluster({
		distance: 45,
		animationMethod: OpenLayers.Easing.Expo.easeOut,
		animationDuration: 10
	    })
	],
	styleMap: new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style(ptsBar, {context: ctxBar}),
                        "select": new OpenLayers.Style(ptsBarOver, {context: ctxBarOver})
                    }),
	// styleMap: new OpenLayers.Style(ptsBar, {context: ctxBar}),
	projection: new OpenLayers.Projection("EPSG:4326")
    });
    selectControl = new OpenLayers.Control.SelectFeature($scope.bars, {
	hover:true
    });
    
    map.addLayer($scope.bars);
    map.addControl(selectControl);
    selectControl.activate();
        
    
    
}); // controleur carte

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
    
    $(".logo").click(function() {
        history.back();
    });
    
    $("#cancelLogin").click(function() {
        history.back();
    });
});

/**
 * Controleur liste des Barathons
 */
app.controller('BarathonsCtrl', function($scope, $http){
    
    $scope.barathons = [
	{
	    "id": 0,
	    "nom": "SuperStar Barathon"
	}, {
	    "id": 1,
	    "nom": "Mon Barathon"
	}]
    
    /*
    //Récupère la liste des Barathons proposés
    $scope.barathonsProposes = $http({
        method: 'GET',
        url: 'bootstrap.php?controller=Barathons',
        params: "action=rendBarathonsProposes"
        }).success(function(data){
        // With the data succesfully returned, call our callback
        //callbackFunc(data);
        alert("Success !");
        alert("Data : "+data);
    }).error(function(){
        alert("error");
    });
    
    //Récupère la liste des Barathons du user loggé (s'il y a un user loggé)
    if (loggedUserId !== undefined){
        alert("User logged : " + loggedUserId);
        
        $scope.mesBarathons = $http({
            method: 'GET',
            url: 'bootstrap.php?controller=Barathons',
            params: "action=rendMesBarathons&userId="+loggedUserId
         }).success(function(data){
            // With the data succesfully returned, call our callback
            //callbackFunc(data);
            alert("Success ! : action=rend&userId="+loggedUserId);
        }).error(function(){
            alert("error");
        });
        
    }
     */
    
    
    $(".logo").click(function(){
        history.back();
    });
});

/**
 * Controleur affichage 1 Barathon
 */     
app.controller('BarathonCtrl', function($scope, $http, $routeParams){
    
    idBarathon = $routeParams['id'];
    
    // Appel ajax pour récupérer le barathon
    //$scope.barathon = rendBarathonParId();
    
    $scope.barathon = {
	"id": idBarathon,
	"nom": "SuperStar Barathon"
    };
    
    // Récup la liste des Bars de ce Barathon
    // Appel Ajax :
    //$scope.listeBars = listeBars.rendListeBarsPourBarathon;
    
    $scope.listeBars = [
        {
            "nom" : "Great Escape"
        },
        {
            "nom" : "Lapin vert"
        },
    ];
    
    
    // L'affichage barathon.html recherche l'info ici pour affichage d'un unique Barathon



    $(".logo").click(function() {
        history.back();
    });
});
