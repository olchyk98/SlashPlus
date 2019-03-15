import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';

import links from '../../../links';

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

class Hero extends Component {
	constructor(props) {
		super(props);

		this.lCircleSize = 40
	}

	render() {
		return(
			<nav className="gl-nav">
				<Link to={ links["HOME_PAGE"].absolute } className="rn-nav-logo">
					Home
				</Link>
				<div className="rn-nav-loading">
					{
						(true) ? null : (
							<ProgressRing
								radius={ this.lCircleSize / 2 }
								stroke={ 4 }
							/>
						)
					}
				</div>
				<Link to="/">Mark Stalker</Link>
			</nav>
		);
	}
}

export default Hero;