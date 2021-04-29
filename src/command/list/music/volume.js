module.exports = {
  name: "volume",
  description: "Set current song volume",
  aliases: ["setvolume", "vol"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.onvolume(false, message, args, client)
    
  }
}