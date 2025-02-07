module.exports = {
    name: 'help',
    description: 'Lista todos os comandos disponíveis.',

    async execute(message) {
        const helpMessage = `
        📜 **Lista de Comandos:**
        \n**$play <nome ou link>** - Toca uma música do YouTube.
        \n**$stop** - Para a música atual e sai do canal.
        \n**$cargos** - Exibe os cargos disponíveis.
        \n**$ping** - Mostra o tempo de resposta do bot.
        \n**$help** - Exibe esta mensagem de ajuda.
        \n**$clear** - Limpa mensagens do chat.
        `;

        await message.reply(helpMessage);
    }
};
