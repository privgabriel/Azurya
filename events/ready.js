module.exports = {
    name: 'ready',
    execute(client) {
        console.log(`✅ Bot online como ${client.user.tag}`);
    }
};
