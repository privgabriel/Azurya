const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

module.exports = {
    name: 'play',
    description: 'Toca música no canal de voz.',
    
    async execute(message, args) {
        if (!message.member.voice.channel) {
            return message.reply('❌ Você precisa estar em um canal de voz para tocar música.');
        }

        const query = args.join(' ');
        if (!query) {
            return message.reply('❌ Por favor, forneça o link ou o nome da música.');
        }

        let videoUrl;

        // Verificar se o argumento é um link direto do YouTube
        if (ytdl.validateURL(query)) {
            videoUrl = query;
        } else {
            // Se não for um link, buscar pelo nome
            const searchResults = await ytsr(query, { limit: 1 });
            if (searchResults.items.length === 0) {
                return message.reply('❌ Não consegui encontrar a música.');
            }
            videoUrl = searchResults.items[0].url;
        }

        // Entrar no canal de voz
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const stream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
        const resource = createAudioResource(stream);

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        player.play(resource);
        connection.subscribe(player);

        // Enviar mensagem de confirmação
        message.reply(`🎵 Tocando agora: **${videoUrl}**`);
    }
};
