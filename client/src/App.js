import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
// import PrivateRoute from './PrivateRoute';
import { withAlert } from 'react-alert';
import Auth from './Auth';
// import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './css/App.css';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
import Container from './Container';
import Login from './Login';

class App extends Component {
	showAlert = (message, type) => {
		if(Array.isArray(message))
			message = message.map((m,i) => (<div key={i}>{m}</div>));

		this.props.alert.show(<div>{message}</div>, {
			timeout: 3000,
			type: type
	    })
	}
	constructor(props){
		super(props);
		this.state={
			page:[],
			flashMessage: null,
			socket: null
		}

		let token = localStorage.getItem('token');
		if(token){
			Auth.dispatch({type: 'LOGIN', token});
			this.state.socket = io.connect('http://localhost:4200', {'query': 'token=' + token});
		}
	}
	componentWillMount(){
		var page ='';
		if(Auth.getState().authenticated){
			page = <Container appContext={this} />;
		}else{
			page = <Login appContext={this} />;
		}
		this.setState({
			page: page
		});
	}
	render() {
		return (
			<SocketProvider socket={this.state.socket}>
				<div className="App">
					{this.state.page}
				</div>
			</SocketProvider>
		);
	}
}

export default withAlert(App);
