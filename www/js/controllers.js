/*******************************************************************************
 *  CONTROLEURS
 ******************************************************************************/
/**
 * Contrôleur de la page d'accueil
 */
app.controller('homeCtrl', function(){
    if(loggedUserId == -1){
        $("#login").html("Login");
    }
    else {
        $("#login").html("Loggé en tant que <strong>"+loggedUserId+"</strong>");
    }
    if(geoRoutes != "UNDEFINED"){
	map.removeLayer(geoRoutes);
	geoRoutes = "UNDEFINED";
    }
});

/**
 * Controleur de test
 */     
app.controller('testNicoCtrl', function($scope, Bar, Ways){
    $(".logo").click(function() {
	 window.location.replace("#home" );
    });
    
    // appel ajax pour récup les segments de route
    $scope.segments = Ways.rendCheminEntre2Bars().then(function(segments){
        
	if(geoBars != "UNDEFINED"){
	    map.removeLayer(geoBars);
	    geoBars = "UNDEFINED";
	}
	if(geoRoutes != "UNDEFINED"){
	    map.removeLayer(geoRoutes);
	    geoRoutes = "UNDEFINED";
	}

	geoRoutes  = new OpenLayers.Layer.Vector("Routes", {
	    styleMap: new OpenLayers.StyleMap({
		"default": new OpenLayers.Style({
		    strokeWidth: "5"
		})
	    })
	});
	console.log(geoRoutes);
	map.addLayer(geoRoutes);
	
	
        $scope.segments = segments;
	var arrayPoints = [];
        //foreach segment, ajout au Vector de la route
        $($scope.segments).each(function(i, segment){
            var geomSegment = $.parseJSON(segment.the_geom);


            $(geomSegment.coordinates).each(function(i, point){
                arrayPoints.push(new OpenLayers.Geometry.Point(point[0],point[1]));
            });
        });
	var vector = new OpenLayers.Geometry.LineString(arrayPoints);
	vector = vector.transform("EPSG:4326", "EPSG:900913");

	geoRoutes.addFeatures(new OpenLayers.Feature.Vector(vector));
        console.log(geoRoutes);        
    });
    
});


/**
 * Contrôleur de la page de carte
 */
