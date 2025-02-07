const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'stop',
    description: 'Para a música e sai do canal de voz.',

    async execute(message) {
        const connection = getVoiceConnection(message.guild.id);

        if (!connection) {
            return message.reply('❌ O bot não está em um canal de voz.');
        }

        connection.destroy();
        message.reply('⏹️ Música parada. Saindo do canal.');
    }
};
