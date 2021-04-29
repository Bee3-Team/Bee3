module.exports = {
  name: "queue",
  description: "Stop current song",
  aliases: ["songs"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.onqueue(false, message, args, client)
    
  }
}