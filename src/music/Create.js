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

  async handle(voiceChannel, textChannel = null, id, query) {
    let guild = await this.getGuild(id);
    if (!guild) {
      if (textChannel) {
        textChannel.send('Cannot find this guild.');
      } else {
        throw new TypeError("Cannot find this guild.");
      }
    }

    let serverQueue = this.queue.get(id);

    let song = await this.VideoPlaylist(query);

    if (!serverQueue) {
      const Constructor = {
        connection: null,
        songs: [],
        volume: this.option.volume,
        playing: true,
        loop: false,
        voiceChannel: voiceChannel,
        textChannel
      };

      Constructor.songs.push(song);
      this.queue.set(id, Constructor);
      const queue = this.queue.get(id);
      
      try {
        queue.connection = await voiceChannel.join();
        
        if (this.option.autoSelfDeaf) {
          await queue.connection.voice.setSelfDeaf(true);
        }
        
        this.play(textChannel, id, Constructor.songs[0]);
      } catch (e) {
        this.queue.delete(id);
        if (textChannel) {
          textChannel.send(`Error: ${e.message}`);
        } else {
          throw new TypeError(`Error: ${e.message}`)
        }
      }
      
    } else {
      
    }
  }

  async VideoPlaylist(query) {
    if (!query) throw new TypeError("Need a query to search song.");
    
    let song, isVideoURL, isPlaylistURL;
    
    isVideoURL = await this.validate
    
    if (await this.validateVideoURL(query)) {
      
      // video
      try {
        const songInfo = await ytdl.getInfo(query);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        }        
      } catch (e) {
        throw new TypeError("Cannot optain result with this query.")
      }
      
    } else {
      
      // if not playlist and video: search.
      try {
        let results = await youtube.searchVideos(query, 1, {part: "snippet"});
      
        const songInfo = await ytdl.getInfo(results[0].url);
      
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        }     
      } catch (e) {
        throw new Error("Cannot optain result with this query.")
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
