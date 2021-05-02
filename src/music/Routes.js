const ytdl = require("ytdl-core");
const {EventEmitter} = require("events");

class MusicRoutes extends EventEmitter {
  constructor() {
    super()
  }
  
  async play(textChannel = null, id, song) {
    const queue = this.queue.get(id);
    if (!queue) return;
    
    if (!song) {
      
      if (textChannel) {
        return this.emit("trackEnd", textChannel);
      } else {
        return this.emit("trackEndWeb", queue.voiceChannel);
      }
      
    }
      
    const dispatcher = queue.connection.play(ytdl(song.url, this.option.stream))
      .on("finish", () => {
      if (queue.loop) {
        let lastSong = queue.songs.shift();
        queue.songs.push(lastSong);
        this.play(textChannel, id, queue.songs[0]);
      } else {
        queue.songs.shift();
        this.play(textChannel, id, queue.songs[0]);
      }
    })
      .on("error", (err) => {
      console.error(err);
      queue.songs.shift();
      this.play(textChannel, id, queue.songs[0]);
    });
   
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    
    if (textChannel) {
      textChannel.send(`Playing **${song.title}** 🎶`);
    } else {
      return true;
    }
  }
  
  async stop(voiceChannel, textChannel = false) {
    let canModify;
    
    if (!voiceChannel) return this.emit("noChannel", textChannel);
    if (voiceChannel.guild.me.voice.channel) {
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id) return this.emit("noSameChannel", textChannel);      
    }
    
    let queue = this.queue.get(voiceChannel.guild.id);
    
    if (!queue) return this.emit("noQueue", textChannel);
    
    await this.canModify(voiceChannel, textChannel);
    
    queue.songs = [];
    queue.connection.dispatcher.end();
    if (textChannel) {
      return textChannel.send(`Music stopped.`);
    } else {
      return true;
    }
    
  }
  
  async skip(voiceChannel, textChannel = false) {
    let canModify;
    
    if (!voiceChannel) return this.emit("noChannel", textChannel);
    if (voiceChannel.guild.me.voice.channel) {
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id) return this.emit("noSameChannel", textChannel);      
    }
    
    let queue = this.queue.get(voiceChannel.guild.id);
    
    if (!queue) return this.emit("noQueue", textChannel);
    
    await this.canModify(voiceChannel, textChannel);   
    
    queue.connection.dispatcher.end();
    if (textChannel) {
      return textChannel.send(`Music skipped.`);
    } else {
      return true;
    }
  }
  
  async setVolume(voiceChannel, textChannel = false, value) {
    let canModify;
    
    if (!voiceChannel) return this.emit("noChannel", textChannel);
    if (voiceChannel.guild.me.voice.channel) {
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id) return this.emit("noSameChannel", textChannel);      
    } 
    
    let queue = this.queue.get(voiceChannel.guild.id);
    
    if (!queue) return this.emit("noQueue", textChannel);
    
    await this.canModify(voiceChannel, textChannel);
    
    if (!value) {
      if (textChannel) {
        return textChannel.send('Please give volume value.' + ' - current volume: ' + queue.volume);
      } else {
        throw new TypeError('Please give volume value.' + ' - current volume: ' + queue.volume);
      }      
    }    
    
    if (isNaN(value)) {
      if (textChannel) {
        return textChannel.send('Please provide valid volume value.');
      } else {
        throw new TypeError("Please provide valid volume value.");
      }      
    }
    
    if (value < 1 || value > 100) {
      if (textChannel) {
        return textChannel.send('Please provide valid volume value between 1 - 100.');
      } else {
        throw new TypeError("Please provide valid volume value between 1 - 100");
      }            
    }
    
    queue.connection.dispatcher.setVolumeLogarithmic(value / 100);
    queue.volume = value;
    if (textChannel) {
      return textChannel.send(`Music volume set to **${value}%**`);
    } else {
      return true;
    }
  }
  
  async pauseResume(voiceChannel, id, textChannel = null) {
    let canModify;
    
    if (!voiceChannel) return this.emit("noChannel", textChannel);
    if (voiceChannel.guild.me.voice.channel) {
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id) return this.emit("noSameChannel", textChannel);      
    }
    
    let queue = this.queue.get(id);
  }
  
  async nowPlaying(id, textChannel = null) {
    
    let canModify;
    
    let queue = this.queue.get(id);
    
    if (!queue) return this.emit("noQueue", textChannel);
    
    if (textChannel) {
      return textChannel.send(`Now playing: **${queue.songs[0].title}** [\`${queue.songs[0].duration == 0 ? "Live" : queue.songs[0].duration.toHHMMSS()}\`]
to see songs, use \`queue\` command.`);
    } else {
      return {
        title: queue.songs[0].title,
        url: queue.songs[0].url,
        duration: queue.songs[0].duration
      }
    }
  }
  
  async Queue(id, textChannel = null) {
    
    let canModify;
    
    let queue = this.queue.get(id);
    
    if (!queue) return this.emit("noQueue", textChannel);
    
    if (textChannel) {
      return textChannel.send(`https://beee.cf/queue?id=${id} - there have **${queue.songs.length}** songs.`)
    } else {
      return {
        songs: queue.songs
      }
    }
  }  
}

module.exports = MusicRoutes;