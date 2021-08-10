let RDB = require("../../../mongodb/schemas/redirect.js");

module.exports = {
  name: "addlink",
  description: "owner",
  aliases: ["al"],
  permissions: {
    user: [],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client, disbut) => {
    
    if (message.author.id !== "727110220400033865") return;
    
    let link = args.join(" ");
    if (!link) return message.channel.send("link?");
    
    if (!validURL(link)) return message.channel.send("no link.")
    
    let check = await RDB.findOne({Redirect: link});
    if (check) return message.channel.send("already");
    
    let id = makeid();
    
    let newDB = new RDB({
      CODE: id,
      Redirect: link
    });
    
    newDB.save();
    
    message.channel.send(`new code **${id}** redirect to ${link}`).then(m => {
      m.pin();
    })
    
  },
//   slashcommand: {
//     run: (interaction, args, client, disbut) => {
      
//     }
//   }
}

function makeid() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var num = '0123456789'
    var charactersLength = characters.length;
    for ( var i = 0; i < 4; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   result += num.charAt(Math.floor(Math.floor(Math.random() * num.length)));
  
   return result;
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}