import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    authToken: null,
    error: '',
    loading: false
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: '',
        loading: true
    });
}

const authSuccess = (state, action) =>{
    return updateObject(state, {
        authToken: action.authToken,
        error: '',
        loading: false
    })
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    })
}

const authLogout = (state, action) =>{
    return updateObject (state, {
        authToken: null
    })
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action)
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action)
        case actionTypes.AUTH_FAIL: return authFail(state, action)
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action)
        default:
            return state
    }
}

export default reducer;