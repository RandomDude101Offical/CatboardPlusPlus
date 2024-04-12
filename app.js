const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '/'; 

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'setup') {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      return message.reply('You do not have permission to use this command.');
    }

    message.channel.send('Where do you want to setup Catboard++?');
    
    const channels = message.guild.channels.cache.filter(channel => channel.type === 'text');
    const channelList = channels.map(channel => channel.name);

    const channelMessage = await message.channel.send(`Channels: ${channelList.join(', ')}`);

    const filter = response => channelList.includes(response.content.trim()) && response.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, { max: 1, time: 60000 }); // 60 seconds timeout

    collector.on('collect', async response => {
      // Get the selected channel
      const selectedChannel = channels.find(channel => channel.name === response.content.trim());

      // Send setup confirmation message to the selected channel
      selectedChannel.send('Catboard++ (aka a posting bot for discord) has been set up successfully.');

      channelMessage.edit('Catboard++ has been set up successfully in ' + selectedChannel);
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        message.channel.send('Setup cancelled. No channel selected.');
      }
    });
  }
});

client.login('a');
