import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import LeftSideBar from './LeftSideBar';
// import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Battle from './Battle';
import Header from './Header';
import ExperienceBar from './ExperienceBar';
import CooldownBar from './CooldownBar';
// import Auth from './Auth';
// import { SocketProvider } from 'socket.io-react';
// import io from 'socket.io-client';
import { socketConnect } from 'socket.io-react';
import './css/Container.css';

class Container extends Component {
	constructor(props){
		super(props);
		this.state = {
			socket: props.socket,
			player: {
				level: 0,
				total_experience: 0,
				experience: 0,
				experience_to_next_level: 0,
				cooldown: 0,
				cooldownSeconds: 0
			},
			monstersList: []
		}

		if(this.state.socket){
			let self = this;
			this.state.socket
				.on('update', function(data){
					console.log(data);
					self.setState((state) => ({player: data }));
				})
				.on('monstersList', function(data){
					self.setState({monstersList: data });
				});

			this.state.socket.emit('update');
		}
	}
	render() {
		return (
			<Router>
				<div className="App">
					<Header />
					<ExperienceBar player={this.state.player} />
					<CooldownBar cooldown={this.state.player.cooldown} cooldownSeconds={this.state.player.cooldownSeconds} />
					<div className="App-container">
						<div className="row">
							<div className="col-md-3">
								<LeftSideBar appContext={this.props.appContext} player={this.state.player} />
							</div>
							<div className="col-md-9">
								<div className="Content">
									<Route exact path="/" render={props => <Home appContext={this.props.appContext} {...props} />} />
									<Route exact path="/battle" render={props => <Battle appContext={this.props.appContext} monstersList={this.state.monstersList} {...props} />} />
									<Route exact path="/teste" component={Header} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</Router>
		);		
	}
}

export default socketConnect(Container);