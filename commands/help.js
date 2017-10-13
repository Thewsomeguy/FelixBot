exports.run = async(client, message) => {
    return new Promise(async(resolve, reject) => {
        try {
            let args = message.content.split(/\s+/gim);
            args.shift();
            const categories = ["generic", "misc", "image", "utility", "fun", "moderation", "settings"];
            if (client.config.admins.includes(message.author.id)) categories.push('admin'); //If felix admin then show admin commands
            client.overallHelp = ""; //Nullify the one made in the index.js core
            for (let i = 0; i < categories.length; i++) {
                const categoryCommands = client.commands.filter(c => c.help.category == categories[i]);
                client.overallHelp += `**${categories[i]}** =>` + categoryCommands.map(c => `\`${c.help.name}\` `) + "\n\n";
            }
            client.overallHelp = client.overallHelp.replace(/undefined/gim, ""); //To remove the "undefined"
            //--------------------------------------------------------Return overall help if no args-----------------------------------------------------
            if (args.length === 0) return resolve(await message.channel.send(`Here's the list of all commands categories and their respective commands. Use \`${client.prefix}help command name\` to see the detailed description of a command\n\n` + client.overallHelp));
            const arg = args[0].toLowerCase(); //remove case sensitivity
            const commandHelp = client.commands.get(arg) || client.commands.get(client.aliases.get(arg));
            if (!commandHelp) return resolve();
            let aliases = 1 <= commandHelp.conf.aliases.length ? commandHelp.conf.aliases.join(', ') : "None";
            let detailedUsage = commandHelp.help.detailedUsage ? commandHelp.help.detailedUsage : "There is no detailed usage for this command";
            let parameters = commandHelp.help.parameters ? commandHelp.help.parameters : "None";
            let shortcuts = "None";
            if (commandHelp.shortcut) {
                let keys = Array.from(commandHelp.shortcut.triggers.keys());
                shortcuts = keys.map(k => `\`${k}\` ${commandHelp.shortcut.triggers.get(k).help}`).join('\n');
            }
            /*if (1 <= commandHelp.conf.aliases.length) aliases = commandHelp.conf.aliases.join(', ');
            if (commandHelp.help.detailedUsage) detailedUsage = commandHelp.help.detailedUsage.replace(/\{prefix\}/gim, `${client.prefix}`);
            if (commandHelp.help.parameters) parameters = commandHelp.help.parameters;*/
            resolve(await message.channel.send(`${commandHelp.help.description}\n**Parameters:** ${parameters}\n**Usage Example:**\n\`${client.prefix + commandHelp.help.usage}\`\n**Category:** \`${commandHelp.help.category}\`\n**Aliases:** \`${aliases}\`\n**Detailed usage:**\n${detailedUsage}\n**Shortcuts:**\n${shortcuts}`));
        } catch (err) {
            reject(client.emit('commandFail', message, err));
        }
    });
};

exports.conf = {
    guildOnly: false,
    disabled: false,
    aliases: ['h', 'halp'],
};

exports.help = {
    name: 'help',
    description: 'Displays all the available commands.',
    category: 'generic',
    usage: 'help ping'
};