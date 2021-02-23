# Learner-Custom-Web-Application
## Documentation of the usage of public-api through Sample Application



### A Step by Step Guide to build a Learner Application Using Captivate-Prime Public-API


## 1.	Aim of the tutorial

Primary focus of this tutorial is to learn “how to get refresh token, access token and use captivate prime embeddable player in one’s own learner application”. 
The sample application is also here for the developer’s reference which shows how to use public-api and embeddable player in their own custom learner application.

## 2.	Building Application

Building a custom application using public-api involves three basic steps:
i.	Create an application in integration admin app of captivate prime
ii.	Retrieving Access token
iii.	Use access token to retrieve resources from captivate prime using public-api  

> •Custom Applications can also make use of embeddable player to play the content of a learning object.

##### 2.i. Create an application in integration admin app of captivate prime
This step is required to create an application/client id and application/client secret which is used to retrieve refresh token and access token.
Go to integration admin app of captivate prime, Select “Applications” in the left Pane, Select “register”.
Save the form registration form after filling it. If form is filled correctly, the application will be created with application id and application secret.
 


##### 2.ii. Retrieving Access Token
Access Token is required to retrieve resources from captivate prime using public-api as it uses OAUTH2.0.
Access Token can be fetched using refresh token, client id and client secret (client id and client secret is already obtained in step 2.i.).
##### 2.ii.a. Refresh Token:

##### [a.i.] Retrieve OAuth Code 

Oauth code is required to retrieve refresh token.
Captivate Prime redirects the user to the redirection URL with the Oauth code when signed-in through the below url (Oauth code extraction is exemplified in the “oauthredirect.html” file in the sample application):
             
	    
	     https://captivateprime.adobe.com/oauth/o/authorize
				   client_id= <application_id>
				   &redirect_uri=<redirect_uri>
				   &state=<dummy_data>
				   &scope=learner:read,learner:write
				   &response_type=CODE
				   &account=<account_id>
				   &email=<email_id>
	     
			   
Here client id is the application id obtained in step **2.i**.  
          redirect_uri is the redirect_uri set in step **2.i**.  
          state is any dummy data based upon which we need to filter redirect url to get oauth code  
          scope is learner scope set in Step 2.i.  
          response_type is always “CODE”  
          account is an optional field  
          email is an optional field  
if both account id and email is provided, the above url will allow the user to login into his same account. This end point example is depicted in “index.html” file in the sample application.
               
##### [a.ii.] Send a post request to the prime with oauth code, Client id and Client secret as a post body to get the Refresh Token
  After getting oauth code, send a post request with oauth code (obtained in step a.i), client_id and client_secret to the below    
  endpoint:
  **https://captivateprime.adobe.com/oauth/token**  
   Response of this end point will return:
	i.    refresh_token  
	ii.   access_token  
	iii.  user_id  
	iv.   expires_in  
	v.    user_role  
	vi.   account_id  

##### b. Retrieving access token from refresh token
Send a post request with refresh_token, client_id and client_secret as a post body to the below url:
**https://captivateprime.adobe.com/oauth/token/refresh**  
Response of this end point will return:
	i.    refresh_token  
	ii.   access_token  
	iii.  user_id  
	iv.   expires_in  
	v.    user_role  
	vi.   account_id  



##### 2.iii. Use access token to retrieve resources from captivate prime using public-api
Access token is required to make any public-api calls. Access token is required to be added in the header as exemplified in the sample application.



### Embeddable Player
Custom Applications can also make use of embeddable player to play the content of a learning object.
Open a course in embeddable player:
#### i. Create an embeddable url as given below:
Embeddable url to play a course:
```javascript
https://captivateprime.adobe.com/app/player?
                                   lo_id=<v2-api course id>
                                   &access_token=<access_token>
```
Here lo_id needs to comply to the V2 api course id format.  
**Example:**

> https://captivateprime.adobe.com/app/player?lo_id=course:123456&access_token= 45b269b75ac65d6696d53617f512450f     

#### ii. Set this url in the “src” attribute of iframe.

**Closing embeddable player:**
```javascript
window.addEventListener("message", function closePlayer(){
	if(event.data === "status:close"){
		//handle closing event
		}
});
```

             


## 3. Sample Application

Sample application demonstrates the following features:
1.	Login through Captivate Prime Authentication 
2.	Getting Refresh Token and Access Token
3.	Retrieving courses using access token
4.	Playing course in embeddable player
5.	Closing embeddable player

### 3.i. Pre-Requisite to run the sample application:
#### 3.i.i Installing WAMP and hosting Sample Application:
In order to run the Sample Application, the folder (PrimeApp) containing Sample Application source files needs to be hosted (Place this folder inside www directory of your WAMP installation directory). To run it locally, any localhost servers viz. WAMP or XAMPP or any other http servers can be used. Here we are taking WAMP as a local server for tutorial purpose.
Install WAMP and make sure apache, PHP and mysql servers are running.  
**App is suitable in chrome browser.**

#### 3.i.ii. Update Constants Object field in constants.js file:
Check constants.js file of the Sample Application where variable “Constants” is defined.

```javascript
var Constants = {
	THRESHOLD_BUFFER_TIME_MS  :  (12 * 60 * 60 * 1000) ,
	APP_SECRET  :  "bf908d1f-6a90-4fd3-8c17-a04840bba1d6",  //update this field
	APP_ID  :  "5595bd7e-d5b7-46f4-a631-af39991d12c8", //update this field
	PRIME_SERVER_ADDR  :  "https://captivateprime.adobe.com/", 
	MY_APP_HOSTED_SERVER_BASE_ADDR  :  "http://localhost:8085/", //update this field
	SCOPE  :  "learner:read,learner:write",
	OCODE_DATA  :  "state1",
	SOURCE_FOLDER  :  "PrimeApp/",
	MAIN_PAGE  :  "oauthredirect.html",
	START_PAGE : "index.html",
	API_VERSION: "primeapi/v2/",
	DEFAULT_LO_TYPE : "course"
};
```

