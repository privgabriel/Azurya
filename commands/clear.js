const cooldowns = new Map();

module.exports = {
    name: 'clear',
    description: 'Limpa as últimas 100 mensagens do chat com um delay de 5 segundos.',

    async execute(message) {
        const cooldownTime = 5000; // 5 segundos
        const userId = message.author.id;

        // Verificar se o usuário está em cooldown
        if (cooldowns.has(userId)) {
            const remainingTime = (cooldowns.get(userId) - Date.now()) / 1000;
            return message.reply(`⏳ Aguarde **${remainingTime.toFixed(1)}s** antes de usar este comando novamente.`)
                .then(msg => setTimeout(() => msg.delete(), 5000)); // Deleta a mensagem após 5s
        }

        // Verificar permissões
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('❌ Você não tem permissão para limpar mensagens.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }

        try {
            // Tentar apagar até 100 mensagens
            const deletedMessages = await message.channel.bulkDelete(100, true);
            const messagesDeleted = deletedMessages.size;

            message.channel.send(`✅ **${messagesDeleted} mensagens** foram apagadas!`)
                .then(msg => setTimeout(() => msg.delete(), 5000)); // Mensagem some após 5s
            
            // Aplicar cooldown de 5 segundos
            cooldowns.set(userId, Date.now() + cooldownTime);
            setTimeout(() => cooldowns.delete(userId), cooldownTime);
        } catch (error) {
            console.error('Erro ao limpar mensagens:', error);
            message.reply('❌ Ocorreu um erro ao tentar apagar mensagens.')
                .then(msg => setTimeout(() => msg.delete(), 5000));
        }
    }
};
