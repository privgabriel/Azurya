const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'removecargo',
    description: 'Remove um cargo da lista de cargos disponíveis (apenas para administradores).',

    async execute(message, args) {
        // Verificar se o usuário é administrador
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Apenas administradores podem usar este comando.');
        }

        const roleId = args[0];
        if (!roleId) {
            return message.reply('❌ Por favor, forneça o **ID do cargo** a ser removido. Exemplo: `$removecargo <ID_DO_CARGO>`');
        }

        // Carregar o arquivo roles.json
        const rolesFilePath = path.join(__dirname, '../roles.json');
        let rolesData = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));

        // Verificar se o cargo existe na lista
        const roleIndex = rolesData.roles.findIndex(role => role.id === roleId);
        if (roleIndex === -1) {
            return message.reply('❌ O cargo com este **ID** não foi encontrado na lista.');
        }

        // Remover o cargo da lista
        const removedRole = rolesData.roles.splice(roleIndex, 1)[0];

        // Salvar a atualização no arquivo roles.json
        fs.writeFileSync(rolesFilePath, JSON.stringify(rolesData, null, 4), 'utf8');

        message.reply(`✅ O cargo **${removedRole.name}** foi removido com sucesso.`);
    }
};