#### 3.i.iii. Create Application in Integration Admin App:

 Follow directives **2.i.** to create application in Integration Admin App.  
 However below two points are to be noted as the application is going to be hosted in local server for demonstration puropose:  
 Redirect_uri domain :    **http://localhost:8085**   (as application is hosted on localhost for demo purpose)  
	We can see, port is 8085 which should also be the port on the local machine where WAMP server running.  
 Learner possible Scope  :  **learner:read,learner:write**  

#### 3.ii. Running Sample Application:
If all Steps of 3.i is properly done and WAMP Server is up, Just hit **http://localhost:8085/index.html** in your chrome Browser. Enter your email id linked to your Captivate Prime account and select the account of your preference in the next step.  
Now login to your captivate prime account by entering credentials will sign in the user into the Sample application.

#### 3.iii.  Sample Application - Code Walkthrough 

##### A. Login through Captivate Prime Authentication 
Login through captivate prime authentication requires client id, redirect_uri, accountId and emailId as demonstrated in the sample application. This will redirect to the Captivate prime Login Page.

```javascript
function redirecttoCPLogin(index)
{

	let ac = accounts[index];
	window.location =   
	  `https://captivateprime.adobe.com/oauth/o/authorize
	   client_id= <application_id>
	   &redirect_uri=<redirect_uri>
	   &state=<dummy_data>
	   &scope=learner:read,learner:write
	   &response_type=CODE
	   &account=account.id
	   &email=emaild`
};
```

After successful login, get the CODE from the redirect url.




##### B. Getting Refresh Token and Access Token

```javascript
//Getting refresh token
function getRefreshTokenAndFetchData()
{
	var code = getUrlParameter('code');
	var data = {};
	data.code = code; //code received after redirection from the server
	data.client_id = Constants.APP_ID; //your application id
	data.client_secret = Constants.APP_SECRET; //your application secret			 
	$.post({
		type: "POST",
		url: “https://captivateprime.adobe.com/oauth/token”
		data: data,
		success: function(data)
		{
		   invokeAPIs(); //retrieve resources after successful invocation of refresh and access token
		}
		})
		.fail(function(response) {
			log('Error: ' + response.responseText);
		});
}
       
       
//Getting access token
function getAccessTokenAndFetchData()
{	
        var data = {};
        data.client_id = Constants.APP_ID; //your application id
	data.client_secret = Constants.APP_SECRET; //your application secret	
	data.refresh_token = CLIENT_CACHE.getRefreshToken(); //your application refresh token
	$.post({
		type: "POST",
		url: “https://captivateprime.adobe.com/oauth/token/refresh”,
		data: data,
		success: function(data)
		{
		   invokeAPIs(); //retrieve resources after successful invocation of refresh and access token
		}
		})
		.fail(function(response) {
			console.log("Exception caught while fetching access token");
		});
}

```





> Here data contains OAUTH details of the format of   
	{  
	  "access_token": "95b93757d41d945109d73a4782804d99",  
	  "refresh_token": "c64ef82e15b90283d146aa720fab57f9",  
	  "user_role": "learner",  
	  "account_id": "1234",  
	  "user_id": "5764678",  
	  "expires_in": 604799  
	}  
Since we have access_token, we can fetch other resources using invokeApi() method.

#### C.	Retrieving courses using access token
Resources can be fetched using access_token as exemplified in the code below:

```javascript
function getCourses()
{
   $.ajax({
	url: "https://captivateprime.adobe.com/primeapi/v2/learningObjects?	
	             include=enrollment,instances.loResources&filter.loTypes=course",
	crossDomain : true,
	dataType : "json",
	beforeSend: function(xhr) {
		xhr.setRequestHeader('Authorization', 'oauth '+access_token);
		xhr.setRequestHeader('Accept','application/vnd.api+json');
	},
	success: function(lData){
		//lData contains enrolled courses 
		jQuery.each(lData.data,function(index,obj){
				//iterate over data
			});
		jQuery.each(lData.included,function(index,obj){
				//iterate over include data 
			   }
			);
		},
		error: function (errormessage) {
			console.log("error: " + errormessage);
		}
	}
);
}

```		





#### D.	Playing course in embeddable player
Using Captivate Prime embeddable player in custom application is quite easy. Please look at the code snippet below for its usage:

```javascript
function playCourseUsingEmbeddablePlayer(courseId, iframeId, width, height)
{
	//Just get the embeddable player url by supplying course id and access token as shown below
	var url = 'https://captivateprime.adobe.com/app/player?lo_id=’ + courseId + ‘&access_token='+access_token;
	//courseId here is in the format of “course:123456” i.e. v2 api learningObject format
	//Assign attributes to your iframe where embeddable player needs to be fit
	$(iframeId).attr("height", height);
	$(iframeId).attr("width", width);
	$(iframeId).attr("src", url);
	$(iframeId).attr("style","display:block");
}

```

#### E.	Closing embeddable player

Closing an embeddable player is as easy as  handling the closing event of iframe. Please see the code snippet below:

```javascript
window.addEventListener("message", function closePlayer(){
	if(event.data === "status:close"){
		$("#samePagePlayerDisplayIframeId").attr('src', 'about:blank');
		$("#samePagePlayerDisplayIframeId").hide();
	}
}); 
```


