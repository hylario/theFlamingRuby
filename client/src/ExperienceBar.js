import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
// import Auth from './Auth';
import './css/ExperienceBar.css';

class ExperienceBar extends Component {
	constructor(props){
		super(props);

		let percent = ((props.player.experience * 100) / 132).toFixed(2);
		if(percent < 0)
			percent = 0;

		this.state = {
			player: props.player,
			percent: percent,
			style: {
				width: '0%'
			},
			stylePercent: {
				left: "0%",
				marginLeft: '4px'
			}
		}
	}
	componentWillReceiveProps(nextProps){
		let percent = ((nextProps.player.experience * 100) / nextProps.player.experience_to_next_level).toFixed(2);

		if(percent < 0)
			percent = 0;

		let stylePercent = {
			left: percent + "%",
			marginLeft: '4px',
			color: 'black'
		};

		if(percent > 80){
			stylePercent = {
				left: percent + "%",
				marginLeft: '-204px',
				color: 'white',
				width: '200px'
			};
		}

		this.setState({
			player: nextProps.player,
			percent,
			style: {
				width: percent + "%"
			},
			stylePercent
		});
	}
	render() {
		return (
			<div className="ExperienceBar">
				<div className="ExperiencePercent"  style={this.state.stylePercent}>
					<NumberFormat value={this.state.percent} isNumericString={true} decimalSeparator="," suffix=" %" displayType={'text'} />
					<span className="ExperienceValue">{this.state.player.experience} / {this.state.player.experience_to_next_level}</span>
				</div>
				<div className="ExperienceFill" style={this.state.style}>
				</div>
			</div>
		);
	}
}

export default ExperienceBar;