module.exports = {
  name: "message",
  execute: async (message) => {
    
    if (message.content === "foo vins") {
      message.reply("foo ?")
    }
    
  }
}