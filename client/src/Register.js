import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import './css/Register.css';

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: {value:'', valid: false},
			password: {value:'', valid: false},
			email: {value:'', valid: false},
			password_confirmation: {value:'', valid: false}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleBtnLogin = this.handleBtnLogin.bind(this);
	}

	handleChange(event) {

		let valid = false;
		switch(event.target.name){
			case 'username':
				valid = event.target.value.length >= 4;
				break;
			case 'email':
				valid = event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				break;
			case 'password':
				valid = event.target.value.length >= 6;
				break;
			case 'password_confirmation':
				valid = event.target.value === this.state.password.value;
				break;
			default:
				valid = true;
		}

		this.setState({
			[event.target.name]: {
				value: event.target.value,
				valid
			}
		});
	}

	handleSubmit(event) {
		event.preventDefault();

		let self = this;
		let valid = true;

		let errors = [];

		if(!this.state.username.valid){
			errors.push('Username invalid');
		 	valid = false;
		}

		if(!this.state.email.valid){
			errors.push('E-mail invalid');
		 	valid = false;
		}

		if(!this.state.password.valid){
			errors.push('Password invalid');
		 	valid = false;
		}

		if(!this.state.password_confirmation.valid){
			errors.push('Confirm the password');
		 	valid = false;
		}

		if(errors.length > 0){
	 		self.props.appContext.showAlert(errors, 'error');
		}

		if(valid){

			axios.post('http://localhost:4200/register', {
				username: this.state.username.value,
				email: this.state.email.value,
				password: this.state.password.value,
				password_confirmation: this.state.password_confirmation.value
			}).then(function(data){
		 		self.props.appContext.showAlert(data.data.message, 'error');

				if(data.data.success){
					self.props.appContext.setState({
					 	page: <Login appContext={self.props.appContext}/>
				 	});
				}
			}).catch(function(data){
			 	// self.props.appContext.showAlert('User and/or password wrong', 'error');
			});
		}
	}

	handleBtnLogin(event){
		event.preventDefault();
		this.props.appContext.setState({
			page: <Login appContext={this.props.appContext} />
		});
	}

	render() {

		return (
			<div>
				<div className="row Title">
					<div className="col-md-12 text-center"><h2>Register</h2></div>
				</div>
				<div className="row">
					<div className="col-md-4 col-md-offset-4">
						<form className="RegisterForm" onSubmit={this.handleSubmit}>
							<div className={`form-group ${this.state.username.valid ? '' : 'has-error'}`}>
								<label>
									Username:
									<input className="form-control" type="text" name="username" value={this.state.username.value} onChange={this.handleChange} />
								</label>
							</div>

							<div className={`form-group ${this.state.email.valid ? '' : 'has-error'}`}>
								<label>
									E-mail:
									<input className="form-control" type="text" name="email" value={this.state.email.value} onChange={this.handleChange} />
								</label>
							</div>

							<div className={`form-group ${this.state.password.valid ? '' : 'has-error'}`}>
								<label>
									Password:
									<input className="form-control" type="password" name="password" value={this.state.password.value} onChange={this.handleChange} />
								</label>
							</div>

							<div className={`form-group ${this.state.password_confirmation.valid ? '' : 'has-error'}`}>
								<label>
									Password Confirmation:
									<input className="form-control" type="password" name="password_confirmation" value={this.state.password_confirmation.value} onChange={this.handleChange} />
								</label>
							</div>

							<input className="btn btn-success" type="submit" value="Register" /><br/>
							<div className="BtnLogin" onClick={this.handleBtnLogin}>Login</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Register;