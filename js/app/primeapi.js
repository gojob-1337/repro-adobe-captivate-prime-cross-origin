var PRIMEAPI = {

	getAccountsFromEmail : function (emailId){
		return $.ajax({
					url: Constants.PRIME_SERVER_ADDR + Constants.API_VERSION + "users/" + emailId + "/accounts",
                    crossDomain : true,
                    dataType : "json",
                    beforeSend: function(xhr) {
                                	xhr.setRequestHeader('Accept','application/vnd.api+json');
                        		}
        });
	},

	authorize : function(accId, emailId){
		window.location = Constants.PRIME_SERVER_ADDR 
										  + "oauth/o/authorize?"
										  + "client_id=" + Constants.APP_ID 
										  + "&redirect_uri=" + getEndpoint(FieldNames.REDIRECT_URL)
										  + "&account=" + accId
										  + "&email=" + emailId 
										  + "&logoutAfterAuthorize=true";
	},
		
	getRefreshToken : function(code, clientId, clientSecret){
		/* create a post body using APP_ID/CLIENT_ID, APP_SECRET/CLIENT_SECRET and oauth code */
		var data = {};
		data.code = code;
		data.client_id = clientId;
		data.client_secret = clientSecret;
		
		
		/*
		 * Send a post request to the refresh token endpoint using the above created post body.
		 * The end point will return:
		 *     i.    refresh_token
		 *     ii.   access_token
		 *	   iii.  user_id
		 *	   iv.   expires_in
		 *	   v.    user_role
		 *	   vi.   account_id
		 */
								 
		return $.post({
				type: "POST",
				url: getEndpoint(FieldNames.REFRESH_TOKEN_ENDPOINT),
				data: data
		});
	},

	getAccessToken : function(clientId, clientSecret, refreshToken){
		/* create a post body using APP_ID/CLIENT_ID, APP_SECRET/CLIENT_SECRET and refresh_token */
		var data = {};
		data.refresh_token = refreshToken;
		data.client_id = clientId;
		data.client_secret = clientSecret;
		log("refresh_token: " + data.refresh_token + ", client_id: " + data.client_id + ", client_secret: " + data.client_secret);
		/*
		 * Send a post request to the access token endpoint using the above created post body.
		 * The end point will return:
		 *     i.    refresh_token
		 *     ii.   access_token
		 *	   iii.  user_id
		 *	   iv.   expires_in
		 *	   v.    user_role
		 *	   vi.   account_id
		 */
								 
		return $.post({
				type: "POST",
				url: getEndpoint(FieldNames.ACCESS_TOKEN_ENDPOINT),
				data: data 
				});	
	},

	getUserDetails : function(access_token){
		return $.ajax({
			url: getEndpoint(FieldNames.USER_ENDPOINT),
            crossDomain : true,
            dataType : "json",
            beforeSend: function(xhr) {
                            xhr.setRequestHeader('Authorization', 'oauth '+access_token);
                            xhr.setRequestHeader('Accept','application/vnd.api+json');
            			}
			
    		});	
	},


	getEnrolledCourses : function(access_token){
		return $.ajax({
			url: getEndpoint(FieldNames.ENROLLED_COURSES),
            crossDomain : true,
            dataType : "json",
            beforeSend: function(xhr) {
                        	xhr.setRequestHeader('Authorization', 'oauth '+access_token);
                        	xhr.setRequestHeader('Accept','application/vnd.api+json');
            			}
            	
		});
	},

	getEmbeddablePlayerUrl : function(courseId){
		return Constants.PRIME_SERVER_ADDR 
	                    + 'app/player?lo_id=' + courseId
						+ '&access_token=' + CLIENT_CACHE.getAccessToken();
	}





};

