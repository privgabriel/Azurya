const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'cargos',
    description: 'Exibe os cargos disponíveis em um canal privado temporário.',

    async execute(message) {
        try {
            // Ler o arquivo roles.json dinamicamente
            const rolesFilePath = path.join(__dirname, '../roles.json');
            const rolesData = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));

            if (!rolesData.roles || rolesData.roles.length === 0) {
                return message.reply('❌ Nenhum cargo disponível para exibir.');
            }

            // Avisar ao usuário que o canal está sendo criado
            const confirmationMessage = await message.reply({
                content: `🔔 **${message.author}, a sala privada está sendo criada...**`
            });

            // Criar o canal privado temporário
            const channel = await message.guild.channels.create({
                name: `privado-cargos-${message.author.username}`,
                type: 0, // Canal de texto
                permissionOverwrites: [
                    {
                        id: message.guild.id, // Bloquear para todos
                        deny: ['ViewChannel']
                    },
                    {
                        id: message.author.id, // Permitir apenas ao usuário atual
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                    },
                    {
                        id: message.client.user.id, // Permitir ao bot
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                    }
                ]
            });

            console.log(`✅ Canal privado ${channel.name} criado.`);

            // Criar os botões para os cargos
            const buttons = rolesData.roles.map(role => 
                new ButtonBuilder()
                    .setCustomId(`role_${role.id}`)
                    .setLabel(role.name)
                    .setStyle(ButtonStyle.Primary)
            );

            // Verificar se há pelo menos 1 botão e no máximo 5
            if (buttons.length === 0) {
                throw new Error('Nenhum botão foi gerado.');
            }

            // Dividir os botões em grupos de no máximo 5 botões por ActionRow
            const rows = [];
            for (let i = 0; i < buttons.length; i += 5) {
                rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
            }

            // Enviar a mensagem com os botões no canal privado
            const cargosMessage = await channel.send({
                content: `🎭 **Olá, ${message.author.username}!** Escolha um cargo abaixo clicando nos botões:`,
                components: rows
            });

            // Deletar a mensagem de cargos após 12 segundos
            setTimeout(async () => {
                try {
                    await cargosMessage.delete();
                    console.log('🗑️ Mensagem de cargos deletada.');
                } catch (error) {
                    console.error('❌ Erro ao deletar a mensagem de cargos:', error);
                }
            }, 12000); // 12 segundos

            // Deletar o canal após 15 segundos
            setTimeout(async () => {
                try {
                    await channel.delete();
                    await confirmationMessage.delete();
                    console.log(`🔄 Canal privado ${channel.name} deletado.`);
                } catch (error) {
                    console.error('❌ Erro ao deletar o canal privado ou a mensagem de confirmação:', error);
                }
            }, 15000); // 15 segundos

        } catch (error) {
            console.error('❌ Erro ao criar o canal privado:', error);
            await message.reply('❌ Ocorreu um erro ao tentar criar o canal privado.');
        }
    }
};
