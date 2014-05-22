/*******************************************************************************
 *  CONTROLEURS
 ******************************************************************************/
/**
 * Contrôleur de la page d'accueil
 */
app.controller('homeCtrl', function($scope){
    if(loggedUser == undefined){
        $("#login").html("Login");
    }
    else {
        $("#login").html("Loggé en tant que <strong>"+loggedUser.login+"</strong>");
    }
    
    if(idPartieEnCours == 0){
        $("#partieEnCours").hide();
    } else {
        $scope.partieEnCours = idPartieEnCours;
        $("#partieEnCours").show();
    }
    
    // Hide le message pour un barathon créé
    $("#barathonCree").hide();
    // Affichage de l'alerte Succes Barathon créé
    if(barathonCree === true){
        $("#barathonCree").fadeIn(1000).delay(2000).fadeOut(1000);
        
        window.setInterval(function() {
            barathonCree = false;
        }, 1000);
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
    
    // Récup du Bar 1
    $scope.bar1 = Bar.get(1).then(function(bar){
        var bar1_geoJSON = $.parseJSON(bar.geometry);
        
        //Récup du node le plus proche du bar 1
        $scope.node1 = Ways.rendNodeLePlusProche(bar1_geoJSON).then(function(node){
            $scope.node1 = node;
            
            // récup bar 2
            $scope.bar2 = Bar.get(2).then(function(bar2){
                var bar2_geoJSON = $.parseJSON(bar2.geometry);
                
                
                // récup du node le plus proche du bar 2
                $scope.node2 = Ways.rendNodeLePlusProche(bar2_geoJSON).then(function(node3){
                    $scope.node2 = node3;
                    
                    console.log("Id des 2 nodes : ");
                    console.log($scope.node1[0].id);
                    console.log($scope.node2[0].id);
                    
                    
                    // appel ajax pour récup les segments de route
                   $scope.segments = Ways.rendCheminEntre2Bars($scope.node1[0].id,$scope.node2[0].id).then(function(segments){

                       if(geoBars != "UNDEFINED"){
                           map.removeLayer(geoBars);
                           geoBars = "UNDEFINED";
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
                           
                           console.log(segment);
                           
                           var geomSegment = $.parseJSON(segment.the_geom);


                           $(geomSegment.coordinates).each(function(i, point){
                               arrayPoints.push(new OpenLayers.Geometry.Point(point[0],point[1]));
                           });
                       });
                       var vector = new OpenLayers.Geometry.LineString(arrayPoints);
                       vector = vector.transform("EPSG:4326", "EPSG:900913");

                       geoRoutes.addFeatures(new OpenLayers.Feature.Vector(vector));
                   });
                    
                    
                });
                
            }); // get bar 2
            
        }); // ge node1
        

            
            /*
             // appel ajax pour récup les segments de route
            $scope.segments = Ways.rendCheminEntre2Bars($scope.bar1_geoJSON,$scope.bar2_geoJSON).then(function(segments){

                if(geoBars != "UNDEFINED"){
                    map.removeLayer(geoBars);
                    geoBars = "UNDEFINED";
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
            });*/
            
            
    }); // get Bar 1
    
    
    


    
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
            //console.log("Emplacement carteCtrl : " + geoBars.getDataExtent());
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
	 window.location.replace("#carte");
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
function validerUser($scope, User){

    login = $("#inputLogin").val();
    mdp = $("#inputPassword").val();

    // Set l'id et le login de l'utilisateur loggé
    $scope.user = User.login(login, mdp).then(function(user){
        
        // Définition de la variable globale pour les tests d'autentification
        // En cas d'erreur dans le login ou mot de passe
        if(user.login == null){
            loggedUser = undefined;
            //$("#inputPassword").val("");
            $("#erreurLogin").fadeIn(1000);
        }
        // En cas de concordance du couple login-mot de passe
        else {
            loggedUser = user;
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
           validerUser($scope, User);
        }
    });
    // Ou click normal sur le bouton valider
    $("#submitLogin").click(function(){
        validerUser($scope, User);
    });
});

/**
 * Controleur liste des Barathons
 * @param {scope} $scope Le scope global d'angularJS
 * @param {barathon} Barathon La Factory pour faire des barathons
 */
app.controller('BarathonsCtrl', function($scope, Barathon, Parties){
    $(".logo").click(function(){
	history.back();
    });
    
    $scope.mesBarathons = {};
    
    // Set la liste des barathons dans le scope
    $scope.barathonsProposes = Barathon.rendBarathonsProposes().then(function(barathonsProposes){
	$scope.barathonsProposes = barathonsProposes;
    }, function(msg){
	alert(msg);
    });
    
    // check si un user est authentifié. Si non, on cache les les div d'affichage
    if(loggedUser == undefined){
        $("#mesBarathons").hide();
        $("#partiesJouees").hide();
    } else {
        // récupère mes Barathons
        $scope.mesBarathons = Barathon.rendMesBarathons(loggedUser.login).then(function(mesBarathons){
            $scope.mesBarathons = mesBarathons;
            console.log("mesBarathons : "+$scope.mesBarathons);
            $("#mesBarathons").show();
            
            
        }, function(msg){
            alert(msg);
        });
        
        
    }
    
    // Set la liste des barathons dans le scope
    Barathon.find().then(function(barathons){
	$scope.barathons = barathons;
	//console.log("barathons : "+barathons);
    }, function(msg){
	alert(msg);
    });
    
    
    
/*
    Barathon.find().then(function(mesBarathons){
	$scope.mesBarathons = mesBarathons;
	//console.log("mesBarathons : "+mesBarathons);
    }, function(msg){
	alert(msg);
    });*/
});

/**
 * Controleur affichage 1 Barathon
 */

app.controller('BarathonCtrl', function($scope, $routeParams, Barathon, ListeBars, Parties){

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

    Barathon.get($scope.idBarathon).then(function(barathon){
	$scope.barathon = barathon;
	//console.log(barathon);
        
        // En cas de succès, on ajoute ensuite les bars à la carte
        // On récupère et passe dans le scope la liste des bars pour ce barathon
        ListeBars.find($scope.idBarathon).then(function(listeBars){
            $scope.listeBars = listeBars;

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



                /*geoBars.events.register('featuresadded', geoBars, function(evt){
                    console.log("Etat des bars avant zoom : " + geoBars);
                    if(geoBars != undefined){
                        map.zoomToExtent(geoBars.getDataExtent());
                    }else {
                        // On ne fait rien
                    }
                });*/

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
                map.addLayer(geoBars);
                geoBars.addFeatures(features);

                map.zoomToExtent(geoBars.getDataExtent());

                selectControl = new OpenLayers.Control.SelectFeature(geoBars, {
                    clickout: false, 
                    toggle: true,
                    multiple: true, 
                    hover: false
                });
                map.addControl(selectControl);
                selectControl.activate();

                geoBars.events.register("featureselected", features, onFeatureSelectCarte);

		 /**
		  * BOUTON lancer Barathon, crée une partie et va l'afficher
		  */
		    $("#launchButton").click(function(){

			if (idPartieEnCours > 0){
			    alert("il y a deja une partie en cours !");
			} else {

			    // Créée new Partie
			    Parties.nouvellePartie($scope.idBarathon, loggedUser.id).then(function(idPartieCreee){

			    idPartieCreee = parseInt(idPartieCreee.replace('"',''));

			    // affichage de la bonne partie
			    $scope.idPartieEnCours = idPartieCreee;


			    window.location.replace("#parties/" + $scope.idPartieEnCours);
			});
		    }
	
		});  // launch button

                // FONCTION PERMETTANT D'ENREGISTRER UNE ACTION
                // Puis centrage de la carte
                //map.setCenter(new OpenLayers.LonLat(6.645, 46.53).transform("EPSG:4326", "EPSG:900913"), 14);

                //console.log("Emplacement barathonCtrl : " + geoBars.getDataExtent());
                //map.zoomToExtent(geoBars.getDataExtent());

        }, function(msg){
            alert(msg);
        });
        
    }, function(msg){
	alert(msg);
    });
    

    
    
    /**
     * BOUTON lancer Barathon, crée une partie et va l'afficher
     */
    $("#launchButton").click(function(){
        
        if (idPartieEnCours > 0){
            alert("il y a deja une partie en cours !");
        } else {
            
            // Créée new Partie
            Parties.nouvellePartie($scope.idBarathon, loggedUser.Id).then(function(idPartieCreee){
                
                var idNewPartie = parseInt(idPartieCreee.replace('"',''));
                
                // affichage de la bonne partie
                $scope.idPartieEnCours = idNewPartie;
                idPartieEnCours = idNewPartie;
                
                alert("CTRL BarathonCtrl/ SCOPE idPartie " +$scope.idPartieEnCours );
                
                window.location.replace("#parties/" + $scope.idPartieEnCours);
            });
        }
	
    });  // launch button
    

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


    
    $scope.listeBarsAValider = listeBarsAValider;

    
    /**
     * Bouton valider New Barathon
     */
    $("#validerNewBarathonBtn").click(function(){
        
        if(loggedUser == undefined){
            alert("Vous devez être loggé pour créer un barathon.");
        }
        else {
             // Récup des données utilisateur
            var inputNomBarathon = $("#inputNomBarathon").val();
            var inputDifficulteBarathon = $("#inputDifficulteBarathon").val();
            var userCreateurId = loggedUser.id;

            // ajoute le barathon
            var idBarathonCree = Barathon.ajouterBarathon(inputNomBarathon, inputDifficulteBarathon, userCreateurId).then(function(idBarathonCree){
                var ordreDansBarathon = 1;
                // FOR EACH
                $($scope.listeBarsAValider).each(function(i, bar){

                    console.log("IDIDIDID barathon créé"+idBarathonCree);

                    var idBara = parseInt(idBarathonCree.replace('"',''));
                    // ajoute les bars à la listeBars du Barathon
                    ListeBars.ajouterBarPourBarathon(idBara, bar.gid, ordreDansBarathon).then(function(bar_id){

                    }, function(msg){
                        console.log(msg);
                    });
                    ordreDansBarathon++;
                });
                listeBarsAValider = "UNDEFINED";

                barathonCree = true;
                console.log("BARATHON CREE validerBarathon : "+ barathonCree);

                window.location.replace("#home" );
            });
        }
        
       
    });
});



/**
 * Controleur Partie en Cours
 */
app.controller('partieEnCoursCtrl', function($scope, $routeParams, $route, Parties, Barathon, ListeBars){
    $scope.partieEnCours = "" ;
    $scope.barathonEnCours = "";
    $scope.listeBars = "";
    $scope.barAVisite = "";
    
    $(".logo").click(function() {
	window.location.replace("#home");
    });    
    
    
    // récup la partieEnCours
    $scope.partieEnCours = Parties.parties($routeParams.id).then(function(partie){
        function onFeatureSelectCarte(evt) {
	    feature = evt.feature;
	    if(feature.attributes.count>=2){
		map.zoomIn();
		map.setCenter(new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y)); 
	    }
	}
    
        $scope.partieEnCours = partie;
        var barathonId = partie.barathonid;
        idBarActif = partie.barencoursid;
        $scope.barathonEnCours = Barathon.get(barathonId).then(function(barathon){
            $scope.barathonEnCours = barathon;
	    $scope.listeBars = ListeBars.find(barathonId).then(function(listeBars){
		    $scope.listeBars = listeBars;
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
			    "default": new OpenLayers.Style(ptsBarPartie, {
				context: ctxBarPartie
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
			    id: elem.gid,
			    ordre: elem.ordredansbarathon
			};
			if(elem.gid == partie.barencoursid){
			    listeBarsAValider = elem;
			    console.log(listeBarsAValider);
			    map.setCenter(new OpenLayers.LonLat(myGeo.coordinates[0], myGeo.coordinates[1]).transform("EPSG:4326", "EPSG:900913"), 14); 
			    $scope.barAVisite = elem;
			}
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
		    
		    $("#validerEtape").click(function() {
			console.log($scope.partieEnCours);
			console.log($scope.listeBars.length);
		    });
		    
		    if($scope.partieEnCours.etat == "terminee"){
			$("#prochainBar").text("Retour à l'accueil");
			$("#titreHaut").append(" - Terminé"); 
			$("#prochainBar").click(function(event) {
			    event.preventDefault();
			    window.location.replace("#home");
			});
		    }else{
			$("#prochainBar").click(function(event) {
			    event.preventDefault();
			    if($scope.listeBars.length == $scope.barAVisite.ordredansbarathon){
				var finiPartie = Parties.termineBarathon($scope.partieEnCours.id).then(function(fin){
				    $route.reload();
				});
			    }else{
				var changementBar = Parties.valideBar($scope.partieEnCours.id, $scope.barathonEnCours.id, $scope.barAVisite.gid).then(function(changement){
				    $route.reload();
				});
			    }
			});
		    }
		}); 
        });
        
        
        //barathonId = partie.id;
        
    });


});


