import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
// import Auth from './Auth';
import './css/ProgressBar.css';

class ProgressBar extends Component {
	constructor(props){
		super(props);

		this.state = {
			value: props.value,
			total: props.total,
			textPosition: props.textPosition || "top",
			percent: 0,
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
		let percent = ((nextProps.value * 100) / nextProps.total).toFixed(2);

		if(percent < 0)
			percent = 0;

		let stylePercent = {
			left: percent + "%",
			marginLeft: '4px',
			color: 'black'
		};

		if(percent > 50){
			stylePercent = {
				left: percent + "%",
				marginLeft: '-204px',
				color: 'white',
				width: '200px'
			};
		}

		// if(this.state.textPosition == "bottom"){
		// 	stylePercent = {
		// 		left: "50%",
		// 		top: "13px",
		// 		color: 'black'
		// 	};
		// }

		this.setState({
			value: nextProps.value,
			total: nextProps.total,
			percent,
			style: {
				width: percent + "%"
			},
			stylePercent
		});
	}
	render() {
		return (
			<div className="ProgressBar">
				<div className="ProgressPercent"  style={this.state.stylePercent}>
					<NumberFormat value={this.state.percent} isNumericString={true} decimalSeparator="," suffix=" %" displayType={'text'} />
					<span className="ProgressValue">{this.state.value} / {this.state.total}</span>
				</div>
				<div className="ProgressFill" style={this.state.style}>
				</div>
			</div>
		);
	}
}

export default ProgressBar;