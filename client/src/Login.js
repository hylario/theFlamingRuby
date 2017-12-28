import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import Auth from './Auth';
import Container from './Container';
import Register from './Register';
import io from 'socket.io-client';
import './css/Login.css';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleBtnRegister = this.handleBtnRegister.bind(this);
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();

		let self = this;

		if(this.state.username === '' || this.state.password === ''){
		 	self.props.appContext.showAlert('Username and password cannot be empty', 'error');
		}else{

			axios.post('http://localhost:4200/login', {
				username: this.state.username,
				password: this.state.password
			}).then(function(data){
				if(data.data.success){
					Auth.dispatch({type: 'LOGIN', token: data.data.token});

				 	self.props.appContext.setState({
					 	page: <Container appContext={self.props.appContext}/>,
					 	socket: io.connect('http://localhost:4200', {'query': 'token=' + data.data.token})
				 	});
				}else{

			 		self.props.appContext.showAlert(data.data.message, 'error');
				}
			}).catch(function(data){
			 	self.props.appContext.showAlert('User and/or password wrong', 'error');
			});
		}
	}

	handleBtnRegister(event){
		event.preventDefault();
		this.props.appContext.setState({
			page: <Register appContext={this.props.appContext} />
		});
	}

	render() {

		return (
			<div>
				<div className="row Title">
					<div className="col-md-12 text-center"><h2>Login</h2></div>
				</div>
				<div className="row">
					<div className="col-md-4 col-md-offset-4">
						<form className="LoginForm" onSubmit={this.handleSubmit}>
							<div className="form-group">
								<label>
									Username
									<input className="form-control" type="text" name="username" value={this.state.username} onChange={this.handleChange} />
								</label>
							</div>
							<div className="form-group">
								<label>
									Password
									<input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
								</label>
							</div>
							<input className="btn btn-success" type="submit" value="Login" /><br/>
							<div className="BtnRegister" onClick={this.handleBtnRegister}>Register</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;