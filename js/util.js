
//All Variables

var coursesFetched = [];
var access_token = null;
var user_id = null;


		


var logEnabled = true;


//All TAGS

var FieldNames =
{
	ACCESS_TOKEN : "access_token",
	REFRESH_TOKEN : "refresh_token",
	ACCESS_TOKEN_TIMESTAMP : "access_token_timestamp",
	ACCESS_TOKEN_ENDPOINT: "ACCESS_TOKEN_ENDPOINT",
	REFRESH_TOKEN_ENDPOINT: "REFRESH_TOKEN_ENDPOINT",
	HOSTED_START_PAGE_ADDR: "HOSTED_MAIN_PAGE_ADDRESS",
	HOSTED_MAIN_PAGE_ADDR : "HOSTED_MAIN_PAGE_ADDR",
	ENROLLED_COURSES: "ENROLLED_COURSES",
	USER_ENDPOINT: "USER_ENDPOINT",
	REDIRECT_URL: "REDIRECT_URL",
	USER_ID: "user_id"
};




/*
Save your APP_SECRET and APP_ID in a secured DB
Check your APP_SECRET and APP_ID in your Application created in Integration admin application section.
*/

var Constants =
{
	THRESHOLD_BUFFER_TIME_MS  :  (12 * 60 * 60 * 1000) ,
	APP_SECRET  :  "bf908d1f-6a90-4fd3-8c17-a04840bba1d6", 
	APP_ID  :  "5595bd7e-d5b7-46f4-a631-af39991d12c8",
	PRIME_SERVER_ADDR  :  "https://captivateprime.adobe.com/", 
	MY_APP_HOSTED_SERVER_BASE_ADDR  :  "http://localhost:8085/",
	SCOPE  :  "learner:read,learner:write",
	OCODE_DATA  :  "state1",
	SOURCE_FOLDER  :  "PrimeApp/",
	MAIN_PAGE  :  "main.html",
	START_PAGE : "index.html",
	API_VERSION: "primeapi/v2/",
	DEFAULT_LO_TYPE : "course"
};

function CourseObject(){}



/*
*	access_token can also be cached for better performance.
*/

function getAccessToken()
{
	return localStorage.getItem(FieldNames.ACCESS_TOKEN);
}




/*
*	refresh_token can also be cached for better performance.
*/
function getRefreshToken()
{
	return localStorage.getItem(FieldNames.REFRESH_TOKEN);
}




/*
*	access_token_timestamp can also be cached for better performance.
*/

function getAccessTokenTimeStamp()
{
	return localStorage.getItem(FieldNames.ACCESS_TOKEN_TIMESTAMP);
}
 

/*
*	Save access_token, refresh_token and other information in DB with proper encryption
*	Here it is saved in localStorage for demo purpose only
*/
 
function saveCredentials(access_token,
						 refresh_token,
						 user_id,
						 access_token_creation_timestamp)
{
	localStorage.setItem(FieldNames.ACCESS_TOKEN, access_token);
	localStorage.setItem(FieldNames.REFRESH_TOKEN, refresh_token);
	localStorage.setItem(FieldNames.USER_ID, user_id);
	localStorage.setItem(FieldNames.ACCESS_TOKEN_TIMESTAMP, access_token_creation_timestamp);
}





/*
*	method to check whether access token is expired.
*	Here For demo purpose, we declare access token expired 12 hourse before it gets actually expired
*/

function isAccessTokenExpired()
{
	var access_token_creation_timestamp = getAccessTokenTimeStamp();
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



function getUserId()
{
	return localStorage.getItem(FieldNames.USER_ID);
}



function isFirstTimeLogin()
{
	return isEmpty(getRefreshToken());
}



replaceAll = function (str, find, replace) 
{
	var string = new String(str);
	return string.replace(new RegExp(find, 'g'), replace);
}
	


	
isLink = function(msg, index)
{
	if(index >= 0 && msg.charAt(index) == "{")
		return 1;
	return 0;	
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
						+ "users/"+ getUserId();
			 break;
		      
	}
	log(url);
	return url;
}

function getEmbeddablePlayerUrl(courseId)
{
	return Constants.PRIME_SERVER_ADDR 
	                    + 'app/player?lo_id=' + courseId
						+ '&access_token=' + getAccessToken();
}

function getAccountsFromEmail(emailid)
{
	return Constants.PRIME_SERVER_ADDR + Constants.API_VERSION + "users/" + emailid + "/accounts";
}


function isEmail(email) {
	var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
	return pattern.test(email);
}



function log(string)
{
	if(logEnabled)
	{
		console.log("Captivate Prime Demo App: " + string);
	}
}	
