import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import LeftSideBar from './LeftSideBar';
// import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Header from './Header';
// import Auth from './Auth';
// import { SocketProvider } from 'socket.io-react';
// import io from 'socket.io-client';
import { socketConnect } from 'socket.io-react';
import './css/Container.css';

class Container extends Component {
	constructor(props){
		super(props);
		this.state = {
			socket: props.socket
		}

		if(this.state.socket){
			this.state.socket.on('login', function(data){
				console.log(data);
			});
		}
	}
	render() {
		return (
			<Router>
				<div className="App">
					<Header />
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