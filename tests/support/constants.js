// Common test constants to follow DRY principle

// Admin credentials
const ADMIN_EMAIL = 'admin@zombieplus.com'
const ADMIN_PASSWORD = 'pwd123'
const ADMIN_USERNAME = 'Admin'

// Lead messages
const LEAD_MESSAGES = {
    SUCCESS: 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.',
    DUPLICATE_EMAIL: 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.',
    INVALID_EMAIL: 'Email incorreto',
    REQUIRED_FIELD: 'Campo obrigatório',
}

// Login messages
const LOGIN_MESSAGES = {
    INVALID_EMAIL: 'Email incorreto',
    INVALID_CREDENTIALS: 'Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.',
    REQUIRED_FIELD: 'Campo obrigatório',
}

// Movie messages
const MOVIE_MESSAGES = {
    CREATED: (title) => `O filme '${title}' foi adicionado ao catálogo.`,
    REMOVED: 'Filme removido com sucesso.',
    DUPLICATE_TITLE: (title) => `O título '${title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`,
    REQUIRED_FIELDS: ['Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório'],
}

// TV Show messages
const TVSHOW_MESSAGES = {
    CREATED: (title) => `A série '${title}' foi adicionada ao catálogo.`,
    REMOVED: 'Série removida com sucesso.',
    DUPLICATE_TITLE: (title) => `O título '${title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`,
    REQUIRED_FIELDS: ['Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório (apenas números)'],
}

module.exports = {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_USERNAME,
    LEAD_MESSAGES,
    LOGIN_MESSAGES,
    MOVIE_MESSAGES,
    TVSHOW_MESSAGES,
}
