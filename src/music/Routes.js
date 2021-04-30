export class MusicRoutes {
  constructor() {}

  async play(voiceChannel, textChannel = null) {
    if (!voiceChannel) throw new TypeError("Please join a voice channel.");
  }
}
