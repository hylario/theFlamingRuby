import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/LeftSideBar.css';
import Auth from './Auth';
import Login from './Login';

class LeftSideBar extends Component {
	logout = () => {
		Auth.dispatch({type: "LOGOUT"});
		this.props.appContext.setState({
			page: <Login appContext={this.props.appContext} />
		});
	}

	render() {
		return (
			<div className="LeftSideBar">
				<Link to={'/'}>Home</Link><br/>
				<Link to={'/teste'}>Teste</Link><br/>
				<button onClick={this.logout}>Log out</button>
			</div>
		);
	}
}

export default LeftSideBar;