var bootstrap = "../bootstrap.php";
var idEtat = 0;
var idEtape = 0;
var noEtape = 0;

function getPartie() {
    $.getJSON(bootstrap ,{
	controller: "Partie",
	action: "rends",
	idPartie: 1,
	format: 'json'
    }, function(donnee){
	if(donnee.etatID != idEtat || idEtape != donnee.etapeID){
	    idEtape = donnee.etapeID;
	    idEtat = donnee.etatID
	    noEtape = donnee.etapeNUM;
	    if(idEtat == 2){
		$("div#etape p").text("Marche en direction de");
		$("div#etablissement p").text(donnee.etapeNOM);
	    }else{
		if(idEtat == 4){
		    $("div#etape p").text("Fin du Barathon");
		    $("div#etablissement p").text("Bonus : Bar à shot au " + donnee.etapeNOM);
		}else{
		    $("div#etape p").text("Etape " + donnee.etapeNUM);
		    $("div#etablissement p").text(donnee.etapeNOM);
		}
	    }
	    changerAdmin();
	}
	
    });
}
function changerAdmin() {
    if(idEtat == 1){
	$("#btn_apres").text("Se promener");
	$("#btn_avant").hide();
	
    }else{
	if(idEtat == 4){
	    $("#btn_apres").hide();
	}else{
	    var dispAv = $("#btn_avant").css("display");
	    var dispAp = $("#btn_apres").css("display");
	    if(dispAv == "none"){
		$("#btn_avant").show();
	    }
	    if(dispAp == "none"){
		$("#btn_apres").show();
	    }
	    if(idEtat == 2){
		$("#btn_apres").text("Arrivé au bar");
	    }else{
		$("#btn_apres").text("Prochain bar");
	    }
	}
    }
$("#chargement").hide();

}

$(document).ready(function(){
    getPartie();  
    $("#btn_avant").on("click", function(event){
	$("#chargement").show();
	switch(idEtat){
	    case "4":
		$.getJSON(bootstrap ,{
		    controller: "Partie",
		    action: "changeBarDernier", 
		    idEtatAvant: 3,
		    format: 'json'
		}, function(donnee){
		    getPartie();
		});
		break;
	    case "3":
		var etatAvant = 2;
		if(idEtape == 2){
		    etatAvant = 1;
		    $.getJSON(bootstrap ,{
			controller: "Partie",
			action: "changeBarAvant",
			idEtapeActive: idEtape,
			idEtatAvant: etatAvant,
			format: 'json'
		    }, function(donnee){
			getPartie();
		    });
		}else{
		    $.getJSON(bootstrap ,{
			controller: "Partie",
			action: "changeEtatMarche",
			idEtapeActive: idEtape,
			idEtat: etatAvant,
			format: 'json'
		    }, function(donnee){
			getPartie();
		    });
		}
		
		break;
	    case "2":
		$.getJSON(bootstrap ,{
		    controller: "Partie",
		    action: "changeBarAvant",
		    idEtapeActive: idEtape,
		    idEtatAvant: 3,
		    format: 'json'
		}, function(donnee){
		    getPartie();
		});
		break;
	    default:
	}
    });
    
    $("#btn_apres").on("click", function(event){
	$("#chargement").show();
	switch(idEtat){
	    case "1":
		$.getJSON(bootstrap ,{
		    controller: "Partie",
		    action: "changeBarPremier", 
		    idEtatSuivant: 3,
		    format: 'json'
		}, function(donnee){
		    getPartie();
		});
		break;
	    case "3":
		var etatSuivant = 2;
		if(idEtape == 17){
		    etatSuivant = 4;
		}
		
		$.getJSON(bootstrap ,{
		    controller: "Partie",
		    action: "changeBarSuivant",
		    idEtapeActive: idEtape,
		    idEtatSuivant: etatSuivant,
		    format: 'json'
		}, function(donnee){
		    getPartie();
		});
		break;
	    case "2":
		$.getJSON(bootstrap ,{
		    controller: "Partie",
		    action: "changeEtatMarche",
		    idEtapeActive: idEtape,
		    idEtat: 3,
		    format: 'json'
		}, function(donnee){
		    getPartie();
		});
		break;
	    default:
	}
    });

});

