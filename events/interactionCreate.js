module.exports = {
    name: 'interactionCreate',

    async execute(interaction) {
        if (!interaction.isButton()) return;

        try {
            const [_, roleId] = interaction.customId.split('_');

            console.log(`🔍 Tentando buscar o cargo com ID: ${roleId}`);

            // Buscar o cargo no cache ou diretamente do servidor
            let role = interaction.guild.roles.cache.get(roleId) || await interaction.guild.roles.fetch(roleId);

            if (!role) {
                return interaction.reply({
                    content: `❌ O cargo não foi encontrado. Verifique se o ID está correto no **roles.json**.`,
                    flags: 64
                });
            }

            console.log(`✅ Cargo encontrado: ${role.name}`);

            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (!member) {
                return interaction.reply({
                    content: '❌ Não consegui encontrar o seu usuário no servidor.',
                    flags: 64
                });
            }

            if (member.roles.cache.has(roleId)) {
                await member.roles.remove(role);
                await interaction.reply({
                    content: `🔻 Você **removeu** o cargo **${role.name}**!`,
                    flags: 64
                });
            } else {
                await member.roles.add(role);
                await interaction.reply({
                    content: `✅ Você **recebeu** o cargo **${role.name}**!`,
                    flags: 64
                });
            }

        } catch (error) {
            console.error('❌ Erro ao processar a interação de botão:', error);
            await interaction.reply({
                content: '❌ Ocorreu um erro ao processar esta ação.',
                flags: 64
            });
        }
    }
};
