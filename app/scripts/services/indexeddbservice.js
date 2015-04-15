define(['./module'],function(services){
    'use strict';
	services.factory("indexedDbService",['$q',function($q){
		var _db;
		var _init = function() {
			var deferred = $q.defer();			
			if(_db) {
			  deferred.resolve(_db);
			  return deferred.promise;
			}	
			var openRequest = window.indexedDB.open("testdb",1);			  
		    openRequest.onerror = function(e) {
				console.log("Error opening db");
				console.dir(e);
				deferred.reject(e.toString());
		    };		
		    openRequest.onupgradeneeded = function(e){		  
				var thisDb = e.target.result;
				var objectStore;		      
				if(!thisDb.objectStoreNames.contains("config")) {
					objectStore = thisDb.createObjectStore("config",{keyPath:"name"});
					objectStore.createIndex("name", "name", { unique: true });
				}
			};
			
			openRequest.onsuccess = function(e) {
				_db = e.target.result;  
				_db.onerror = function(event) {
					// Generic error handler for all errors targeted at this database's
					// requests!
					deferred.reject("Database error: " + event.target.errorCode);
				};	  
			    deferred.resolve(_db);			    
			};
			return deferred.promise;
		};
		
		var _getAppConfig =function(name,resultIsArrary) {
			var deferred = $q.defer();		    
		    _init().then(
		    	function(db) {
			    	try{
				    	var result ;
				    	resultIsArrary?(result = []):(result = null);				 
						var transaction = db.transaction(["config"], "readonly");  
						var objectStore = transaction.objectStore("config");
						var index = objectStore.index("name");
						var cursorRequest = index.openCursor(IDBKeyRange.only(name), IDBCursor.NEXT_NO_DUPLICATE);
						cursorRequest.onsuccess = function(e) {  
				    		var cursor = e.target.result;
				    		if (cursor) {
						    	if(resultIsArrary){
						    		result.push(cursor.value.value);
						    	}else{
						    		result = cursor.value.value;
						    	}				    			
				    			cursor.continue();
				    		}
				    	};
				    	cursorRequest.onerror = function(e){
				    		console.log(e.target.error)
				    		deferred.reject(false);
				    	};
				    	
						transaction.oncomplete = function(event) {
							deferred.resolve(result);
						};
			    	}catch(e){
			    		deferred.reject(false);
			    	}
		    
		    	},
		    	function(){
		    		deferred.reject(false);
		    	}
		   );
		   return deferred.promise;
		};
		var _setAppConfig = function(name, val){
			var deferred = $q.defer();	
			_init().then(
				function(db) {
					
					_getAppConfig(name).then(
							function(){
								console.log('modify')
								var transaction = db.transaction(["config"], "readwrite");  
								var objectStore = transaction.objectStore("config");					
								var request = objectStore.put({"name":name,"value":val});
								request.onerror = function(e){
									console.log("error",e.target.error.name);
									deferred.reject(e);
								};
								request.onsuccess = function(e){
									deferred.resolve(e);
								};
							},
							function(){
								console.log('add')
								var transaction = db.transaction(["config"], "readwrite");  
								var objectStore = transaction.objectStore("config");					
								var request = objectStore.add({"name":name,"value":val},1);
								request.onerror = function(e){
									console.log("error",e.target.error.name);
									deferred.reject(e);
								};
								request.onsuccess = function(e){
									deferred.resolve(e);
								};
							}
					);					
					
				},
				function(e) {
					deferred.reject(e);
				}
			);

			return deferred.promise;
		};
		return {
			getAppConfig:_getAppConfig,
			setAppConfig:_setAppConfig
		};
		 
	}])
})









