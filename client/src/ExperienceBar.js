import React, { Component } from 'react';
import './css/ExperienceBar.css';

class ExperienceBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			experience: props.experience,
			percent: (props.experience * 100) / 100,
			style: {
				width: '0%'
			}
		}

		console.log(props);

	}
	componentWillReceiveProps(){
		let percent = (this.props.experience * 100) / 100;

		this.setState({
			percent,
			style: {
				width: percent + "%"
			}
		});
	}
	render() {
		return (
			<div className="ExperienceBar">
				<div className="ExperienceFill" style={this.state.style}></div>
			</div>
		);
	}
}

export default ExperienceBar;