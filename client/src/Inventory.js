import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';
import Item from './Item';
// import Select from 'react-select';
import './css/Inventory.css';
import $ from 'jquery';

class Inventory extends Component {

	constructor(props) {
		super(props);

		this.state = {
			socket: props.socket,
			items: null
		}

		if(this.state.socket){

			this.state.socket.on('inventoryItems', this.inventoryItems);
		}
	}
	tabClick = (e) => {
		$('.tab').removeClass('active');
		$(e.target).addClass('active');
		this.state.socket.emit('getInventory', e.target.attributes.itemtype.value);
	}
	inventoryItems = (data) => {
		this.setState({items: data});
	}
	componentWillUnmount(){
		this.state.socket.removeListener('inventoryItems', this.inventoryItems);
	}
	componentWillMount = () => {
		this.state.socket.emit('getInventory');
	}
	render() {
		let items = null;
		if(this.state.items)
			items = this.state.items.map((item) => <Item key={item._id} item={item} />);
		return (
			<div>
				<div className="Inventory">
					<div className="tab active" onClick={this.tabClick} itemType="weapon">Weapons</div>
					<div className="tab" onClick={this.tabClick} itemType="armor">Armors</div>
					<div className="tab" onClick={this.tabClick} itemType="gem">Gems</div>
				</div>
				<div className="Items">
					{items}
				</div>
			</div>
		);
	}
}

export default socketConnect(Inventory);