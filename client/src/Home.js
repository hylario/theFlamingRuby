import React, { Component } from 'react';
// import './css/Header.css';

class Header extends Component {

	constructor(props) {
		super(props);

		this.handleBtnAttack = this.handleBtnAttack.bind(this);
		this.handleBtnDown = this.handleBtnDown.bind(this);
	}

	handleBtnAttack(event){
		event.preventDefault();
		this.props.appContext.state.socket.emit('attack', 1);
	}

	handleBtnDown(event){
		event.preventDefault();
		this.props.appContext.state.socket.emit('attack', -1);
	}

	render() {
		return (
			<div className="Home">
				<div className="BtnRegister" onClick={this.handleBtnAttack}>Attack</div>
				<div className="BtnRegister" onClick={this.handleBtnDown}>Down</div>
			</div>
		);
	}
}

export default Header;