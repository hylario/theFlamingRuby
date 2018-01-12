import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/LeftSideBar.css';
import Auth from './Auth';
import Login from './Login';

class LeftSideBar extends Component {
	constructor(props){
		super(props);

		this.state = {
			player: props.player
		}
	}
	logout = () => {
		Auth.dispatch({type: "LOGOUT"});
		this.props.appContext.setState({
			page: <Login appContext={this.props.appContext} />
		});
	}
	componentWillReceiveProps(nextProps){
		this.setState(nextProps);
	}
	render() {
		return (
			<div className="LeftSideBar">
				<div className="PlayerInfo">
					<div className="PlayerName">{this.state.player.name}</div>
					<div className="row"><div className="col-md-6 text-right title">Level </div><div className="col-md-6 text-left value">{this.state.player.level}</div></div>
					<div className="row"><div className="col-md-6 text-right title">Experience </div><div className="col-md-6 text-left value">{this.state.player.experience}</div></div>
				</div>
				<Link to={'/'}>Home</Link><br/>
				<Link to={'/battle'}>Battle</Link><br/>
				<Link to={'/teste'}>Teste</Link><br/>
				<button onClick={this.logout}>Log out</button>
			</div>
		);
	}
}

export default LeftSideBar;