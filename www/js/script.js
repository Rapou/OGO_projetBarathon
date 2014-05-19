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
 * Controlleur login
 */
app.controller('LoginCtrl', function() {
    $("#submitLogin").click(function(){
        
	var login = $("#inputLogin").val();
	var mdp = $("#inputPassword").val();
        
        
        
    });
});

