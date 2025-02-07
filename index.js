require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const config = require('./config/config.json');


const MASTER_ID = '1100033838073262090';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();

// Evitar carregamento duplicado de comandos
if (!client.commands.size) {
    fs.readdirSync('./commands').forEach(file => {
        if (file.endsWith('.js')) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.name, command);
        }
    });
}

client.on('ready', async () => {
    console.log(`✅ Bot online como ${client.user.tag}`);

    const guild = client.guilds.cache.first(); // Pega o primeiro servidor
    if (!guild) return console.log('❌ Nenhum servidor encontrado.');

    // Testar manualmente a busca do cargo
    const roleId = '1325371691727061064'; // Substitua pelo ID real do cargo
    const role = await guild.roles.fetch(roleId).catch(error => {
        console.error('❌ Erro ao buscar o cargo:', error);
        return null;
    });

    if (role) {
        console.log(`✅ Cargo encontrado: ${role.name}`);
    } else {
        console.log('❌ Cargo não encontrado. Verifique o ID e as permissões.');
    }
});


// Comandos baseados em prefixo
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Verificar se o bot foi mencionado
    if (message.mentions.has(client.user)) {
        if (message.author.id === MASTER_ID) {
            return message.reply(`👑 **Sim, mestre <@${message.author.id}>! Estou à disposição.**`);
        } else {
            return message.reply(`📜 **Olá! Para ver a lista de comandos, use \`$help\` ou mencione-me diretamente: <@${client.user.id}>.**`);
        }
    }

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        await message.reply('❌ Ocorreu um erro ao executar este comando.');
    }
});


// Evento para capturar interações (botões, menus, etc)
client.on('interactionCreate', async (interaction) => {
    try {
        // Verificar se é um botão
        if (interaction.isButton()) {
            const roleId = interaction.customId.replace('role_', '');
            const role = interaction.guild.roles.cache.get(roleId);
            const member = interaction.member;

            if (!role) {
                return interaction.reply({ content: '❌ Cargo não encontrado!', ephemeral: true });
            }

            // Adicionar ou remover o cargo
            if (member.roles.cache.has(roleId)) {
                await member.roles.remove(role);
                await interaction.reply({ content: `🔻 Você **removeu** o cargo **${role.name}**!`, ephemeral: true });
            } else {
                await member.roles.add(role);
                await interaction.reply({ content: `✅ Você **recebeu** o cargo **${role.name}**!`, ephemeral: true });
            }
        }

        // Verificar se é um menu suspenso (Select Menu)
        else if (interaction.isSelectMenu()) {
            const selectedRoles = interaction.values; // Contém os IDs dos cargos selecionados
            const member = interaction.member;

            let addedRoles = [];
            let removedRoles = [];

            for (const roleId of selectedRoles) {
                const role = interaction.guild.roles.cache.get(roleId);

                if (role) {
                    if (member.roles.cache.has(roleId)) {
                        await member.roles.remove(role);
                        removedRoles.push(role.name);
                    } else {
                        await member.roles.add(role);
                        addedRoles.push(role.name);
                    }
                }
            }

            // Construir a mensagem de resposta
            let responseMessage = '';
            if (addedRoles.length > 0) {
                responseMessage += `✅ **Cargos adicionados:** ${addedRoles.join(', ')}\n`;
            }
            if (removedRoles.length > 0) {
                responseMessage += `🔻 **Cargos removidos:** ${removedRoles.join(', ')}`;
            }

            await interaction.reply({ content: responseMessage || '⚠️ Nenhuma alteração foi feita.', ephemeral: true });
        }

    } catch (error) {
        console.error('Erro na interação:', error);
        await interaction.reply({ content: '❌ Ocorreu um erro ao processar esta ação.', ephemeral: true });
    }
});

// Evento para detectar entrada de novos membros
client.on('guildMemberAdd', async (member) => {
    console.log(`📥 Novo membro entrou: ${member.user.tag}`);
    const channel = member.guild.systemChannel || member.guild.channels.cache.find(ch => ch.name.includes('bem-vindo'));
    if (channel) {
        channel.send(`🎉 Bem-vindo ao servidor, ${member.user}!`);
    }
});

// Evento para detectar saída de membros
client.on('guildMemberRemove', async (member) => {
    console.log(`📤 Membro saiu: ${member.user.tag}`);
    const channel = member.guild.systemChannel || member.guild.channels.cache.find(ch => ch.name.includes('despedida'));
    if (channel) {
        channel.send(`😢 ${member.user.tag} saiu do servidor.`);
    }
});

client.login(process.env.TOKEN);
