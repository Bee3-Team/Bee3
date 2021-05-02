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

    let song = null;
    
    song = await this.VideoPlaylist(voiceChannel, textChannel, id, query).catch(e => {
      textChannel ? textChannel.send(e.message.toString()) : new TypeError(e.message);
      return;
    });
    
    if (!song) return;

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
      if (voiceChannel.id !== serverQueue.voiceChannel.id) return this.emit("notSameChannel", textChannel);
      
      serverQueue.songs.push(song);
      this.emit("trackAdded", song, textChannel);
    }
  }

  async VideoPlaylist(voiceChannel, textChannel, id, query) {
    if (!query) throw new TypeError("Need a query to search song/playlist.")
    
    let song, isVideoURL, isPlaylistURL;
    
    isPlaylistURL = await this.validatePlaylistURL(query);
    isVideoURL = await this.validateVideoURL(query);
    
    if (isPlaylistURL) {
      
      // playlist
      return this.handlePlaylist(voiceChannel, textChannel, id, query);
      
    } else if (isVideoURL) {
      
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
  
  async handlePlaylist(voiceChannel, textChannel, id, query) {
    let isPlaylist, playlist = null, videos = [], serverQueue, playlistVideos = [];
    
    serverQueue = this.queue.get(id);
    
    
    isPlaylist = await this.validatePlaylistURL(query);
    
    if (isPlaylist) {
      
      // if playlist url.
      playlist = await youtube.getPlaylist(query, {part: "snippet"});
      
      if (!playlist) {
        throw new TypeError("Cannot optain result with this query.");
      }
  
    } else {
      
      const searchPlaylist = await youtube.searchPlaylists(query, 1, {part: "snippet"});
      
      if (!searchPlaylist[0]) {
        throw new TypeError("Cannot optain result with this query.");
      }
      
      playlist = searchPlaylist[0]
      
    }
    
    
      videos = await playlist.getVideos(100, {part: "snippet"});
      let newSongs = [];  
    
      videos
      .filter((video) => video.title != "Private video" && video.title != "Deleted video")
      .map(async (video) => {
        let songInfo = await ytdl.getInfo(video.url);
        
        return newSongs.push({
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        })
      }); 
    
    
    
    setTimeout(async () => {
    
      this.emit("playlistAdded", playlist, textChannel);
      
    let Constructor = {
      connection: null,
      songs: newSongs,
      volume: this.option.volume,
      playing: true,
      loop: false,
      voiceChannel: voiceChannel,
      textChannel
    };   
      
      if (serverQueue) {
        return serverQueue.songs.push(...newSongs);
      }
      
  
    if (!serverQueue) {
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
    }
    }, 500)
    
  }

  async canModify(voiceChannel, textChannel = null) {
    if (!voiceChannel) {
      if (textChannel) {
        return textChannel.send(`Please join a voice channel.`);
      } else {
        throw new TypeError("Please join a voice channel.");
      }
    }
    
    try {
      
      if (!voiceChannel.guild.me.voice.channel) {
        return false;
      }
      
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id)  return this.emit("notSameChannel", textChannel);
      
      return true;
      
    } catch (e) {
      throw new TypeError(e)
    }
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
