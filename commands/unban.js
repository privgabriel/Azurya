module.exports = {
    name: 'unban',
    description: 'Desbane um usuário pelo ID.',

    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Você precisa ser **administrador** para desbanir membros.');
        }

        const userId = args[0];
        const reason = args.slice(1).join(' ') || 'Nenhum motivo especificado';

        if (!userId) {
            return message.reply('❌ Você precisa fornecer um ID para desbanir.');
        }

        try {
            await message.guild.bans.remove(userId, reason);
            message.reply(`✅ Usuário com ID **${userId}** foi desbanido.\n📌 **Motivo:** ${reason}`);

            // Enviar mensagem privada ao admin que executou o comando
            message.author.send(`🛑 **Usuário Desbanido:**\n🆔 **ID:** ${userId}\n📝 **Motivo:** ${reason}`);
        } catch (error) {
            console.error('Erro ao desbanir:', error);
            message.reply('❌ Ocorreu um erro ao tentar desbanir este usuário.');
        }
    }
};
