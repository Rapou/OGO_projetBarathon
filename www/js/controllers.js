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
    }, function(msg){
	alert(msg);
    });
});


/**
 * Contrôleur de la page de carte
 */
app.controller('CarteCtrl', function($scope, Bar) {

    // logo back
    $(".logo").click(function(){
	history.back();
    });
    
    $scope.bars = Bar.find().then(function(bars){
	$scope.bars = bars;
	if(geoBars != "UNDEFINED"){
	    map.removeLayer(geoBars);
	    geoBars = "UNDEFINED";
	}
	    geoBars  = new OpenLayers.Layer.Vector("Bars", {
		strategies: [
		new OpenLayers.Strategy.AnimatedCluster({
		    distance: 45,
		    animationMethod: OpenLayers.Easing.Expo.easeOut,
		    animationDuration: 10
		})
		],
		styleMap: new OpenLayers.StyleMap({
		    "default": new OpenLayers.Style(ptsBar, {
			context: ctxBar
		    }),
		    "select": new OpenLayers.Style(ptsBarOver, {
			context: ctxBarOver
		    })
		})
	    });
	    map.addLayer(geoBars);
	    var features = new Array();

	    $.each($scope.bars, function(i, elem){
		var myGeo = $.parseJSON(elem.geometry);
		ptGeom = new OpenLayers.Geometry.Point(myGeo.coordinates[0], myGeo.coordinates[1]);
		ptGeom = ptGeom.transform("EPSG:4326", "EPSG:900913");
		features[i] = new OpenLayers.Feature.Vector(ptGeom);
		features[i].attributes = {
		    name: elem.name,
		    id: elem.gid
		};
	    });
	    geoBars.addFeatures(features);
	    selectControl = new OpenLayers.Control.SelectFeature(geoBars, {
		clickout: false, 
		toggle: true,
		multiple: true, 
		hover: false
	    });
	    map.addControl(selectControl);
	    selectControl.activate();
	
	    geoBars.events.register("featureselected", features, onFeatureSelectCarte);
	    geoBars.events.register("featureunselected", features, onFeatureUnSelectCarte);
    }, function(msg){
	alert(msg);
    });
}); // controleur carte

/**
 * Controleur Creation Barathon
 */     
app.controller('CreationBarathonCtrl', function($scope, $routeParams, Barathon, Bar){
    
    $("#creerNewBarathonBtn").click(function() {
	window.location.href= "#validerBarathon";
    });
    
    $scope.bars = Bar.find().then(function(bars){
	$scope.bars = bars;
	if(geoBars != "UNDEFINED"){
	    map.removeLayer(geoBars);
	    geoBars = "UNDEFINED";
	}
	geoBars  = new OpenLayers.Layer.Vector("Bars", {
	    strategies: [
	    new OpenLayers.Strategy.AnimatedCluster({
		distance: 45,
		animationMethod: OpenLayers.Easing.Expo.easeOut,
		animationDuration: 10
	    })
	    ],
	    styleMap: new OpenLayers.StyleMap({
		"default": new OpenLayers.Style(ptsBar, {
		    context: ctxBar
		}),
		"select": new OpenLayers.Style(ptsBarOver, {
		    context: ctxBarOver
		})
	    })
	});
	map.addLayer(geoBars);
	var features = new Array();

	 $.each($scope.bars, function(i, elem){
	    var myGeo = $.parseJSON(elem.geometry);
	    ptGeom = new OpenLayers.Geometry.Point(myGeo.coordinates[0], myGeo.coordinates[1]);
	    ptGeom = ptGeom.transform("EPSG:4326", "EPSG:900913");
	    features[i] = new OpenLayers.Feature.Vector(ptGeom);
	    features[i].attributes = {
		name: elem.name,
		id: elem.gid
	    };
	});
	geoBars.addFeatures(features);
	selectControl = new OpenLayers.Control.SelectFeature(geoBars, {
	    clickout: false, 
	    toggle: true,
	    multiple: true, 
	    hover: false
	});
	map.addControl(selectControl);
	selectControl.activate();
	geoBars.events.register("featureselected", features, onFeatureSelectCBarathon);
	geoBars.events.register("featureunselected", features, onFeatureUnSelectCBarathon);
	
    /*$scope.barsAValider  = new OpenLayers.Layer.Vector("ListeBar", {
	styleMap: new OpenLayers.StyleMap(ptsBarValider)
    });
    map.addLayer($scope.barsAValider);
    
    console.log($scope);

    $scope.bars.events.register("featureselected", $scope.bars, onFeatureSelect);
    $scope.bars.events.register("featureunselected", $scope.bars, onFeatureUnselect);
    

    function onFeatureSelect(evt) {
	feature = evt.feature;
	$scope.barsAValider.addFeatures(feature);
    }
              
    function onFeatureUnselect(evt) {
	feature = evt.feature;
	console.log("UnSelect" + feature);

    }*/
	
    }, function(msg){
	alert(msg);
    });
   
/*$scope.listeBarsAValider = [
    {
	"nom" : "Great Escape"
    },
    {
	"nom" : "Lapin vert"
    },
    ];*/
    
// console.log("liste " + $scope.listeBarsAValider)
     
    
});

