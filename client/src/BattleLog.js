import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';

class BattleLog extends Component {

	constructor(props) {
		super(props);

		this.state = {
			socket: props.socket,
			experience: 0,
			gold: 0,
			monsterHitCount: 0,
			monsterMissedCount: 0,
			monsterTotalHitCount: 0,
			playerHitCount: 0,
			playerMissedCount: 0,
			playerTotalHitCount: 0,
			totalDamage: 0,
			totalDamageTaken: 0,
			averageDamage: 0,
			averageDamageTaken: 0,
			win: false,
			monsterName: "",
			playerWeapon: null,
			show: false
		}

		this.handlebattleLog = this.handlebattleLog.bind(this);

		if(this.state.socket){

			this.state.socket.on('battleLog', this.handlebattleLog);
		}
	}
	handlebattleLog(data){
		data.show = true;
		this.setState(data);
	}
	componentWillUnmount(){
		this.state.socket.removeListener('battleLog', this.handlebattleLog);
	}
	render() {

		if(!this.state.show){
			return "";
		}

		return (
			<div>
				<div>You attacked the {this.state.monsterName} with your {this.state.playerWeapon ? this.state.playerWeapon : 'Fists'} {this.state.playerTotalHitCount} times!</div>
				<div>You hit the mob {this.state.playerHitCount} times (0 critical hits) and missed {this.state.playerMissedCount} times! </div>
				<div>You were hit {this.state.monsterHitCount} times and dodged {this.state.monsterMissedCount} times!</div>
				<div>{this.state.win ? "You Won!!!" : "You Lose!!!"}</div>
				<div>Total Damage: {this.state.totalDamage} (Average Damage: {this.state.averageDamage})</div>
				<div>Total Damage Taken: {this.state.totalDamageTaken} (Average Damage Taken: {this.state.averageDamageTaken})</div>
				
				{this.state.win && <div>You gained {this.state.experience} Experience and {this.state.gold} Gold!</div>}
			</div>
		);
	}
}

export default socketConnect(BattleLog);