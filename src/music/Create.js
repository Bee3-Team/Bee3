const MusicRoutes = require("./Routes.js");
const ytdl = require("ytdl-core");
const MusicConfig = require("./Config.js");
const YouTube = require("simple-youtube-api");
const config = require("../other/config.js");
const youtube = new YouTube(config.yt);

class CreateMusic extends MusicRoutes {
  constructor(client, option) {
    super();

    this.option = option;
    this.queue = new Map();
    this.client = client;
  }

  getQueue(id) {
    return this.queue.get(id) || null;
  }

  getGuild(id) {
    return this.client.guilds.cache.get(id) || undefined;
  }

  async handle(voiceChannel, id, query) {
    let guild = await this.getGuild(id);
    if (!guild) throw new TypeError("Cannot find this guild.");

    let check = await this.getQueue(id);
    if (check) throw new TypeError("This server is playing songs.");

    let song = await this.VideoPlaylist(query);

    const Constructor = {
      connection: null,
      songs: [],
      volume: this.option.volume,
      playing: true,
      loop: false
    };

    Constructor.songs.push(song);
    this.queue.set(id, constructor);
  }

  async VideoPlaylist(query) {
    if (!query) throw new Error("Need a query to search song.");
    
    let song;
    
    if (this.validatePlaylistURL(query)) {
      
      // playlist
      return this.handlePlaylist(query);
      
    } else if (this.validateVideoURL(query)) {
      
      // video
      const songInfo = await ytdl.getInfo(query);
      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        duration: songInfo.videoDetails.lengthSeconds
      }
      
    } else {
      
      // if not playlist and video: search.
      
      let result = await youtube.searchVideos(query, 1, {part: "snippet"});
      
      const songInfo = await ytdl.getInfo(result[0].url);
      
      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        duration: songInfo.videoDetails.lengthSeconds
      }      
      
    }
    
    // callback.
    return song;
  }

  async validateVideoURL(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
      return true;
    }
    return false;
  }

  async validatePlaylistURL(url) {
    var p = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;
    if (url.match(p)) {
      return true;
    }
    return false;
  }
}

module.exports = CreateMusic;
