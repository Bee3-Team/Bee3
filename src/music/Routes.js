const ytdl = require("ytdl-core");
const { EventEmitter } = require("events");
const disbut = require("discord-buttons");   

class MusicRoutes extends EventEmitter {
  constructor() {
    super();
  }

  async play(textChannel = null, id, song) {
    const queue = this.queue.get(id);

    if (!song) {
      if (textChannel) {
        return this.emit("trackEnd", textChannel);
      } else {
        return this.emit("trackEndWeb", queue.voiceChannel);
      }
    }

    const dispatcher = queue.connection
      .play(ytdl(song.url, this.option.stream))
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
      .on("error", err => {
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
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id)
        return this.emit("noSameChannel", textChannel);
    }

    let queue = this.queue.get(voiceChannel.guild.id);

    if (!queue) return this.emit("noQueue", textChannel);

    await this.canModify(voiceChannel, textChannel);

    
    queue.songs = [];
    if (!queue.playing) {
      queue.playing = !queue.playing;
      queue.connection.dispatcher.resume();
    }
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
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id)
        return this.emit("noSameChannel", textChannel);
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
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id)
        return this.emit("noSameChannel", textChannel);
    }

    let queue = this.queue.get(voiceChannel.guild.id);

    if (!queue) return this.emit("noQueue", textChannel);

    await this.canModify(voiceChannel, textChannel);

    if (!value) {
      if (textChannel) {
        return textChannel.send(
          "Please give volume value." + " - current volume: **" + queue.volume + "%**"
        );
      } else {
        throw new TypeError(
          "Please give volume value." + " - current volume: **" + queue.volume + "%**"
        );
      }
    }

    if (isNaN(value)) {
      if (textChannel) {
        return textChannel.send("Please provide valid volume value.");
      } else {
        throw new TypeError("Please provide valid volume value.");
      }
    }

    if (value < 1 || value > 100) {
      if (textChannel) {
        return textChannel.send(
          "Please provide valid volume value between 1 - 100."
        );
      } else {
        throw new TypeError(
          "Please provide valid volume value between 1 - 100"
        );
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
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id)
        return this.emit("noSameChannel", textChannel);
    }

    let queue = this.queue.get(id);
    
    if (!queue) return this.emit("noQueue", textChannel);
    
    await this.canModify(voiceChannel, textChannel);
    
    let playing;
    
    queue.playing ? queue.connection.dispatcher.pause() : queue.connection.dispatcher.resume();
    playing = queue.playing;
    queue.playing = !queue.playing;
    
    if (textChannel) {
      return textChannel.send(`Queue was **${playing ? "paused" : "resumed"}**`)
    } else {
      return true;
    }    
  }

  async nowPlaying(id, textChannel = null) {
    let canModify;

    let queue = this.queue.get(id);

    if (!queue) return this.emit("noQueue", textChannel);

    if (textChannel) {
      let button = new disbut.MessageButton()
      .setStyle('blurple')
      .setLabel('check queue')
      .setID("check-queue")
      
      return textChannel.send(`Now playing: **${queue.songs[0].title}** [\`${
        queue.songs[0].duration == 0
          ? "Live"
          : queue.songs[0].duration.toHHMMSS()
      }\`]
to see songs, use \`queue\` command.`, button);
    } else {
      return {
        title: queue.songs[0].title,
        url: queue.songs[0].url,
        duration: queue.songs[0].duration
      };
    }
  }
  
  async shuffle(voiceChannel, textChannel = null) {
    
    if (!voiceChannel) return this.emit("noChannel", textChannel);
    if (voiceChannel.guild.me.voice.channel) {
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id)
        return this.emit("noSameChannel", textChannel);
    }    
    
    let queue = this.queue.get(voiceChannel.guild.id);
    
    if (!queue) return this.emit("noQueue", textChannel);
    
    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    if (textChannel) {
      return textChannel.send(`Server songs was shuffled.`);
    } else {
      return true;
    }
  }
  
  async loop(voiceChannel, textChannel = null) {
    
    if (!voiceChannel) return this.emit("noChannel", textChannel);
    if (voiceChannel.guild.me.voice.channel) {
      if (voiceChannel.id !== voiceChannel.guild.me.voice.channel.id)
        return this.emit("noSameChannel", textChannel);
    }    
    
    let queue = this.queue.get(voiceChannel.guild.id);
    
    if (!queue) return this.emit("noQueue", textChannel);
    
    let loop_;
    
    loop_ = !queue.loop;
    queue.loop = !queue.loop;
    
    if (textChannel) {
      return textChannel.send(`Loop now **${loop_ ? "on" : "off"}**`);
    } else {
      return true;
    }    
  }

  async Queue(id, textChannel = null) {
    let canModify;

    let queue = this.queue.get(id);

    if (!queue) return this.emit("noQueue", textChannel);

    if (textChannel) {
let button = new disbut.MessageButton()
  .setStyle('blurple')
  .setLabel('now playing') 
  .setID('now-playing');      
      
      return textChannel.send(
        `https://beee.cf/queue?id=${id} - there have **${queue.songs.length}** songs.`, button);
    } else {
      return {
        songs: queue.songs
      };
    }
  }
}

module.exports = MusicRoutes;
