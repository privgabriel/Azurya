module.exports = {
    name: 'ban',
    description: 'Bane um membro do servidor.',

    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Você precisa ser **administrador** para banir membros.');
        }

        const member = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'Nenhum motivo especificado';

        if (!member) {
            return message.reply('❌ Você precisa mencionar um usuário para banir.');
        }

        if (!member.bannable) {
            return message.reply('❌ Não posso banir este usuário.');
        }

        await member.ban({ reason });

        message.reply(`✅ **${member.user.tag}** foi banido.\n📌 **Motivo:** ${reason}`);

        // Enviar mensagem privada ao admin que executou o comando
        message.author.send(`🚨 **Usuário Banido:**\n📌 **Nome:** ${member.user.tag}\n🆔 **ID:** ${member.id}\n📝 **Motivo:** ${reason}`);
    }
};
