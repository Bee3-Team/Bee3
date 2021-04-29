const { Player } = require('discord-player');
const { MusicManager } = require("./musicManager.js");

class Music extends MusicManager {
  constructor(client) {
    super(client)
    
    this.createClient(client);
  }
  
  async createClient(client) {
    client.music = new Player(client);
    
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
            message.channel.send("There is no songs.");
            break;
        case 'NotConnected':
            message.channel.send("Please join a voice channel.");
            break;
        case 'UnableToJoin':
            message.channel.send("I do not have permissio");
            break;
        default:
            message.channel.send(`${client.emotes.error} - Something went wrong ... Error : ${error}`);
    };      
    })
    
  }
}

module.exports = { Music }