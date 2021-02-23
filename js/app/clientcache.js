var CLIENT_CACHE = {

	/*
	*	Save access_token, refresh_token and other information in DB with proper encryption
	*	Here it is saved in localStorage for demo purpose only
	*/
	saveCredentials : function(access_token, refresh_token, user_id, access_token_creation_timestamp){
		localStorage.setItem(FieldNames.ACCESS_TOKEN, access_token);
		localStorage.setItem(FieldNames.REFRESH_TOKEN, refresh_token);
		localStorage.setItem(FieldNames.USER_ID, user_id);
		localStorage.setItem(FieldNames.ACCESS_TOKEN_TIMESTAMP, access_token_creation_timestamp);
	},

	/*
	*	access_token_timestamp can also be cached for better performance.
	*/
	getAccessTokenTimeStamp : function(){
		return localStorage.getItem(FieldNames.ACCESS_TOKEN_TIMESTAMP);
	},

	/*
	*	refresh_token can also be cached for better performance.
	*/
	getRefreshToken : function(){
		return localStorage.getItem(FieldNames.REFRESH_TOKEN);
	},

	/*
	*	access_token can also be cached for better performance.
	*/
	getAccessToken : function(){
		return localStorage.getItem(FieldNames.ACCESS_TOKEN);
	},

	getUserId : function(){
		return localStorage.getItem(FieldNames.USER_ID);
	}
};