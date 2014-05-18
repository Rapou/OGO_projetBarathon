var bootstrap = "bootstrap.php";
var app = angular.module('MonApp', ['ngRoute']);

    /*
     * REGLES DE ROUTAGE DES PAGES
     */
    app.config(function($routeProvider) {
        $routeProvider
                .when('/', {templateUrl: 'views/home.html', controller: 'HomeCtrl'})
                .when('/bars', {templateUrl: 'views/bars.html'})
                .when('/contact', {templateUrl: 'views/contact.html'})
                .otherwise({redirectTo: '/'});
    });

    /**
     * Permet d'afficher la carte dans un layer OpenLayer
     * @param {type} param1
     * @param {type} param2
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

        var hauteur = $(document).height() - 40;
        $("#map").css("height", hauteur + "px");
        map.addLayer(goog);
        map.setCenter(new OpenLayers.LonLat(8, 47).transform("EPSG:4326", "EPSG:900913"), 6);

        $(window).resize(function() {
            var nouvelleHauteur = $(window).height() - 40;
            $("#map").css("height", nouvelleHauteur + "px");
        });
        
    /*
     * 
     */

    });
