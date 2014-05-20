var bootstrap = "bootstrap.php";
var map;
var loggedUserId;
var geoBar;

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
 * Fonction qui définit les paramètres selon le contexte en mode :hover
 * @type type
 */
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
    .otherwise({
	redirectTo: '/'
    });
});

/*******************************************************************************
 *                          SERVICES ANGULAR
 *
 *  FACTORIES
 *  Gère les requêtes Ajax. A la fonction de Modèle du MVC.
 ******************************************************************************/


/*
 * Factory pour les Bars
 */
app.factory('Bar', function($http, $q){
    var factory = {
        bars : false,
        // Permet de retourner tous les bars, ou de faire une recherche si un paramètre est renseigné.
        // TODO : si nécessaire, traitement en fonction des params.
        find : function(barathonId){
            var deferred = $q.defer();
            
            // Quand on veut récupérer tous les barathons
            if(barathonId === undefined){
                // requête Ajax
                $http.get(bootstrap + "?controller=Bars&action=rendBarEtPub")
                    .success(function(data, status){
                        factory.bars = data;
                        deferred.resolve(factory.bars);
                    })
                    .error(function(){
                        deferred.reject("factory.bars : Erreur lors de la récupéaration de tous les bars");
                    });
                    return deferred.promise;
            // Quand on veut les bars visités par un barathon
            }else{
                // requête Ajax
                $http.get(bootstrap + "?controller=listeBars&action=rendListeBarsPourBarathon&barathonId="+barathonId)
                    .success(function(data, status){
                        factory.bars = data;
                        deferred.resolve(factory.bars);
                    })
                    .error(function(){
                        deferred.reject("factory.bars : Erreur lors de la récupération des bars du barathon "+barathonId);
                    });
                    return deferred.promise;
            }
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
}); // factory Bar


/*
 * Factory pour les Barathons
 */
app.factory('Barathon', function($http, $q, ListeBars){
    var factory = {
        barathons : false,
        
        // Permet de retourner tous les bars, ou de faire une recherche si un paramètre est renseigné.
        find : function(params){
            //var val = $http.get(bootstrap + "?controller=Bars&action=rendBarEtPub"); 
            var deferred = $q.defer();
            $http.get(bootstrap + "?controller=Barathons&action=rend")
                .success(function(data, status){
                    factory.barathons = data;
                    deferred.resolve(factory.barathons);
                        })
                .error(function(){
                    deferred.reject("msg");
                });
                return deferred.promise;
        },
        // Permet de rendre un bar si on a son ID
        get : function(id){
            
            var deferred = $q.defer();
            
            $http.get(bootstrap + "?controller=Barathons&action=rendBarathonsProposes")
                .success(function(data, status){
                    
                    var listeBars = {};
                    angular.forEach(factory.listeBars, function(value, key){
                        if(value.id == key){
                            barathon = value;
                        }
                    });
                    
                    factory.listeBars = data;
                    deferred.resolve(factory.listeBars);
                })
                .error(function(){
                    deferred.reject("msg");
                });
                
                return deferred.promise;
        },
        rendBarathonsProposes : function(){
            var deferred = $q.defer();
            
            $http.get(bootstrap + "?controller=Barathons&action=rendBarathonsProposes")
                .success(function(data, status){
                    //angular.forEach() // TODOOOOOOOOOOOOOO !!!!!!!!!!!!!!!!!
                    
                    factory.barathons = data;
                    deferred.resolve(factory.barathons);
                        })
                .error(function(){
                    deferred.reject("msg");
                });
            
            
            return deferred.promise;
        },
        
        /*rendBarathonParId : function(idBarathon){
            var deferred = $q.defer();
            /* TODO ...*/
            /*deferred.resolve();
            return deferred.promise;
        },*/
        
        // Permet d'ajouter un bar
        addBar : function(bar){
            var deferred = $q.defer();
            /* TODO ...*/
            deferred.resolve();
            return deferred.promise;
        }
        
    };
    return factory;
}); // factory Bar

/*
 * Factory pour la liste des bars d'un barathon
 */
app.factory('ListeBars', function($http, $q){
    var factory = {
        listeBars : false,
        
        // Permet de retourner tous les bars, ou de faire une recherche si un paramètre est renseigné.
        find : function(params){
            //var val = $http.get(bootstrap + "?controller=Bars&action=rendBarEtPub"); 
            var deferred = $q.defer();
            $http.get(bootstrap + "?controller=Barathons&action=rend")
                .success(function(data, status){
                    factory.listeBars = data;
                    deferred.resolve(factory.listeBars);
                        })
                .error(function(){
                    deferred.reject("msg");
                });
                return deferred.promise;
        },
        // Permet de rendre un bar si on a son ID
        get : function(id){
            listeBars = {};
            angular.forEach(factory.listeBars, function(value, key){
                if(value.id == key){
                    listebars = value;
                }
            });
            return listebars;
        },
       
        // Permet d'ajouter un bar
        /*addBar : function(bar){
            var deferred = $q.defer();
            /* TODO ...*/
            /*deferred.resolve();
            return deferred.promise;
        }*/
        
    };
    return factory;
}); // factory ListeBars



/*******************************************************************************
 *  CONTROLEURS
 ******************************************************************************/
/**
 * Contrôleur de la page d'accueil
 */

/**
 * Controleur de test
 */     
app.controller('testNicoCtrl', function($scope, Bar){
    $scope.bars = Bar.find().then(function(bars){
        $scope.bars = bars;
        console.log($scope.bars);
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
    
    /*map.addLayer(geoBars);
    features = new OpenLayers.Feature.Vector();
    var feature;
    $.each($scope.bars.features, function(i, elem){
        console.log(elem.properties.name);
	feature = new OpenLayers.Feature();
	feature.geometry = new OpenLayers.Geometry.Point(elem.geometry.coordinates);
	feature.attributes = {
	    name: elem.properties.name,
	    id: elem.properties.id
	};
	geoBars.addFeatures([feature]);
    });*/
});


/**
 * Contrôleur de la page de carte
 */
app.controller('CarteCtrl', function($scope) {

   // logo back
   $(".logo").click(function(){
        history.back();
    });

    // set les bars dans le scope
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
	projection: new OpenLayers.Projection("EPSG:4326")
    });
    map.addLayer($scope.bars);

    selectControl = new OpenLayers.Control.SelectFeature($scope.bars, {
	clickout: false, toggle: true,
		multiple: true, hover: false,
		toggleKey: "ctrlKey", // ctrl key removes from selection
		multipleKey: "shiftKey", // shift key adds to selection
    });
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
app.controller('BarathonsCtrl', function($scope, Barathon){
    
    // Set la liste des barathons dans le scope
    $scope.barathons = Barathon.find().then(function(barathons){
        $scope.barathons = barathons;
        console.log(barathons);
    }, function(msg){
        alert(msg);
    });
    
    // Set la liste des barathons dans le scope
    $scope.barathonsProposes = Barathon.rendBarathonsProposes().then(function(barathonsProposes){
        $scope.barathonsProposes = barathonsProposes;
        console.log("Liste des barathons proposés --------"+barathonsProposes);
    }, function(msg){
        alert(msg);
    });
    
    $scope.mesBarathons = Barathon.find().then(function(mesBarathons){
        $scope.mesBarathons = mesBarathons;
        console.log(mesBarathons);
    }, function(msg){
        alert(msg);
    });
    
    
    $(".logo").click(function(){
        history.back();
    });
    
});

/**
 * Controleur affichage 1 Barathon
 */     
app.controller('BarathonCtrl', function($scope, $routeParams, Barathon, Bar){
    
    idBarathon = $routeParams['id'];
    
    $scope.barathon = Barathon.get(idBarathon).then(function(barathon){
        $scope.barathon = barathon;
        console.log(barathon);
    }, function(msg){
        alert(msg);
    });
    
    $scope.listeBars = Bar.find(idBarathon).then(function(listeBars){
        $scope.listeBars = listeBars;
        console.log(listeBars);
        }, function(msg){
        alert(msg);
    });
    
    
    // Récup la liste des Bars de ce Barathon
    // Appel Ajax :
    //$scope.listeBars = listeBars.rendListeBarsPourBarathon;
    
    /*$scope.listeBars = [
        {
            "nom" : "Great Escape"
        },
        {
            "nom" : "Lapin vert"
        },
    ];*/
    
    $(".logo").click(function() {
        history.back();
    });
});



/**
 * Controleur Creation Barathon
 */     
app.controller('CreationBarathonCtrl', function($scope, $routeParams, Barathon){
    
    $scope.listeBarsAValider = [
        {
            "nom" : "Great Escape"
        },
        {
            "nom" : "Lapin vert"
        },
    ];
    
    
    $(".logo").click(function() {
        history.back();
    });
});


/**
 * Controleur Creation Barathon
 */     
app.controller('ValiderBarathonCtrlCtrl', function($scope, $routeParams, Barathon){
    
    
    $scope.listeBarsAValider = [
        {
            "nom" : "Great Escape"
        },
        {
            "nom" : "Lapin vert"
        },
    ];
    
    console.log("liste " + $scope.listeBarsAValider)
    
    
    
    $(".logo").click(function() {
        history.back();
    });
});