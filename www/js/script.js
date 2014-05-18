var bootstrap = "bootstrap.php";
var app = angular.module('Barathon', ['ngRoute']);

    /*
     * REGLES DE ROUTAGE DES PAGES
     */
    app.config(function($routeProvider) {
        $routeProvider
                .when('/', {templateUrl: 'views/home.html', controller: 'HomeCtrl'})
                .when('/bars', {templateUrl: 'views/bars.html'})
                .when('/carte', {templateUrl: 'views/carte.html', controller: 'CarteCtrl'})
                .when('/contact', {templateUrl: 'views/contact.html'})
                .otherwise({redirectTo: '/'});
    });

    /**
     * Controlleur de la page d'accueil
     */
    app.controller('HomeCtrl', function() {
        map = new OpenLayers.Map('map', {
            projection: new OpenLayers.Projection("EPSG:3857"),
            maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508)
        });
        goog = new OpenLayers.Layer.Google("Google layer",
                {
                    type: google.maps.MapTypeId.ROADMAP,
                    sphericalMercator: true
                }
        );

        var hauteur = $(document).height() - 100;
        $("#map").css("height", hauteur + "px");
        map.addLayer(goog);
        map.setCenter(new OpenLayers.LonLat(8, 47).transform("EPSG:4326", "EPSG:900913"), 6);

        $(window).resize(function() {
            $("#map").css("height", hauteur + "px");
        });
        
    /*
     * 
     */

    });
    
    /**
     * Controlleur de la Carte (affichage carte et lancer création Barathon)
     */
    app.controller('CarteCtrl', function() {
        map = new OpenLayers.Map('map', {
            projection: new OpenLayers.Projection("EPSG:3857"),
            maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508)
        });
        goog = new OpenLayers.Layer.Google("Google layer",
                {
                    type: google.maps.MapTypeId.ROADMAP,
                    sphericalMercator: true
                }
        );

        var hauteur = $(document).height() - 40;
        $("#map").css("height", hauteur + "px");
        map.addLayer(goog);
        map.setCenter(new OpenLayers.LonLat(6.635, 46.52).transform("EPSG:4326", "EPSG:900913"), 15);

        $(window).resize(function() {
            var nouvelleHauteur = $(window).height() - 40;
            $("#map").css("height", nouvelleHauteur + "px");
        });
    });
