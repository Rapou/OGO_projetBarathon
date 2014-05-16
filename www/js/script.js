var bootstrap = "bootstrap.php";
var idEtat = 0;
var idEtape = 0;

function initialize(etapeLAT, etapeLONG, etapeNOM, etapeADR, etapeNPA, etapeLOC) {
    var myLatlng = new google.maps.LatLng(etapeLAT,etapeLONG);
    var mapOptions = {
	center: myLatlng,
	zoom: 16
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"),
	mapOptions);
    
    var marker = new google.maps.Marker({
	position: myLatlng
    });
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 class="firstHeading">'+ etapeNOM +'</h1>'+
      '<div class="bodyContent">'+
      '<p>' + etapeADR +'</p>'+
      '<p>' + etapeNPA + ' ' + etapeLOC + '</p>'+
      '</div>'+
      '</div>';
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    
    marker.setMap(map);
    infowindow.open(map,marker);
    
    google.maps.event.addListener(marker, 'click', function() {
	infowindow.open(map,marker);
    });
}

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
	    $("#map-canvas").empty();
	    initialize(donnee.etapeLAT, donnee.etapeLONG, donnee.etapeNOM, donnee.etapeADR, donnee.etapeNPA, donnee.etapeLOC); 
	}
    });
}
  
$(document).ready(function(){
    var taille = $(document).height();
    var tEdit = taille - 130;
    $("#map-canvas").css("height", tEdit + "px");
    $("#map-canvas").css("top", "130px");
    $.getJSON(bootstrap ,{
	controller: "Partie",
	action: "rends",
	idPartie: 1,
	format: 'json'
    }, function(donnee){
	console.log("oh! "+  donnee.etapeNOM);
	idEtat = donnee.etatID;
	idEtape = donnee.etapeID;
	initialize(donnee.etapeLAT, donnee.etapeLONG, donnee.etapeNOM, donnee.etapeADR, donnee.etapeNPA, donnee.etapeLOC); 	
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
	setInterval('getPartie();', 15000);
    });
});

