
Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	return value && JSON.parse(value);
}
function waitshow() {
	$('#wait').show();
}
function waithide() {
	$('#wait').hide();
}
  /***** START BOILERPLATE CODE: Load client library, authorize user. *****/

  // Global variables for GoogleAuth object, auth status.
  var GoogleAuth;
  var allSubs = new Array();
  var itemNum;
  var current = 0;
  var allVideosPerChannel = {};
  var inserted = false;
  var videoarray = [];
  var catarray = [];
  var fakeData = {};
  fakeData["movie"] = ['UCCqy0xMHSGbQKpe-z1gIOhQ','UCi8e0iOVk1fEOogdfu4YgfA','UCLyYEq4ODlw3OD9qhGqwimw', 'UCgH1T_Pnjg8FPHcYGbglBpw', 'UC3gNmTGu-TTbFPpfSs5kNkg','UCkR0GY0ue02aMyM-oxwgg9g', 'UCt8mg-YL_ikTAJKuZ8GMtqg'];
  fakeData["music"] = ['UCKI33Zd-b17rDIcPSv9E_-w', 'UCStpPtoeQUYII1Jsbl0qf8A','UC5H_KXkPbEsGs0tFt8R35mA','UCPcF3KTqhD67ADkukx_OeDg', 'UC0C-w0YjGpqDXGB8IHb662A', 'UCAWnuGH5fKJKM-DiWrdbgJA', 'UCJrOtniJ0-NWz37R30urifQ', 'UC7ovu6a8ydIbDy0fAKmoZ9A', 'UCKUlsqazP-4QmxdEtUPlxOA', 'UCd91HSXKhsIv8PIjNrDByHQ', 'UCgQ8olRhkepJWlVF9IVmPGQ'];
  fakeData["tutorial"] = ['UCEpe5DhhS0HYFBaCVsU2Iwg','UCCezIgC97PvUuR4_gbFUs5g', 'UCEBb1b_L6zDS3xTUrIALZOw'];
  fakeData["youtuber"] = ['UCxUzQ3wu0oJP_8YLWt71WgQ','UC0NFqwYXVztcVxWqYcfQ4SQ','UCIF_gt4BfsWyM_2GOcKXyEQ', 'UCzIiv_eC7m8bpRTFNbiJpOA', 'UCChByo3iYdAtM54WzptEPkg'];

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
        'clientId': '470608578271-mn7c0bbbgbm05gklhokbeo8hluqfc1ai.apps.googleusercontent.com',
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

  function catContent() {
	  $('#sidebarCollapse1').click();
	  $("#view-content").empty();
	  $("#view-content").append(catarray.join(''));
  }

function playVideo(videoID) {
	$('#player').show();
	$('#subplayer').show();
	$('.overlay').addClass('active');
	$('#subplayer').attr("src", "http://www.youtube.com/embed/" + videoID + "?version=3&enablejsapi=1");
}
  
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function addCat() {
	  name=$("#keyword").val();
	  $("#keyword").val("");
	  $("#Catmenu").append('<li><a href="#anchor'+name+'" onclick="anchorjump()">'+name+'</li>');	
	  waitshow();
	  await sleep(1000 + Math.random() * 1000);
	  waithide();
	  addCatHelper(name);
	  catContent();
	  await sleep(250);
	jump("anchor"+name);
  }

