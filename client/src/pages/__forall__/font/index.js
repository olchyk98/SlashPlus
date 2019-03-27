import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import api from '../../../api';

class Hero extends PureComponent {
	download(src) {
		const a = document.createElement("a");
		a.href = api.storage + src;
		console.log(src);
		a.click();
	}

	render() {
		return(
			<button onClick={ () => this.download(this.props.src) } className="rn-sections-item-content-font definp" style={{ fontFamily: this.props.font }}>
				{ this.props.name }
			</button>
		);
	}
}

Hero.propTypes = {
	src: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	font: PropTypes.string.isRequired
}

export default Hero;
