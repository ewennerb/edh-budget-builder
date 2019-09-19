import * as actionTypes from './actionTypes';
import axios from 'axios'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = token => { //successful login
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}

export const authFail = error => { //unsuccessful login
    return{
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const authRegister = (username, email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios('http://localhost:8000/register/',{
            method: 'post',
            data: { 
                username: username,
                email: email,
                password1: password1,
                password2: password2
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function (response) {
            console.log(response.data)
            const authToken = response.data.key;
           
            localStorage.setItem('authToken', authToken);
          
            dispatch(authSuccess(authToken))
           
            goHome(response.data)
          }).catch(function (error) {
              dispatch(authFail(error))
                console.log(error)
          });

        }
}//register

          

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios('http://localhost:8000/rest-auth/login/',{
            method: 'post',
            data: { 
                username: username,
                email: '',
                password: password
            },
            headers: {
              // "X-CSRFToken": CSRF_TOKEN, 23a6757509e9773a2682dfced46b843a9f273444
              'Content-Type': 'application/json'
            }
          }).then(function (response) {
            console.log(response.data)
            const authToken = response.data.key;
    
            localStorage.setItem('authToken', authToken);

            dispatch(authSuccess(authToken))
            
            window.location.href = "/";
          }).catch(function (error) {
              dispatch(authFail(error))
                console.log(error)
          });

          

          
    }



}

function goHome(data){
  window.location.href = "/";
  
}

export const logout = () => { //remove token from local storage
  localStorage.removeItem('authToken');

  return{
      type: actionTypes.AUTH_LOGOUT
  }
}


export const authCheckState = () =>{
  return dispatch => {
    const authToken = localStorage.getItem('authToken');
    if(authToken === undefined) {
      dispatch(logout())
    } else {
     
        dispatch(authSuccess(authToken));
      
    }
  }
}

