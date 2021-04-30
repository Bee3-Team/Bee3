class EventManager {
  constructor(Music) {
    Music.on("trackEnd", channel => {
      let queue = this.queue.get(channel.guild.id);
      
      channel.send("Queue ended.")
      setTimeout(() => {
        queue.voiceChannel.leave();
        this.queue.delete(channel.guild.id);
      }, this.option.leaveOnEndDelay * 1000 || 1000);
    });
    
    
    Music.on("trackEndWeb", async (channel) => {
      let queue = this.queue.get(channel.guild.id);

      setTimeout(() => {
        queue.voiceChannel.leave();
        this.queue.delete(channel.guild.id);
      }, this.option.leaveOnEndDelay * 1000 || 1000);      
    });    
  }
}

module.exports = EventManager;