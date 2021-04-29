const config = require("../other/config.js");
const { trackManager } = require("./trackManager.js");
const { ServerEvent } = require("./musicEvents.js");
const { client } = require("../client/index.js");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtubeApi = new YouTubeAPI(config.yt);

class ServerQueue extends trackManager {
  constructor(
    website = false,
    message,
    song,
    youtube = false,
    playlist = false
  ) {
    super();

    if (playlist) return this.playlist(website, message, song);

    this.play(website, message, song, youtube);
  }

  async play(website, message, song, youtube, skip, playlistVideos) {
    this.message = message;
    this.query = song;
    this.textChannel = message.channel;
    this.author = message.author;
    let type, stream, songAns, songInfo, serverQueue;

    
    let VoiceChannel = await _voice(message);

    this.voiceChannel = VoiceChannel;

    serverQueue = await _queue(message.guild.id, message);
    
    if (!skip) {
    if (youtube) {
      let _playlist = await client.isYtPlaylistUrl(song);
      if (_playlist) return this.playlist(website, message, song);

      try {
        songInfo = await ytdl.getInfo(song);
        songAns = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (e) {
        console.log(e);
        return message.reply("Error: " + e.message);
      }
    } else if (!youtube) {
      let _playlist = await client.isYtPlaylistUrl(song);
      if (_playlist) return this.playlist(website, message, song);

      try {
        let searchSong = await youtubeApi.searchVideos(song, 1, {
          part: "snippet"
        });
        songInfo = await ytdl.getInfo(searchSong[0].url);

        songAns = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (e) {
        console.log(e);
        return message.reply("Error: " + e.message);
      }
    }      
    }

    if (skip) {
      setTimeout(async () => {
    if (!serverQueue) {
      let serverQueueAns = {
        channel: {
          text: message.channel,
          voice: VoiceChannel
        },
        connection: null,
        settings: {
          loop: false,
          volume: 100,
          playing: true
        },
        songs: playlistVideos,
        control: this,
        event: null
      };

      client.music.set(message.guild.id, serverQueueAns);

      try {
        serverQueueAns.connection = await VoiceChannel.join();
        await serverQueueAns.connection.voice.setSelfDeaf(true);
        client.music.get(message.guild.id).event = new ServerEvent();
        this.playSong(website, serverQueueAns.songs[0], message);
      } catch (e) {
        console.log(e);
        client.music.delete(message.guild.id);
        await VoiceChannel.leave();
        return message.channel.send("Error: " + e.message);
      }
    } else if (serverQueue) {
      return this.addTrack(website, songAns, serverQueue, message, skip, ...playlistVideos);
    }        
      }, 500)
    } else {
    if (!serverQueue) {
      let serverQueueAns = {
        channel: {
          text: message.channel,
          voice: VoiceChannel
        },
        connection: null,
        settings: {
          loop: false,
          volume: 100,
          playing: true
        },
        songs: playlistVideos,
        control: this,
        event: null
      };

      client.music.set(message.guild.id, serverQueueAns);

      try {
        serverQueueAns.connection = await VoiceChannel.join();
        await serverQueueAns.connection.voice.setSelfDeaf(true);
        client.music.get(message.guild.id).event = new ServerEvent();
        this.playSong(website, serverQueueAns.songs[0], message);
      } catch (e) {
        console.log(e);
        client.music.delete(message.guild.id);
        await VoiceChannel.leave();
        return message.channel.send("Error: " + e.message);
      }
    } else if (serverQueue) {
      return this.addTrack(website, songAns, serverQueue, message, skip, ...playlistVideos);
    }      
    }
  }

  async list(website = false, message) {
    let serverQueue = _queue(message);
    if (!serverQueue)
      return message.channel.send(`There is no songs in queue, try added one.`);

    return message.channel.send(`https://beee.cf/queue?id=${message.guild.id}`);
  }

  async shuffle(website = false, message) {
    let serverQueue = await _queue(message);
    if (!_modify(message.member))
      return message.channel.send(`You must join same voice channel with me.`);

    let songs = serverQueue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    serverQueue.songs = songs;
    client.music.set(message.guild.id, serverQueue);

    return message.channel.send(
      `The songs on queue was shuffled!\nhttps://beee.cf/queue?id=${message.guild.id}`
    );
  }

  async nowPlaying(website = false) {}
 
  async playlist(website = false, message, song) {
    const playlist = await youtubeApi.getPlaylist(song);
    const videoss = await playlist.getVideos();
    let videos = []
          
    videoss.filter((video) => video.title != "Private video" && video.title != "Deleted video")
      .map(async (video) => {
      let songInfo = await ytdl.getInfo(video.url);
      videos.push({
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds        
      })
      });
     
      setTimeout(() => {
        this.play(false, message, false, false, true, videos)
      }, 500)
    
  }
}
 
module.exports = { ServerQueue };

// another function
async function _voice(message) {
  let VoiceChannel = message.member.voice.channel;
  if (!VoiceChannel)
    return message.channel.send(`You do not join any voice channel yet.`);

  return VoiceChannel;
}

async function _queue(id, message) {
  let _check = client.music.get(id);
  if (!_check) return false;

  return _check;
}

async function _modify(member) {
  const { channelID } = member.voice;
  const botChannel = member.guild.voice.channelID;

  if (channelID !== botChannel) {
    return false;
  }

  return true;
}
