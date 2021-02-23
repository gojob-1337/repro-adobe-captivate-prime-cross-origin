/*
*	method to check whether access token is expired.
*	Here For demo purpose, we declare access token expired 12 hourse before it gets actually expired
*/

function isAccessTokenExpired()
{
	var access_token_creation_timestamp = CLIENT_CACHE.getAccessTokenTimeStamp();
	if(isEmpty(access_token_creation_timestamp))
		return true;

	createTimestampInMS = Number(access_token_creation_timestamp);
	curTimestampInMS = getCurrentTimeMillis();
	diff = curTimestampInMS - createTimestampInMS ;
	
	log("AccessToken: createdAt(ms): " + createTimestampInMS
			+ ", curTimestamp(ms): " + curTimestampInMS
			+ ", diff : " + diff
			+ ", shouldFetch: " + (diff >= Constants.THRESHOLD_BUFFER_TIME_MS));
	return diff >= Constants.THRESHOLD_BUFFER_TIME_MS ;
}




function isEmpty(value)
{
	return value=="undefined" || value==null || new String(value).length==0 ? true : false;
}



function getCurrentTimeMillis()
{
	return new Date().getTime();
}


function getValue(value)
{
	return isEmpty(value) ? "" : value;
}


function isFirstTimeLogin()
{
	return isEmpty(CLIENT_CACHE.getRefreshToken());
}


function getUrlParameter(sParam) 
{
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	sURLVariables = sPageURL.split('&'),
	sParameterName,
	i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
}




function getEndpoint(endpoint)
{
	var url = null;
	switch(endpoint)
	{
		case FieldNames.REFRESH_TOKEN_ENDPOINT:
			url = Constants.PRIME_SERVER_ADDR + "oauth/token";
			break;
		case FieldNames.ACCESS_TOKEN_ENDPOINT:
			url = Constants.PRIME_SERVER_ADDR + "oauth/token/refresh";
			break;
		case FieldNames.REDIRECT_URL:
			 url = Constants.MY_APP_HOSTED_SERVER_BASE_ADDR 
						+ Constants.SOURCE_FOLDER 
						+ Constants.MAIN_PAGE 
						+ "&state=" + Constants.OCODE_DATA 
						+ "&scope=" + Constants.SCOPE 
						+ "&response_type=CODE";
			 break;
		case FieldNames.HOSTED_START_PAGE_ADDR:
		     url = Constants.MY_APP_HOSTED_SERVER_BASE_ADDR 
					    + Constants.SOURCE_FOLDER 
					    + Constants.START_PAGE; 
			 break;
		case FieldNames.HOSTED_MAIN_PAGE_ADDR:
		     url = Constants.MY_APP_HOSTED_SERVER_BASE_ADDR 
					    + Constants.SOURCE_FOLDER 
					    + Constants.MAIN_PAGE; 
			 break;
		case FieldNames.ENROLLED_COURSES:
		      url = Constants.PRIME_SERVER_ADDR 
						+ Constants.API_VERSION 
						+ "learningObjects?include=enrollment,instances.loResources&filter.loTypes=" + Constants.DEFAULT_LO_TYPE;
			 break;
	    case FieldNames.USER_ENDPOINT:
		      url = Constants.PRIME_SERVER_ADDR
			            + Constants.API_VERSION
						+ "users/"+ CLIENT_CACHE.getUserId();
			 break;
		      
	}
	log(url);
	return url;
}



function isEmail(email) {
	var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
	return pattern.test(email);
}



function log(string){
	var logEnabled = true;
	if(logEnabled)
	{
		console.log("Captivate Prime Demo App: " + string);
	}
}	
