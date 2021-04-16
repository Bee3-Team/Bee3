const { ShardingManager } = require('discord.js');
const config = require("./src/other/config.js");

const manager = new ShardingManager('./src/client/index.js', {
    totalShards: 'auto', 

    token: config.token
});

manager.spawn();

manager.on('shardCreate', (shard) => console.log(`Shard ${shard.id} launched`));