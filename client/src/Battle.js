import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './css/Battle.css';

import image from './img/monsters/penguin.gif';

console.log(image);

class Battle extends Component {

	constructor(props) {
		super(props);

		this.state = {
			socket: props.socket,
			monstersList: null,
			monsterSelected: {
				value: localStorage.getItem('monster_attacked_id')
			},
			monster: null
		}

		this.handleBtnAttack = this.handleBtnAttack.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleMonsterInfo = this.handleMonsterInfo.bind(this);

		if(this.state.socket){

			this.state.socket.emit('getMonstersList');

			this.state.socket.on('monsterInfo', this.handleMonsterInfo);
		}

		if(this.state.monsterSelected.value){
			this.state.socket.emit('getMonsterInfo', this.state.monsterSelected.value);
		}
	}
	handleMonsterInfo(data){
		this.setState({monster: data});
	}
	componentWillUnmount(){
		this.state.socket.removeListener('monsterInfo', this.handleMonsterInfo);
	}
	handleBtnAttack(event){
		event.preventDefault();
		this.props.appContext.state.socket.emit('attack', this.state.monster._id);
		localStorage.setItem('monster_attacked_id', this.state.monster._id);
	}

	handleChange(event){
		this.setState({ monsterSelected: event });
		if(event){
			this.state.socket.emit('getMonsterInfo', event.value);
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			monstersList: nextProps.monstersList
		});
	}
	render() {
		return (
			<div className="Battle">
				<Select
					className="SelectMonster"
					name="monster"
					value={this.state.monsterSelected && this.state.monsterSelected.value}
					onChange={this.handleChange}
					options={this.state.monstersList}
				/>
				{this.state.monster && this.state.monster.image && <img src={this.state.monster.image} />}
				{this.state.monster && <div className="BtnRegister" onClick={this.handleBtnAttack}>Attack</div>}
			</div>
		);
	}
}

export default socketConnect(Battle);