function anchorjump(){
	catContent();
}
function jump(h){
	var top = document.getElementById(h).offsetTop; //Getting Y of target element
	window.scrollTo(0, top);                        //Go there directly or some transition
}

  function addCatHelper(name) {
	catarray.push('<div class="cat-wrapper">');
	catarray.push('<div class="row cat-line">');
	catarray.push('<div class="col"><h3>'+name.toUpperCase()+'</h3></div></div>');	
	catarray.push('<a class="anchor" id="anchor'+name+'"></a>');	
	for (var i = 0; i  < fakeData[name].length; i++) {
		var id = fakeData[name][i];
		catarray.push('<div class="row cat-pad">');
		for (var j = 0; j < allVideosPerChannel[id].items.length && j < 3; j++) {
			catarray.push('<div class="col">');
			catarray.push('<img onclick="playVideo(\''+allVideosPerChannel[id].items[j].id.videoId+'\')" class="center-item img-fluid vi" src="'+ allVideosPerChannel[id].items[j].snippet.thumbnails.medium.url +'">');
			catarray.push('<div class="cat-details center-item bottom-dark">');
			catarray.push('<span>');
			catarray.push(allVideosPerChannel[id].items[j].snippet.title);
			catarray.push('</span>');
			catarray.push('</div>');
			catarray.push('</div>');
		}
		catarray.push('</div>');
		//Do not append directly, we have to have good-formatted div for append to parse.
	}
	catarray.push('</div>');
	console.log("add a cat");
  }
  
  function initCatPage() {
	  catarray.push('<div class="row">');
	  catarray.push('<div class="col">');
	  catarray.push('<form>');
	  catarray.push('<div class="form-group">');
	  catarray.push('<input type="text" id="keyword" class="form-control" placeholder="Enter what you want to watch">');
	  catarray.push('</div>');
	  catarray.push('<button onclick="addCat()" class="btn btn-primary">Submit</button>');
	  catarray.push('</form>');
	  catarray.push('</div>');
	  catarray.push('</div>');
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
			  arrangeAllsubs();
		  }
	  });
  }

  function arrangeAllsubs() {
	  allSubs = uniq(allSubs);
	  if (localStorage.getObject("allSubs") === null) {
		  allSubs.splice(1, 1);
	  }
	  itemNum = allSubs.length;
	  addSub(allSubs);
	  localStorage.setObject("allSubs", allSubs);
	  getAllVideosPerChannel();
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
	  if (localStorage.getObject("allSubs") === null) {
		  console.log("A");
		  executeSubRequest(request); 
	  } else {
		  console.log("B");
		  allSubs = localStorage.getObject("allSubs");
		  arrangeAllsubs();
	  }
  }

  function getAllVideosPerChannel() {
	  if (localStorage.getObject("allVideos") === null) {
		  console.log("AV");
		  for (var i = 0; i < allSubs.length; i++) {
			  var id = allSubs[i].snippet.resourceId.channelId;
			  var request = defineVideoRequest(id);
			  executeVideoRequest(id, request);
		  } 
	  } else {
		  console.log("BV");
		  allVideosPerChannel = localStorage.getObject("allVideos");
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


  function addChannelContent() {
	  $('#sidebarCollapse1').click();
	  $("#view-content").empty();
	  if (inserted == false) {
		  for (var i = 0; i  < allSubs.length; i++) {
			  videoarray.push('<div class="video-wrapper">');
			  videoarray.push('<div class="row video-line">');
			  videoarray.push('<div class="col"> <img class="img-thumbnails" src="' + allSubs[i].snippet.thumbnails.default.url + '"> <span>'+allSubs[i].snippet.title+'</span></div></div>');	
			  var id = allSubs[i].snippet.resourceId.channelId;
			  videoarray.push('<div class="row">');
			  for (var j = 0; j < allVideosPerChannel[id].items.length && j < 3; j++) {
				  videoarray.push('<div class="col">');
				  videoarray.push('<img onclick="playVideo(\''+allVideosPerChannel[id].items[j].id.videoId+'\')" class="center-item img-fluid vi" src="'+ allVideosPerChannel[id].items[j].snippet.thumbnails.medium.url +'">');
				  videoarray.push('<div class="details center-item bottom-dark">');
				  videoarray.push('<span>');
				  videoarray.push(allVideosPerChannel[id].items[j].snippet.title);
				  videoarray.push('</span>');
				  videoarray.push('</div>');
				  videoarray.push('</div>');
			  }
			  videoarray.push('</div>');
			  videoarray.push('</div>');
			  //Do not append directly, we have to have good-formatted div for append to parse.
		  }
		  $("#view-content").append(videoarray.join(''));
		  inserted = true;
	  } else {
		  $("#view-content").append(videoarray.join(''));
	  }
  }
	
