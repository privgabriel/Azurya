module.exports = {
    name: 'kick',
    description: 'Expulsa um membro do servidor.',

    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Você precisa ser **administrador** para expulsar membros.');
        }

        const member = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'Nenhum motivo especificado';

        if (!member) {
            return message.reply('❌ Você precisa mencionar um usuário para expulsar.');
        }

        if (!member.kickable) {
            return message.reply('❌ Não posso expulsar este usuário.');
        }

        await member.kick(reason);

        message.reply(`✅ **${member.user.tag}** foi expulso.\n📌 **Motivo:** ${reason}`);

        // Enviar mensagem privada ao admin que executou o comando
        message.author.send(`👢 **Usuário Expulso:**\n📌 **Nome:** ${member.user.tag}\n🆔 **ID:** ${member.id}\n📝 **Motivo:** ${reason}`);
    }
};