app.controller('CarteCtrl', function($scope, Bar) {

    // logo back
    $(".logo").click(function(){
	 window.location.replace("#home" );
    });
    
    $scope.bars = Bar.find().then(function(bars){
	function onFeatureSelectCarte(evt) {
	    feature = evt.feature;
	    if(feature.attributes.count>=2){
		map.zoomIn();
		map.setCenter(new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y)); 
	    }
	}
	/*function onFeatureUnSelectCarte(evt) {
	    feature = evt.feature;
	    console.log("UnSelect me 1" + feature);
	}*/
	
	$scope.bars = bars;
	if(geoBars != "UNDEFINED"){
	    map.removeLayer(geoBars);
	    geoBars = "UNDEFINED";
	}
	    geoBars  = new OpenLayers.Layer.Vector("Bars", {
		strategies: [
		new OpenLayers.Strategy.AnimatedCluster({
		    distance: 50,
		    animationMethod: OpenLayers.Easing.Expo.easeOut,
		    animationDuration: 10
		})
		],
		styleMap: new OpenLayers.StyleMap({
		    "default": new OpenLayers.Style(ptsBar, {
			context: ctxBar
		    })/*,
		    "select": new OpenLayers.Style(ptsBarOver, {
			context: ctxBarOver
		    })*/
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
            
            // Centrage de la map pour afficher tous les points
            console.log("Emplacement carteCtrl : " + geoBars.getDataExtent());
            map.zoomToExtent(geoBars.getDataExtent()); //////////////////////////////////////////// A DEBUGGER AVEC LE PROF
	
	   geoBars.events.register("featureselected", features, onFeatureSelectCarte);
	   // geoBars.events.register("featureunselected", features, onFeatureUnSelectCarte);
    }, function(msg){
	alert(msg);
    });
}); // controleur carte






/**
 * Controleur Creation Barathon
 */     
app.controller('CreationBarathonCtrl', function($scope, $routeParams, $route, Barathon, Bar){
    $(".logo").click(function() {
	 window.location.replace("#carte" );
    });
    
    $("#creerNewBarathonBtn").click(function() {
	window.location.href= "#validerBarathon";
    });
    
    $scope.bars = Bar.find().then(function(bars){
	$scope.listeBarsAValider = listeBarsAValider;
	function onFeatureSelectCBarathon(evt) {
	    feature = evt.feature;
	    if(feature.attributes.count>=2){
		map.zoomIn();
		map.setCenter(new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y)); 
	    }else{
		var barAEnlever = false
		$(listeBarsAValider).each(function(i, bar){
		    if(feature.cluster[0].attributes.id == bar.gid){
			barAEnlever = true;
		    }
		});
		console.log(barAEnlever);
		if(barAEnlever){
		    var nouvelleListe = [];
		   $(listeBarsAValider).each(function(i, bar){
			if(feature.cluster[0].attributes.id != bar.gid){
			    nouvelleListe.push(bar);
			}
		    }); 
		    console.log(nouvelleListe);
		    listeBarsAValider = nouvelleListe;
		}else{
		    var barsARendre = {
			   gid: feature.cluster[0].attributes.id,
			   nom: feature.cluster[0].attributes.name                             
		    };
		    if(listeBarsAValider == "UNDEFINED"){
			listeBarsAValider = [barsARendre];
		    }else{
			listeBarsAValider.push(barsARendre);
		    }
		    console.log(listeBarsAValider);
		}
		$route.reload();
	    }
	}

	/*function onFeatureUnSelectCBarathon(evt) {
	    feature = evt.feature;
	    console.log("UnSelect me 2" + feature);
	}*/
	
	$scope.bars = bars;
	if(geoBars != "UNDEFINED"){
	    map.removeLayer(geoBars);
	    geoBars = "UNDEFINED";
	}
	geoBars  = new OpenLayers.Layer.Vector("Bars", {
	    strategies: [
	    new OpenLayers.Strategy.AnimatedCluster({
		distance: 50,
		animationMethod: OpenLayers.Easing.Expo.easeOut,
		animationDuration: 10
	    })
	    ],
	    styleMap: new OpenLayers.StyleMap({
		"default": new OpenLayers.Style(ptsBar, {
		    context: ctxBar
		})/*,
		"select": new OpenLayers.Style(ptsBarOver, {
		    context: ctxBarOver
		})*/
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
	// geoBars.events.register("featureunselected", features, onFeatureUnSelectCBarathon);
    }, function(msg){
	alert(msg);
    });     
});

/**
 * Contrôleur login
 */
/**
 * Permet d'externaliser la gestion de la pression de la touche "retour chariot"
 * pour pouvoir l'appeler plus bas.
 * Si le login est réussi, la fonction renvoie sur l'accueil, sinon affiche un
 * avertissement à l'utilisateur.
 * @param {type} $scope Le scope actuel
 * @param {type} User La fabrique de User
 * @returns N/A
 */
function func($scope, User){

    login = $("#inputLogin").val();
    mdp = $("#inputPassword").val();

    // Set l'id et le login de l'utilisateur loggé
    $scope.user = User.login(login, mdp).then(function(user){
        
        $scope.user = user;

        // Définition de la variable globale pour les tests d'autentification
        // En cas d'erreur dans le login ou mot de passe
        if(user.login == null){
            loggedUserId = -1;
            console.log($scope.user);
            //$("#inputPassword").val("");
            $("#erreurLogin").fadeIn(1000);
        }
        // En cas de concordance du couple login-mot de passe
        else {
            console.log("ici");
            loggedUserId = user.login;
            console.log($scope.user);
            history.back();
        }

    }, function(msg){
        // Remise du champ mot de passe à zéro
        $("#inputPassword").val("");
        alert(msg);
    });
};
    
app.controller('LoginCtrl', function($scope, User) {
    $(".logo").click(function() {
	 window.location.replace("#home" );
    });
    
    $("#cancelLogin").click(function() {
	 window.location.replace("#home" );
    });
    
    
    // Focus par défaut dans la barre de login
    $("#inputLogin").focus();
    
    

    login = $("#inputLogin").val();
    mdp = $("#inputPassword").val();
    $("#erreurLogin").hide();
        
    // Récupération de la touche "Retour clavier" pour valider cette page
    $(document).keypress(function( event ) {
        if ( event.which == 13 ) {
           event.preventDefault();
           func($scope, User);
        }
    });
    // Ou click normal sur le bouton valider
    $("#submitLogin").click(function(){
        console.log("là !");
        func($scope, User);
    });
});

/**
 * Controleur liste des Barathons
 */
app.controller('BarathonsCtrl', function($scope, Barathon){
    $(".logo").click(function(){
	history.back();
    });
    
    // Set la liste des barathons dans le scope
    $scope.barathons = Barathon.find().then(function(barathons){
	$scope.barathons = barathons;
	console.log("barathons : "+barathons);
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
	console.log("mesBarathons : "+mesBarathons);
    }, function(msg){
	alert(msg);
    });
});

/**
 * Controleur affichage 1 Barathon
 */
app.controller('BarathonCtrl', function($scope, $routeParams, Barathon, Bar){
    $(".logo").click(function() {
	history.back();
    });
    
    $scope.idBarathon = $routeParams['id'];

    function onFeatureSelectCarte(evt) {
        feature = evt.feature;
        if(feature.attributes.count>=2){
            map.zoomIn();
            map.setCenter(new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y)); 
        }
    }

    $scope.barathon = Barathon.get($scope.idBarathon).then(function(barathon){
	$scope.barathon = barathon;
	console.log(barathon);
    }, function(msg){
	alert(msg);
    });
    
    // On récupère et passe dans le scope la liste des bars pour ce barathon
    $scope.listeBars = Bar.find($scope.idBarathon).then(function(listeBars){
	$scope.listeBars = listeBars;
	console.log("Liste des bars : " + listeBars);
        
        // Ajout des bars à la carte
        if(geoBars != "UNDEFINED"){
	    map.removeLayer(geoBars);
	    geoBars = "UNDEFINED";
	}
	    geoBars  = new OpenLayers.Layer.Vector("Bars", {
		strategies: [
		new OpenLayers.Strategy.AnimatedCluster({
		    distance: 50,
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
            
            // On ajoute ensuite les éléments graphiques à la carte
	    var features = new Array();

	    $.each($scope.listeBars, function(i, elem){
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
            map.zoomToExtent(geoBars.getDataExtent());
            
            /*geoBars.events.register('loadend', geoBars, function(evt){
                console.log("Je suis là !");
                map.zoomToExtent(geoBars.getDataExtent());
            });*/
            
	    selectControl = new OpenLayers.Control.SelectFeature(geoBars, {
		clickout: false, 
		toggle: true,
		multiple: true, 
		hover: false
	    });
	    map.addControl(selectControl);
	    selectControl.activate();
            
            geoBars.events.register("featureselected", features, onFeatureSelectCarte);
            
            // FONCTION PERMETTANT D'ENREGISTRER UNE ACTION
            // Puis centrage de la carte
            //map.setCenter(new OpenLayers.LonLat(6.645, 46.53).transform("EPSG:4326", "EPSG:900913"), 14);
            
            //console.log("Emplacement barathonCtrl : " + geoBars.getDataExtent());
            //map.zoomToExtent(geoBars.getDataExtent());

    }, function(msg){
	alert(msg);
    });
    
    $("#launchButton").click(function(){
	//crée partie
	idPartieEnCours 
        window.location.replace("#partieEnCours/" + idPartieEnCours);
    }); 
    
    // Resize de la police quand le nom du barathon est trop long
    var $body = $('body'); //Cache this for performance

    var setBodyScale = function() {
        var scaleSource = $body.width(),
            scaleFactor = 0.35,                     
            maxScale = 250,
            minScale = 30; //Tweak these values to taste

        var fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:

        if (fontSize > maxScale) fontSize = maxScale;
        if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and maximums

        $('.headerText h3').css('font-size', fontSize + '%');
    };

    $(window).resize(function(){
        setBodyScale();
    });

    //Fire it when the page first loads:
    setBodyScale();
    // Fin du resize de la police
});

/**
 * Contrôleur validation Barathon
 */
app.controller('ValiderBarathonCtrl', function($scope, $routeParams, Barathon, ListeBars){
    $(".logo").click(function() {
	window.location.replace("#creationBarathon" );
    });
    
    $scope.listeBarsAValider = listeBarsAValider;

    /**
     * Bouton valider New Barathon
     */
    $("#validerNewBarathonBtn").click(function(){
        
        // Récup des données utilisateur
	var inputNomBarathon = $("#inputNomBarathon").val();
	var inputDifficulteBarathon = $("#inputDifficulteBarathon").val();
	var userCreateurId = loggedUserId;
        
        // ajoute le barathon
	var idBarathonCree = Barathon.ajouterBarathon(inputNomBarathon, inputDifficulteBarathon, userCreateurId).then(function(idBarathonCree){
	    var ordreDansBarathon = 1;
	    // FOR EACH
	    $($scope.listeBarsAValider).each(function(i, bar){

		idBara = parseInt(idBarathonCree.replace('"',''));
		// ajoute les bars à la listeBars du Barathon
		    ListeBars.ajouterBarPourBarathon(idBara, bar.gid, ordreDansBarathon).then(function(bar_id){
		    
		}, function(msg){
		    console.log(msg);
		});
		ordreDansBarathon++;
	    });
	    listeBarsAValider = "UNDEFINED";
            
	    window.location.replace("#home" );
	});
    });
});


/**
 * Controleur Partie en Cours
 */     
app.controller('partieEnCoursCtrl', function($scope, $routeParams, Parties){
     $(".logo").click(function() {
	window.location.replace("#home" );
    });
    
    console.log("idPartieEnCours : "+idPartieEnCours);
    
    //$routeParams
    
    // s'il n y pas de partie en cours
    if(idPartieEnCours == 0){
        // créer nouvelle partie
        
        // récupérer barathon, liste bars et calculs des routes
        
        // affichage barathon et bars
        
    } else { // il y a une partie en cours !
        // affichage barathon
    }
    
    $scope.idPartieEnCours = idPartieEnCours;
    $scope.poil = 0;
    
    // controlleur parties pour créer new partie avec idBarathon
    
    // location replace -> partieEnCours/idNewPartie
});


