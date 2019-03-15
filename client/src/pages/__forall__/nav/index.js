import React, { Component } from 'react';
import './main.scss';

class Hero extends Component {
	render() {
		return(
			<nav className="gl-nav">
				<span className="rn-nav-logo">
					Elements
				</span>
				<div className="rn-nav-ldots">
					<div />
					<div />
					<div />
				</div>
				<span>Mark Stalker</span>
			</nav>
		);
	}
}

export default Hero;