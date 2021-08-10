const mongoose = require("mongoose");

module.exports = async (client) => {
mongoose.connect(client.config.mongodb, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
  
client.db = mongoose.connection;
}