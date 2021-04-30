class MusicRoutes {
  constructor() {}

  async play(textChannel = null, id, song) {
    const queue = this.queue.get(id);
    if (!queue) return;
    
    if (!song) {
      
      if (textChannel) {
        textChannel.send("Song was ")
      }
      
    }
  }
}

module.exports = MusicRoutes;