/**
 * Contrôleur login
 */
app.controller('LoginCtrl', function($scope, User) {
      
    //bootstrap.php?controller=Users&action=validerUser&userLogin=admin&mdp=1234
        
    // Validate mdp : Controller_Users->validerUsers();

    login = $("#inputLogin").val();
    mdp = $("#inputPassword").val();
        
    $("#submitLogin").click(function(){
	// Set l'id et le login de l'utilisateur loggé
	$scope.user = User.login(login, mdp).then(function(){
            
	    // Utile ?
	    login = $("#inputLogin").val();
	    mdp = $("#inputPassword").val();
            
            
	}, function(msg){
	    alert(msg);
	});
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
    
    $scope.idBarathon = $routeParams['id'];

    $scope.barathon = Barathon.get($scope.idBarathon).then(function(barathon){
	$scope.barathon = barathon;
	console.log(barathon);
    }, function(msg){
	alert(msg);
    });
    
    $scope.listeBars = Bar.find($scope.idBarathon).then(function(listeBars){
	$scope.listeBars = listeBars;
	console.log("Liste des bars : " + listeBars);
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
 * Controleur Validation Barathon
 */     
app.controller('ValiderBarathonCtrl', function($scope, $routeParams, Barathon){
    
    $scope.listeBarsAValider = [
    {
	"nom" : "Great Escape"
    },
    {
	"nom" : "Lapin vert"
    },
    ];
    
    console.log("liste " + $scope.listeBarsAValider)
    
    
    $("#validerNewBarathonBtn").click(function(){
        
	inputNomBarathon = $("#inputNomBarathon").val();
	inputDifficulteBarathon = $("#inputDifficulteBarathon").val();
	inputListeBars = $scope.listeBarsAValider;
	userCreateurId = loggedUserId;

	alert("Enregistrement B avec info : nom = " + inputNomBarathon + " difficulte = " + inputDifficulteBarathon + "listeBars = " + inputListeBars + " userCreateurId = " + userCreateurId);
        
	Barathon.ajouterBarathon(inputNomBarathon, inputDifficulteBarathon, inputListeBars, userCreateurId).then(function(idBarathonCree){
	    console.log("Barathon.ajouterBarathon() ------------- return :");
	    console.log(idBarathonCree);
	});
        
    });
});


/**
 * Controleur Partie en Cours
 */     
app.controller('partieEnCoursCtrl', function($scope, $routeParams, Barathon){
    
    $scope.listeBarsAValider = [
    {
	"nom" : "Great Escape"
    },
    {
	"nom" : "Lapin vert"
    },
    ];
    
    $(".logo").click(function() {
	history.go(-2); // TODO : regarder pourquoi ça ne marche pas avec un history.back() - NB
    });
});


