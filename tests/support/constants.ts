// Default admin credentials
export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD 

// UI Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_EMAIL: 'Email incorreto',
  NUMBERS_ONLY: 'Campo obrigatório (apenas números)',
  DUPLICATE_MOVIE: (title: string) =>
    `O título '${title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`,
  DUPLICATE_LEAD: 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.',
}

// UI Success Messages
export const SUCCESS_MESSAGES = {
  MOVIE_ADDED: (title: string) => `O filme '${title}' foi adicionado ao catálogo.`,
  MOVIE_REMOVED: 'Filme removido com sucesso.',
  TVSHOW_ADDED: (title: string) => `A série '${title}' foi adicionada ao catálogo.`,
  TVSHOW_REMOVED: 'Série removida com sucesso.',
  LEAD_SUCCESS:
    'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
}

// UI Selectors
export const SELECTORS = {
  ALERT: '.alert',
  POPUP: '.swal2-html-container',
  MODAL: '[data-testid="modal"]',
  LOGIN_FORM: '.login-form',
  LOGGED_USER: '.logged-user',
  CONFIRM_REMOVAL: '.confirm-removal',
  FEATURED_SWITCH: '.featured .react-switch',
  COMPANY_SELECT: '#select_company_id .react-select__indicator',
  YEAR_SELECT: '#select_year .react-select__indicator',
  SELECT_OPTION: '.react-select__option',
  COVER_INPUT: 'input[name=cover]'
}

// Login constants
export const LOGIN_STRINGS = {
  USERNAME_GREETING: (name: string) => `Olá, ${name}`
}
