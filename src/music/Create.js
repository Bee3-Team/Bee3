const MusicRoutes = require("./Routes.js");

export class CreateMusic extends MusicRoutes {
  constructor(voiceChannel, option, textChannel = null) {
    super();
    
  }
  
  async start(voiceChannel, option, textChannel = null) {
    if (!voiceChannel) throw new TypeError("Please join a voice channel.");
    
    let connection = await voiceChannel.join();
    
    connection.connection
  }
}