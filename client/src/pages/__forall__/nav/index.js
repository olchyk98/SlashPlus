import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { Link } from 'react-router-dom';

import { cookieControl } from '../../../utils';
import links from '../../../links';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';

// https://css-tricks.com/building-progress-ring-quickly/
class ProgressRing extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	progress: 0
        }

        const { radius, stroke } = this.props;

        this.normalizedRadius = radius - stroke * 2;
        this.circumference = this.normalizedRadius * 2 * Math.PI;

        this.inAnimation = this.amDown = false;
    }

    componentDidMount() {
    	this.inAnimation = true;
    	this.progressCircle();
    }

    componentWillUnmount() {
    	clearInterval(this.animationINT);
    	this.inAnimation = this.amDown = false;
    }

    progressCircle = () => {
    	if(!this.inAnimation) return;

    	this.setState(({ progress: a }) => ({
    		progress: a + 2.5
    	}));
    	requestAnimationFrame(this.progressCircle);
    }

    render() {
        const { radius, stroke } = this.props;
        const strokeDashoffset = this.circumference - (this.state.progress / 100) * this.circumference;

        return (
            <svg height={ radius * 2 } width={ radius * 2 }>
                <circle
                    stroke="rebeccapurple"
                    fill="transparent"
                    strokeWidth={ stroke }
                    strokeDasharray={ this.circumference + " " + this.circumference }
                    style={{ strokeDashoffset }}
                    r={ this.normalizedRadius }
                    cx={ radius }
                    cy={ radius }
                />
            </svg>
        );
    }
}

class LoginModalInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inFocus: false
        }
    }

    render() {
        return(
            <div className="gl-nav-loginmodal-input">
                <div>
                    <div className="gl-nav-loginmodal-input-icon">
                        <FontAwesomeIcon icon={ this.props.icon } />
                    </div>
                    <input
                        type={ this.props._type }
                        className="definp"
                        placeholder={ this.props._placeholder }
                        onFocus={ () => this.setState({ inFocus: true }) }
                        onBlur={ () => this.setState({ inFocus: false }) }
                        onChange={ ({ target: { value: a } }) => this.props._onChange(a) }
                    />
                </div>
                <div className={ `gl-nav-loginmodal-input-underline${ (!this.state.inFocus) ? "" : " infocus" }` } />
            </div>
        );
    }
}

LoginModalInput.propTypes = {
    _type: PropTypes.string.isRequired,
    _placeholder: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    _onChange: PropTypes.func.isRequired
}

class LoginModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: "LOGIN_STAGE" // LOGIN_STAGE, REGISTER_STAGE
        }
    }

    componentDidUpdate(pProps) {
        if(this.props.active !== pProps.active) {
            this.setState(() => ({
                stage: "LOGIN_STAGE"
            }))
        }
    }

    render() {
        return(
            <>
                <div
                    className={ `gl-nav-loginmodal__bg${ (!this.props.active) ? "" : " active" }` }
                    onClick={ this.props.onClose }
                />
                <div className="gl-nav-loginmodal">
                    <div>
                        <h2 className="gl-nav-loginmodal-title">Welcome back!</h2>
                        <LoginModalInput
                            _type="text"
                            _placeholder="Login"
                            icon={ faUser }
                            _onChange={ value => null }
                        />
                        <LoginModalInput
                            _type="password"
                            _placeholder="Password"
                            icon={ faKey }
                            _onChange={ value => null }
                        />
                        <button className="gl-nav-loginmodal-submit definp btn">Sign up</button>
                    </div>
                </div>
            </>
        );
    }
}

class Hero extends Component {
	constructor(props) {
		super(props);

        this.state = {
            lginModal: false,
            clientID: cookieControl.get("userid")
        }

		this.lCircleSize = 40;
	}

	render() {
		return(
            <>
    			<nav className="gl-nav">
    				<Link to={ links["HOME_PAGE"].absolute } className="rn-nav-logo">
    					Home
    				</Link>
    				<div className="rn-nav-loading">
    					{
    						(true) ? <>/+</> : (
    							<ProgressRing
    								radius={ this.lCircleSize / 2 }
    								stroke={ 4 }
    							/>
    						)
    					}
    				</div>
                    {
                        (this.state.clientID) ? (
                            <Link to="/">Mark Stalker</Link>
                        ) : (
                            <button onClick={() => {
                                if(this.state.clientID) return;

                                this.setState(() => ({
                                    lginModal: true
                                }));
                            }} className="definp btn">Login</button>
                        )    
                    }
    			</nav>
                <LoginModal
                    active={ this.state.lginModal }
                    onClose={ () => this.setState(() => ({ lginModal: false })) }
                />
            </>
		);
	}
}

export default Hero;