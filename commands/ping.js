module.exports = {
    name: 'ping',
    description: 'Responde com Pong!',
    async execute(message) {
        await message.reply('🏓 Pong!');
    }
};
