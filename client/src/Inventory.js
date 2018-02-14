import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';
// import Select from 'react-select';
// import './css/Inventory.css';

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
			items = this.state.items.map((item) => <div key="{item.id}">{item.name}</div>);
		return (
			<div className="Inventory">
				{items}
			</div>
		);
	}
}

export default socketConnect(Inventory);