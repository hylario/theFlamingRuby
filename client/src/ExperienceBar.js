import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import './css/ExperienceBar.css';

class ExperienceBar extends Component {
	constructor(props){
		super(props);

		let percent = ((props.experience * 100) / 132).toFixed(2);
		if(percent < 0)
			percent = 0;

		this.state = {
			experience: props.experience,
			currentPercent: percent,
			percent: percent,
			step: 0,
			style: {
				width: '0%'
			},
			stylePercent: {
				right: 0
			},
			interval: null
		}
	}
	componentWillReceiveProps(nextProps){
		let percent = ((nextProps.experience * 100) / 132).toFixed(2);

		if(percent < 0)
			percent = 0;

		let step = ((percent - this.state.currentPercent) / 10).toFixed(5);

		let self = this;

		this.setState({
			experience: nextProps.experience,
			percent: percent,
			step: +step,
			interval: setInterval(function(){
				if(+parseFloat(self.state.currentPercent).toFixed(1) !== +parseFloat(self.state.percent).toFixed(1)){
					let currentPercent = +self.state.currentPercent + +self.state.step;
					self.setState({
						currentPercent,
						style: {
							width: currentPercent + "%"
						},
						stylePercent: {
							right: (currentPercent < 10 ? '-32px' : (currentPercent < 90 ? '-38px' : '2px'))
						},
					});
				}else{
					self.setState({
						currentPercent: self.state.percent
					});
					clearInterval(self.interval);
				}
			}, 10)
		});
	}
	render() {
		return (
			<div className="ExperienceBar">
				<div className="ExperienceFill" style={this.state.style}>
					<div className="ExperiencePercent"  style={this.state.stylePercent}>
						<NumberFormat value={this.state.percent} isNumericString={true} decimalSeparator="," suffix=" %" displayType={'text'} />
					</div>
				</div>
			</div>
		);
	}
}

export default ExperienceBar;