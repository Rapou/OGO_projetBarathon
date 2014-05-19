var bootstrap = "bootstrap.php";
var map;
var loggedUserId;

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
    .when('/barathons', {
	templateUrl: 'views/barathons.html',
        controller: 'BarathonsCtrl'
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
	graphicOpacity: 1
    });

    $scope.bars = new OpenLayers.Layer.Vector("Vector layer from GeoJSON", {
	protocol: new OpenLayers.Protocol.HTTP({
	    url: bootstrap + "?controller=Bars&action=rendBarEtPub",
	    format: new OpenLayers.Format.GeoJSON({
		ignoreExtraDims: true
	    })
	}),
	styleMap: new OpenLayers.Style(ptSymbolizer),
	strategies: [new OpenLayers.Strategy.Fixed()],
	projection: new OpenLayers.Projection("EPSG:4326")
    });
    map.addLayer($scope.bars);
    
    
    function onPopupClose(evt) {
	// 'this' is the popup.
	selectControl.unselect(this.feature);
    }
        
    function onFeatureSelect(evt) {
	feature = evt.feature;
	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
	    feature.geometry.getBounds().getCenterLonLat(),
	    new OpenLayers.Size(100,100),
	    "<h2>" + feature.attributes.name + "</h2>",
	    null,
	    true,
	    onPopupClose
	    );
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup);
    }
              
    function onFeatureUnselect(evt) {
	feature = evt.feature;
	if (feature.popup) {
	    popup.feature = null;
	    map.removePopup(feature.popup);
	    feature.popup.destroy();
	    feature.popup = null;
	}
    }
    
    var defaultPoint = new OpenLayers.Symbolizer.Point({
	graphicName: 'square',
	pointRadius: 6,
	fillColor: '#ffff00',
	fillOpacity: 0,
	stroke: 0
    });
    var selectPoint = defaultPoint.clone();                       
    selectPoint.fillOpacity = 0.8;


    bars_overs = new OpenLayers.Layer.Vector("Vector for over", {
	protocol: new OpenLayers.Protocol.HTTP({
	    url: bootstrap + "?controller=Bars&action=rendBarEtPub",
	    format: new OpenLayers.Format.GeoJSON({
		ignoreExtraDims: true
	    })
	}),
	styleMap: new OpenLayers.StyleMap({
	    "default": new OpenLayers.Style(defaultPoint),
	    "select": new OpenLayers.Style(selectPoint)
	}),
	strategies: [new OpenLayers.Strategy.Fixed()],
	projection: new OpenLayers.Projection("EPSG:4326")
    });
    map.addLayer(bars_overs);
    
    selectControl = new OpenLayers.Control.SelectFeature(bars_overs, {
	hover:true
    });
    map.addControl(selectControl);
    selectControl.activate();
    
    bars_overs.events.register("featureselected", bars_overs, onFeatureSelect);
    bars_overs.events.register("featureunselected", bars_overs, onFeatureUnselect);
    
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

app.controller('BarathonsCtrl', function($scope, $http){
    
    
    
    $scope.mesBarathons = $http({
        method: 'GET',
        url: 'bootstrap.php?controller=Barathons',
        params: "action=rend&userId="+loggedUserId
     }).success(function(data){
        // With the data succesfully returned, call our callback
        //callbackFunc(data);
        alert("Success ! : action=rend&userId="+loggedUserId);
    }).error(function(){
        alert("error");
    });
    
    
    
    
            
            
    
    //map.addLayer($scope.bars);        
            
    
    
    $(".backBtn").click(function(){
        alert("Back");
    });
    
});
