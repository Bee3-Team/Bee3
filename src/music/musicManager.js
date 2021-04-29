class MusicManager {
  constructor(client) {
    this.client = client;
  }

  async onplay(website = false, message, args, client) {
    let voice = await this._voice(message);
    if (!voice) return;

    this.can(message);

    let query = await this._query(message, args);

    this.music.play(message, query);
  }

  async onloop(website = false, message, args, client) {
    let voice = await this._voice(message);
    if (!voice) return;

    let queue = await this._queue(message);
    if (!queue) return;
    
    await this.can(message);

    if (client.music.getQueue(message).repeatMode) {
      client.music.setRepeatMode(message, false);
      return message.channel.send(`Loop now **off**.`);
    } else {
      client.music.setRepeatMode(message, true);
      return message.channel.send(`Loop now **on**.`);
    }
  }

  async onstop(website = false, message, args, client) {
    let voice = await this._voice(message);
    if (!voice) return;

    let queue = await this._queue(message);
    if (!queue) return;
    
    await this.can(message);
    
    client.music.setRepeatMode(message, false);
    client.music.stop(message);
    
    message.channel.send(`Music was stopped by ${message.author.tag}`)
  }

  async onskip(website = false, message, args, client) {
    let voice = await this._voice(message);
    if (!voice) return;

    let queue = await this._queue(message);
    if (!queue) return;
    
    await this.can(message);    
    
    client.music.skip(message);
    
    message.channel.send(`Music was skipped by ${message.author.tag}`)
  }

  async onqueue(website = false, message, args, client) {    
    let queue = await this._queue(message);
    if (!queue) return;    
    
    let serverQueue = client.music.getQueue(message);
    
    message.channel.send(`Current song: ${serverQueue.playing.title}\nQueue: https://beee.cf/queue?id=${message.guild.id}`)
  }

  async onjump(website = false, message, args, client) {
    
  }

  async onpause(website = false, message, args, client) {}

  async onresume(website = false, message, args, client) {}

  async onsearch(website = false, message, args, client) {}

  async onseek(website = false, message, args, client) {}

  async onvolume(website = false, message, args, client) {}

  async onshuffle(website = false, message, args, client) {}
}

module.exports = { MusicManager };
