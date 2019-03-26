import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { connect } from 'react-redux';

import { constructClassName } from '../../../utils';

class Hero extends Component {
	constructor(props) {
		super(props);

		this.state = {
			focusIN: null
		}
	}

	render() {
		return(
			<div className={constructClassName({
				"rn-sections-item-palette": true,
				"infocus": this.props.inFocus
			})} onMouseEnter={ this.props.setFocus }>
				{
					this.props.colors.map((session, index) => (
						<div
							key={ index }
							style={{ background: session }}
							className={ (this.state.focusIN !== index) ? "" : "infocus" }
							onMouseEnter={ () => this.setState({ focusIN: index }) }
                            onClick={() => {
                                this.props.castAlert(<>Color <strong>{ session }</strong> was copied to the clipboard!</>);
                            }}
						/>
					))
				}
			</div>
		);
	}
}

Hero.propTypes = {
	colors: PropTypes.array.isRequired
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    castAlert: message => ({ type: "PUSH_ALERTION_STATE", payload: { message } })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);
