const MusicRoutes = require("./Routes.js");

export class CreateMusic extends MusicRoutes {
  constructor(voiceChannel, option, textChannel = null) {
    super();
    
    if (!voiceChannel) throw new TypeError("Please join a voice channel.");
    
    this.volume = option.volume;
    this.songs
  }
}