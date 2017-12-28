import { createStore } from 'redux';

const auth = (state, action) => {
	switch(action.type){
		case "LOGIN":
			localStorage.setItem('token', action.token);
			return {
				authenticated: true,
				token: action.token
			};
		case "LOGOUT":
			localStorage.setItem('token', '');
			return {authenticated: false};
		default:
			return {authenticated: false};
	}
};

const Auth = createStore(auth);

export default Auth;
