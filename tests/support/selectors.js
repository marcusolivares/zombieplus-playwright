// Selectors constants to avoid magic strings and follow DRY principle

const SELECTORS = {
    // Common
    ALERT: '.alert',
    CONFIRM_REMOVAL_BTN: '.confirm-removal',
    ROWS: 'row',
    SEARCH_INPUT: 'Busque pelo nome',
    REGISTER_BTN: 'Cadastrar',
    
    // React Select
    REACT_SELECT_INDICATOR: '.react-select__indicator',
    REACT_SELECT_OPTION: '.react-select__option',
    
    // Movies
    MOVIES_REGISTER_LINK: 'a[href$="register"]',
    MOVIE_TITLE_LABEL: 'Titulo do filme',
    MOVIE_SYNOPSIS_LABEL: 'Sinopse',
    MOVIE_COMPANY_SELECT: '#select_company_id',
    MOVIE_YEAR_SELECT: '#select_year',
    MOVIE_COVER_INPUT: 'input[name=cover]',
    MOVIE_FEATURED_SWITCH: '.featured .react-switch',
    
    // TV Shows
    TVSHOWS_LINK: 'a[href$="admin/tvshows"]',
    TVSHOWS_REGISTER_LINK: 'a[href$="admin/tvshows/register"]',
    TVSHOW_TITLE_LABEL: 'Titulo da série',
    TVSHOW_SYNOPSIS_LABEL: 'Sinopse',
    TVSHOW_COMPANY_SELECT: '#select_company_id',
    TVSHOW_YEAR_SELECT: '#select_year',
    TVSHOW_SEASONS_LABEL: 'Temporadas',
    TVSHOW_COVER_INPUT: 'input[name=cover]',
    TVSHOW_FEATURED_SWITCH: '.featured .react-switch',
    
    // Login
    LOGIN_FORM: '.login-form',
    EMAIL_INPUT: 'E-mail',
    PASSWORD_INPUT: 'Senha',
    LOGIN_BTN: 'Entrar',
    LOGGED_USER: '.logged-user',
    
    // Leads
    PLAY_BTN: /Aperte o play/,
    MODAL: 'modal',
    MODAL_HEADING: 'heading',
    MODAL_TEXT: 'Quero entrar na fila!',
    NAME_PLACEHOLDER: 'Informe seu nome',
    LEAD_EMAIL_PLACEHOLDER: 'Informe seu email',
    
    // Popup
    POPUP_CONTAINER: '.swal2-html-container',
}

const FIXTURES_PATH = 'tests/support/fixtures'

module.exports = {
    SELECTORS,
    FIXTURES_PATH,
}
