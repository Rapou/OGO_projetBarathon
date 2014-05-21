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
	function onFeatureSelectCarte(evt) {
	    feature = evt.feature;
	    if(feature.attributes.count>=2){
		map.zoomIn();
		map.setCenter(new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y)); 
	    }else{
		console.log("Select me 1 Voir la map");
	    }
	}
	function onFeatureUnSelectCarte(evt) {
	    feature = evt.feature;
	    console.log("UnSelect me 1" + feature);
	}
	
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
	function onFeatureSelectCBarathon(evt) {
	    feature = evt.feature;
	    if(feature.attributes.count>=2){
		map.zoomIn();
		map.setCenter(new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y)); 
	    }else{
		var barsARendre = 
		    {
		       gid: feature.cluster[0].attributes.id,
		       nom: feature.cluster[0].attributes.name                             
		    };
	    }
	}

	function onFeatureUnSelectCBarathon(evt) {
	    feature = evt.feature;
	    console.log("UnSelect me 2" + feature);
	}
	
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


	// $scope.bars.events.register("featureselected", $scope.bars, onFeatureSelect);
	// $scope.bars.events.register("featureunselected", $scope.bars, onFeatureUnselect);
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
    $("#erreurLogin").hide();
        
    $("#submitLogin").click(function(){

	// Set l'id et le login de l'utilisateur loggé
	$scope.user = User.login(login, mdp).then(function(user){
            
	    // Utile ?
	    login = $("#inputLogin").val();
	    mdp = $("#inputPassword").val();
            
            $scope.user = user;
            
            // Définition de la variable globale pour les tests d'autentification
            // En cas d'erreur dans le login ou mot de passe
            if(user.login == null){
                loggedUserId = -1;
                console.log($scope.user);
                $("#inputPassword").val("");
                $("#erreurLogin").fadeIn(1000);
            }
            else {
                loggedUserId = user.login;
                console.log($scope.user);
                history.back();
            }

        }, function(msg){
            // Remise du champ mot de passe à zéro
            $("#inputPassword").val("");
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
app.controller('ValiderBarathonCtrl', function($scope, $routeParams, Barathon, ListeBars){
    
    $scope.listeBarsAValider = [
    {
	"nom" : "Great Escape"
    },
    {
	"nom" : "Lapin vert"
    },{
        "nom" : "Bleu Lézard"
    }
    ];
    
    console.log("Liste des bars à valider : ---");
    console.log("liste " + $scope.listeBarsAValider)
    
    /**
     * Bouton valider New Barathon
     */
    $("#validerNewBarathonBtn").click(function(){
        
        // Récup des données utilisateur
	var inputNomBarathon = $("#inputNomBarathon").val();
	var inputDifficulteBarathon = $("#inputDifficulteBarathon").val();
	var userCreateurId = loggedUserId;
        
        $scope.listeBarsAValider = listeBarsAValider;
        
	//alert("Enregistrement B avec info : nom = " + inputNomBarathon + " difficulte = " + inputDifficulteBarathon + " userCreateurId = " + userCreateurId);
        
        // ajoute le barathon
	var idBarathonCree = Barathon.ajouterBarathon(inputNomBarathon, inputDifficulteBarathon, userCreateurId).then(function(idBarathonCree){
	    console.log("Barathon.ajouterBarathon() ok");
	});
        
        
        console.log("CTRL validerNewB, affichage des bars a valider :");
        var ordreDansBarathon = 1;
        
        
        // FOR EACH
        $($scope.listeBarsAValider).each(function(){
            
            console.log("bar.gid");
            // ajoute les bars à la listeBars du Barathon
            ListeBars.ajouterBarPourBarathon(idBarathonCree, $scope.listeBarsAValider.gid, ordreDansBarathon);
            ordreDansBarathon++;
        })
        
        
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


