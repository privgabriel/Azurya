const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'addcargo',
    description: 'Adiciona um novo cargo à lista de cargos disponíveis (apenas para administradores).',
    
    async execute(message, args) {
        // Verificar se o usuário é administrador
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Apenas administradores podem usar este comando.');
        }

        const [roleId, ...roleNameArray] = args;
        const roleName = roleNameArray.join(' ');

        if (!roleId || !roleName) {
            return message.reply('❌ Uso incorreto do comando. Exemplo: `$addcargo <ID_DO_CARGO> <NOME_DO_CARGO>`');
        }

        // Carregar o arquivo roles.json
        const rolesFilePath = path.join(__dirname, '../roles.json');
        let rolesData = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));

        // Verificar se o cargo já existe
        if (rolesData.roles.some(role => role.id === roleId)) {
            return message.reply('❌ Este cargo já está na lista.');
        }

        // Adicionar o novo cargo ao array
        rolesData.roles.push({
            name: roleName,
            id: roleId
        });

        // Salvar no arquivo roles.json no formato correto
        fs.writeFileSync(rolesFilePath, JSON.stringify(rolesData, null, 4), 'utf8');

        message.reply(`✅ O cargo **${roleName}** foi adicionado com sucesso!`);
    }
};
