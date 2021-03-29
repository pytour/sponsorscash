import { createStore, compose } from 'redux';

const initialState = {
    sideDrawerOpen: false,
    token: '',
    isLoggedIn: false,
    cashID: '',
    projects: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_PROJECTS': {
            return {
                ...state,
                projects: action.payload
            };
        }
        case 'CANCEL_PROJECT': {
            const projIndex = state.projects.findIndex(project => project._id === action.payload);
            const projects = [...state.projects];
            if (projIndex) projects[projIndex].status = 'CANCELED';
            return {
                ...state,
                projects: projects
            };
        }
        case 'TOGGLE_SIDEDRAWER': {
            return {
                ...state,
                sideDrawerOpen: !state.sideDrawerOpen
            };
        }
        case 'AUTHENTICATE': {
            return {
                ...state,
                token: action.payload.token,
                id: action.payload.id,
                username: action.payload.username,
                name: action.payload.name,
                image: action.payload.image,
                isLoggedIn: true
            };
        }
        case 'DEAUTHENTICATE': {
            return {
                ...state,
                token: null,
                id: null,
                username: null,
                name: null,
                image: null,
                isLoggedIn: false
            };
        }
        case 'SET_CASHID': {
            return {
                ...state,
                cashID: action.payload
            };
        }
        case 'CLEAR_CASHID': {
            return {
                ...state,
                cashID: ''
            };
        }
        default: {
            return state;
        }
    }
};

export const initializeStore = (preloadedState = initialState) => {
    const composeEnhancers =
        (typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    return createStore(reducer, preloadedState, composeEnhancers());
};
