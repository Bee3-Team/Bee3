const mongoose = require("mongoose");

module.exports = async (client) => {
mongoose.connect(client.config.mongodb).then(
    ()=> console.log('connected to db')
)
}