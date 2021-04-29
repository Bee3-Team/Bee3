const { Player } = require('discord-player');
const { MusicManager } = require("./musicManager.js");

class Music extends MusicManager {
  constructor(client) {
    super(client)
    
    this.createClient(client);
  }
  
  async createClient(client) {
    client.music = new Player(client);
    
    this.music = client.music;
    this.createEvent(client);
  }
  
  async createEvent(client) {
    
    client.music.on("botDisconnect", async (message) => {
      message.channel.send("I have been kicked from voice channel.")
    });
    
    client.music.on("channelEmpty", async (message, queue) => {
      message.channel.send("The voice channel is empty, stopped the music.")
    });
    
    client.music.on("error", async (error, message) => {
    switch (error) {
        case 'NotPlaying':
            return message.channel.send("There is no songs.");
            break;
        case 'NotConnected':
            return message.channel.send("Please join a voice channel.");
            break;
        case 'UnableToJoin':
            return message.channel.send("I do not have permission (unable) to join this voice channel.");
            break;
        default:
            return message.channel.send("Error: " + error);
    };      
    });
    
    client.music.on("noResults", async (message, query) => {
      message.channel.send(`No result found for **${query}**.`)
    });
    
    client.music.on("playlistAdd", async (message, queue, playlist) => {
      message.channel.send(`Queued **${playlist.title}** playlist.`)
    });
    
    client.music.on("queueEnd", async (message, queue) => {
      message.channel.send("Queue ended.")
    });
    
    client.music.on("searchCancel", async (message, query, tracks) => {
      message.channel.send("Cancel to search songs.")
    });
    
    client.music.on("searchInvalidResponse", async (message, query, tracks, content, collector) => {
      message.channel.send(`Invalid number, must between 1 - ${tracks.length}.`)
    });
    
    client.music.on("searchResults", async (message, query, tracks, collector) => {
      message.channel.send(`Result for **${query}**.
\`\`\`nim
${tracks.map((t, i) => `[${i + 1}] ${t.title}`).join('\n')}
\`\`\``)
    });
    
    client.music.on("trackAdd", async (message, queue, track) => {
      message.channel.send(`Queued **${track.title}**.`)
    });
    
    client.music.on("trackStart", async (message, track) => {
      message.channel.send(`Playing **${track.title}**.`)
    });
    
  }
  
  async can(message) {
    
    if (this.music.getQueue(message)) {
    if (message.guild.me.voice.channel) {
      if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send("You cannot use this.");
    }      
    }
    
    return true;
  }
  
  async _query(message, args) {
    if (!args.join(" ")) return message.channel.send("Please provide song title / url");
    
    return args.join(" ");
  }
  
  async _queue(message) {
    
    if (!this.music.getQueue(message)) return message.channel.send("There is no songs.")
    
  }
  
  async _voice(message) {
    
    if (!message.member.voice.channel) {
      this.music.emit("error", "NotConnected", message)
      return false;
    }
    
  }
}

module.exports = { Music }