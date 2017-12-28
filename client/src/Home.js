import React, { Component } from 'react';
// import './css/Header.css';

class Header extends Component {

	constructor(props) {
		super(props);

		this.handleBtnAttack = this.handleBtnAttack.bind(this);
	}

	handleBtnAttack(event){
		event.preventDefault();
		this.props.appContext.state.socket.emit('attack', 'oi');
	}

	render() {
		return (
			<div className="Home">
				<div className="BtnRegister" onClick={this.handleBtnAttack}>Attack</div>
			</div>
		);
	}
}

export default Header;