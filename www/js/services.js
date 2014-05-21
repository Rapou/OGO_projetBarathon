/*******************************************************************************
 *                          SERVICES ANGULAR
 *
 *  FACTORIES
 *  Gère les requêtes Ajax. A la fonction de Modèle du MVC.
 ******************************************************************************/
/*
 * Factory pour les Login
 */
app.factory('User', function($http, $q){
    var factory = {
	user : -1,
        
        // On vérifie si le couple utilisateur + mot de passe est correct
        login : function(userId, pass){
            var deferred = $q.defer();
            $http.get(bootstrap + "?controller=Users&action=validerUser&userLogin="+userId+"&mdp="+pass)
            
                // Si oui, on set la globale userLoggedIn et on revient à l'index
                .success(function(data, status){
                    factory.user = data;
                    console.log("Data : " + data);
                    console.log("Status : " + status);
                    console.log("Authentifié en tant que : " + data);
                    deferred.resolve(factory.user);
                })
                    
                // Sinon on affiche un message d'erreur
                .error(function(){
                    console.log("Echec d'authentification");
                    deferred.reject("Factory Users : Erreur lors du login");
                });
                return deferred.promise;
            }
        
	/*validerUser : function(){
	    var bar = {};
	    angular.forEach(factory.bars, function(value, key){
		if(value.id == key){
		    bar = value;
		}
	    });
	    return bar;
	}*/
        
        
    };
    return factory;
});

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
	// Permet de rendre un barathon selon l ID
	get : function(id){
            
	    var deferred = $q.defer();
            
	    $http.get(bootstrap + "?controller=Barathons&action=rendBarathonParId&barathonId="+id)
	    .success(function(data, status){
                    
		barathon : false;
                    
	    factory.barathon = data;
	    deferred.resolve(factory.barathon);
                    
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
        
        ajouterBarathon : function(inputNomBarathon, inputDifficulteBarathon, inputListeBars, userCreateurId){
            var deferred = $q.defer();
            barathon : false;
            
            
            $http.get(bootstrap + "?controller=Barathons&action=ajouterBarathon&inputNomBarathon="+inputNomBarathon+"&inputDifficulteBarathon="+inputDifficulteBarathon+"&listeBarsAValider="+inputListeBars+"&userCreateurId="+userCreateurId)
                .success(function(data, status){
                    
                    factory.barathon = data;
                    deferred.resolve(factory.barathon);
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
        
	listeBars : {},
        
	// Permet de retourner tous les bars, ou de faire une recherche si un paramètre est renseigné.
	find : function(barathonId){
	    var deferred = $q.defer();
            
	    // Quand on veut récupérer tous les barathons
	    if(barathonId === undefined){
		$http.get(bootstrap + "?controller=Barathons&action=rend")
		.success(function(data, status){
		    factory.listeBars = data;
		    deferred.resolve(factory.listeBars);
		})
		.error(function(){
		    deferred.reject("msg");
		});
		return deferred.promise;
	    }
	    // Quand on ne récupère qu'un Bar à la fois
	    else{
		$http.get(bootstrap + "?controller=Barathons&action=rend")
		.success(function(data, status){
		    factory.listeBars = data;
		    deferred.resolve(factory.listeBars);
		})
		.error(function(){
		    deferred.reject("msg");
		});
		return deferred.promise;
	    }
	//,
	// Permet de rendre un bar si on a son ID
	/*get : function(id){
            listeBars = {};
            angular.forEach(factory.listeBars, function(value, key){
                if(value.id == key){
                    listebars = value;
                }
            });
            return listebars;
        },*/
	/*listeBars : false,
        
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
	}*/
       
	// Permet d'ajouter un bar
	/*addBar : function(bar){
            var deferred = $q.defer();
            /* TODO ...*/
	/*deferred.resolve();
            return deferred.promise;
        }*/
        
	}
    };
return factory;
}); // factory ListeBars
