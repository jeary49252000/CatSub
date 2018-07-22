
  /***** START BOILERPLATE CODE: Load client library, authorize user. *****/

  // Global variables for GoogleAuth object, auth status.
  var GoogleAuth;
  var allSubs = new Array();
  var itemNum;
  var current = 0;
  var allVideosPerChannel = {};
  var inserted = false;
  var videoarray = [];

  /**
   * Load the API's client and auth2 modules.
   * Call the initClient function after the modules load.
   */
  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes

    gapi.client.init({
        'clientId': '',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner'
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      setSigninStatus();

      // Call handleAuthClick function when user clicks on "Authorize" button.
      $('#execute-request-button').click(function() {
        handleAuthClick(event);
      }); 
    });
  }

  function handleAuthClick(event) {
    // Sign user in after click on auth button.
    GoogleAuth.signIn();
  }

  function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner');
    // Toggle button text and displayed statement based on current auth status.
    if (isAuthorized) {
      //defineRequest();
		getAllSubs();
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }

  function createResource(properties) {
    var resource = {};
    var normalizedProps = properties;
    for (var p in properties) {
      var value = properties[p];
      if (p && p.substr(-2, 2) == '[]') {
        var adjustedName = p.replace('[]', '');
        if (value) {
          normalizedProps[adjustedName] = value.split(',');
        }
        delete normalizedProps[p];
      }
    }
    for (var p in normalizedProps) {
      // Leave properties that don't have values out of inserted resource.
      if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
        var propArray = p.split('.');
        var ref = resource;
        for (var pa = 0; pa < propArray.length; pa++) {
          var key = propArray[pa];
          if (pa == propArray.length - 1) {
            ref[key] = normalizedProps[p];
          } else {
            ref = ref[key] = ref[key] || {};
          }
        }
      };
    }
    return resource;
  }

  function removeEmptyParams(params) {
    for (var p in params) {
      if (!params[p] || params[p] == 'undefined') {
        delete params[p];
      }
    }
    return params;
  }

  function addSub(allSubs) {
	  for (; current < 4; current++) {
		  $("#Submenu").append('<li><a href="#">'+allSubs[current].snippet.title+'</a></li>');	
	  }
	  $("#Submenu").append('<li class="viewmore"><a href="#" onclick="addAll(allSubs);">View More ('+itemNum+' items)</a></li>');	
  }

  function getChannelID(item) {
	  return item.snippet.resourceId.channelId;
  }

  function addAll(allSubs) {
	  $(".viewmore").remove();
	  for (; current < itemNum; current++) {
		  $("#Submenu").append('<li class="remain"><a href="#">'+allSubs[current].snippet.title+'</a></li>');	
	  }
	  $("#Submenu").append('<li class="remain"><a href="#" onclick="showLess()">Show Less</a></li>');	
  }

  function showLess() {
	  current = 4;
	  $(".remain").remove();
	  $("#Submenu").append('<li class="viewmore"><a href="#" onclick="addAll(allSubs);">View More ('+itemNum+' items)</a></li>');	
  }

  function executeSubRequest(request) { 
	  request.execute(function handle_response(response) {
		  console.log(request);
		  console.log(response);
		  allSubs = allSubs.concat(response.items);
		  console.log(allSubs);
		  if (allSubs.length <= response.pageInfo.totalResults) {
			  executeSubRequest(defineSubRequest(response.nextPageToken));
		  } else {
			  itemNum = response.pageInfo.totalResults;
			  allSubs = uniq(allSubs);
			  itemNum = allSubs.length;
			  addSub(allSubs);
			  getAllVideosPerChannel();
		  }
	  });
  }
  
  function executeVideoRequest(id, request) { 
	  request.execute(function handle_response(response) {
		  console.log(request);
		  console.log(response);
		  allVideosPerChannel[id] = response;
	  });
  }

  function uniq(a) {
	var seen = {};
	return a.filter(function(item) {
		return seen.hasOwnProperty(item.snippet.resourceId.channelId) ? false : (seen[item.snippet.resourceId.channelId] = true);
	});
  }

  function getAllSubs() {
	  var request = defineSubRequest();
	  executeSubRequest(request); 
  }

  function getAllVideosPerChannel() {
	  for (var i = 0; i < allSubs.length; i++) {
		  var id = allSubs[i].snippet.resourceId.channelId;
		  var request = defineVideoRequest(id);
		  executeVideoRequest(id, request);
	  }
  }

  function buildApiRequest(requestMethod, path, params, properties) {
    params = removeEmptyParams(params);
    var request;
    if (properties) {
      var resource = createResource(properties);
      request = gapi.client.request({
          'body': resource,
          'method': requestMethod,
          'path': path,
          'params': params
      });
    } else {
      request = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    }
    //executeRequest(request);
	return request;
  }

  /***** END BOILERPLATE CODE *****/
  function defineSubRequest(pageToken = "") {
    // See full sample for buildApiRequest() code, which is not 
    // specific to a particular API or API method.
	var params = {};
	params['mine'] = 'true';
	params['maxResults'] = '50';
	params['part'] = 'snippet,contentDetails';
	params['pageToken'] = pageToken;
	

    return buildApiRequest('GET',
                    '/youtube/v3/subscriptions',
                    params);
  }
  function defineVideoRequest(channelId = "") {
	var params = {};
	params['type'] = 'video';
	params['maxResults'] = '50';
	params['part'] = 'snippet';
	params['channelId'] = channelId;
    return buildApiRequest('GET',
                    '/youtube/v3/search',
                    params);
  }

  function addChannelContent(force = false) {
	  $('#sidebarCollapse1').click();
	  if (inserted == false) {
		  for (var i = 0; i  < allSubs.length; i++) {
			  videoarray.push('<div class="row video-line">');
			  videoarray.push('<div class="col"> <img class="img-thumbnails" src="' + allSubs[i].snippet.thumbnails.default.url + '"> <span>'+allSubs[i].snippet.title+'</span></div></div>');	
			  var id = allSubs[i].snippet.resourceId.channelId;
			  videoarray.push('<div class="row video-line">');
			  for (var j = 0; j < allVideosPerChannel[id].items.length && j < 3; j++) {
				  videoarray.push('<div class="col">');
				  videoarray.push('<img class="img-fluid vi" src="'+ allVideosPerChannel[id].items[j].snippet.thumbnails.medium.url +'">');
				  videoarray.push('<div class="details bottom-dark">');
				  videoarray.push('<span>');
				  videoarray.push(allVideosPerChannel[id].items[j].snippet.title);
				  videoarray.push('</span>');
				  videoarray.push('</div>');
				  videoarray.push('</div>');
			  }
			  videoarray.push('</div>');
			  //Do not append directly, we have to have good-formatted div for append to parse.
		  }
		  $("#view-content").append(videoarray.join(''));
		  inserted = true;
	  } else {
		  if (force) {
			  $("#view-content").append(videoarray.join(''));
		  }
	  }
  }
	
