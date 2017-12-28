import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import LeftSideBar from './LeftSideBar';
// import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Header from './Header';
import ExperienceBar from './ExperienceBar';
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
				experience: 0,
				cooldown: 0
			}
		}

		if(this.state.socket){
			let self = this;
			this.state.socket.on('update', function(data){
				self.setState({
					player: data
				});
			});
		}
	}
	componentWillReceiveProps(){
		console.log(this.props);
	}
	render() {
		return (
			<Router>
				<div className="App">
					<Header />
					<ExperienceBar experience={this.state.player.experience} />
					<div className="App-container">
						<div className="row">
							<div className="col-md-3">
								<LeftSideBar appContext={this.props.appContext} />
							</div>
							<div className="col-md-9">
								<div className="Content">
									<Route exact path="/" render={props => <Home appContext={this.props.appContext} {...props} />} />
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