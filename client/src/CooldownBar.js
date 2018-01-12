import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import Auth from './Auth';
import './css/CooldownBar.css';

class CooldownBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			cooldown: props.cooldown,
			cooldownSeconds: props.cooldownSeconds,
			percent: 0,
			style: {
				width: '0%'
			},
			interval: null
		}

		this.updateBar = this.updateBar.bind(this);

		let self = this;

		this.interval = setInterval(function(){

			if(!Auth.getState().authenticated){
				clearInterval(self.interval);
			}else{
				if(self.state.cooldown > -100)
					self.updateBar();
			}
		}, 10);
	}
	updateBar(){

		let percent = (this.state.cooldown / 1000);
		percent = (percent * 100 / this.state.cooldownSeconds).toFixed(1);

		if(percent < 0)
			percent = 0;

		this.setState({
			cooldown: this.state.cooldown - 10,
			percent,
			style: {
				width: percent + "%"
			}
		});
	}
	componentWillUnmount(){
		clearInterval(this.interval);
	}
	componentWillReceiveProps(nextProps){

		this.setState({
			cooldown: nextProps.cooldown,
			cooldownSeconds: nextProps.cooldownSeconds
		});
	}
	render() {
		return (
			<div className="CooldownBar">
				<div className="CooldownFill" style={this.state.style}>
					<div className="CooldownValue">
						<NumberFormat value={(this.state.cooldown > 0 ? this.state.cooldown / 1000 : 0)} decimalScale={1} decimalSeparator="," suffix=" s" displayType={'text'} />
					</div>
				</div>
			</div>
		);
	}
}

export default CooldownBar;