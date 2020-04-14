class YThandler {
  constructor(apiKey, authKey) {
    this.apiKey = apiKey;
    this.authKey = authKey;
  }
  fetch(resource, option, parms) {
    let basicURL = 'https://content.googleapis.com/youtube/v3';
    let queryString = YThandler.toQueryString(parms);
    let requestURL = `${basicURL}/${resource}?${encodeURI(queryString)}`
    return fetch(requestURL, option)
  }

  /**
   * @param {string} resource comments/playlistItems/commentThreads/etc.
   * @param {string} parms Queries go here (like, key, part, fields)
   */
  get(resource, parms) {
    return this.fetch(resource, YThandler.jsonOption, parms)
    .then(res => res.json())
  }
  
  /**
   * @param {string} videoId you can put video url or vidoe id
   */
  getComments(videoId) {
    let parms = {
      key: this.apiKey,
      part: 'snippet',
      videoId: YThandler.getVidId(videoId),
    }
    return this.get('commentThreads', parms)
  }
  
  getListItems(playlistId) {
    let parms = {
      key: this.apiKey,
      playlistId: playlistId,
      part: 'snippet',
      maxResults: '50'
    }
    return this.get('playlistItems', parms)
  }

  getPlayLists(channelId) {
    let parms = {
      key: this.apiKey,
      channelId: channelId,
      part: 'snippet',
      maxResults: '50'
    }
    return this.get('playlists', parms)
  }

  getSearchList(keyword) {
    let parms = {
      key: this.apiKey,
      q: keyword,
      part: 'snippet',
      maxResults: '50'
    }
    return this.get('search', parms)
  }

  static jsonOption = {
    'Content-Type': 'application/json'
  }

  static getVidId(urlOrVideoId) {
    let searchingStr = 'watch?v=';
    let index = urlOrVideoId.indexOf(searchingStr);
    return index < 0 ? 
      urlOrVideoId : urlOrVideoId.slice(index + searchingStr.length);
  }

  static toQueryString(parms) {
    let queryString = Object.keys(parms).reduce((queries, key) => {
      if (parms[key] !== undefined) {
        let newQuery = `${key}=${parms[key]}&`
        queries = queries.concat(newQuery);
      }
      return queries;
    }, '');
    return queryString
  }
}

let apikey = 'API_KEY';
let authKey = 'OAUTH2_KEY/CLIENT_KEY';
let channelId = 'CHANNEL_ID';

let ytHandler = new YThandler(apikey, authKey, channelId);
//get comments for specified video
ytHandler.getComments('O4gQAQBWhBs')
.then(json => console.log(json));
//get list itmes for specified list
ytHandler.getListItems('PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG')
.then(json => console.log(json));
//get playlists for specified channel
ytHandler.getPlayLists('UC-J-KZfRV8c13fOCkhXdLiQ')
.then(json => console.log(json));
//get search results for specified keyword
ytHandler.getSearchList('Hoooray!')
.then(json => console.log(json));

