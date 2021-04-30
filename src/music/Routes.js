export class MusicRoutes {
  constructor() {}

  async play(voiceChannel, textChannel = false) {
    if (!voiceChannel) throw new TypeError("Please join a voice channel.");
  }
}
