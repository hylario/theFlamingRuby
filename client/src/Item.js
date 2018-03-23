import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';
import Constants from './Constants';
// import Select from 'react-select';
import './css/Item.css';

class Item extends Component {

	constructor(props) {
		super(props);

		this.state = {
			item: props.item,
			hover: false
		}
	}
	mouseEnter = (e) => {
		this.setState({hover: true});
	}
	mouseLeave = (e) => {
		this.setState({hover: false});
	}
	getItemImage = (itemSubType) => {
		console.log(this.state);
		switch(itemSubType){
			case 'axe': return Constants.IMAGES.WEAPONS.AXE;
			case 'attack_gem': return Constants.IMAGES.GEMS.ATTACK_GEM;
		}
		return "";
	}
	render() {
		return (
			<div className="Item" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
				<div className="ItemImage">
					<img src={this.getItemImage(this.state.item.itemSubType)} />
				</div>
				{this.state.hover && (
					<div className="ItemTooltip">
						<div className="ItemName">{this.state.item.name}</div>
						<div className="ItemAttack">{this.state.item.attack}</div>
						<div className="ItemDefense">{this.state.item.defense}</div>
					</div>
				)}
			</div>
		);
	}
}

export default Item;