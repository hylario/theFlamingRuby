import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Auth from './Auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest}
		render={props => (Auth.getState() ? (<Component {...props}/>) : (
			<Redirect to={{pathname: '/login', state: { from: props.location } }}/>
		)
	)}/>
)

export default PrivateRoute;