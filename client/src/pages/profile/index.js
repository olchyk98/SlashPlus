import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

// TODO: Fix -> cannot destroy 'userid' cookie

import { shortNumber } from '../../utils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faFillDrip, faFont, faEnvelopeOpenText, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const image = "https://www.w3schools.com/w3css/img_lights.jpg";

class AccountStatsCardIcon extends PureComponent {
    render() {
        return(
            <div className="rn-account-stats-card-title-icon" style={{
                "--color": this.props.color
            }}>
                <FontAwesomeIcon icon={ this.props.icon } />
            </div>
        );
    }
}

AccountStatsCardIcon.propTypes = {
    icon: PropTypes.object.isRequired,
    color: PropTypes.string.isRequired
}

class AccountStatsCard extends PureComponent {
    render() {
        return(
            <div className="rn-account-stats-card">
                <div className="rn-account-stats-card-title">
                    <span className="rn-account-stats-card-title-mat">
                        { this.props.title }
                    </span>
                    <AccountStatsCardIcon
                        icon={ this.props.icon }
                        color={ this.props.icolor }
                    />
                </div>
                <span className="rn-account-stats-card-value">{ this.props.value }</span>
                <span className="rn-account-stats-card-info">{ this.props.info }</span>
            </div>
        );
    }
}

AccountStatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    icolor: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    info: PropTypes.string.isRequired
}

class AccountStats extends Component {
    render() {
        return(
            <div className="rn-account-display rn-account-stats">
            <AccountStatsCard
                title="Added colors"
                icon={ faFillDrip }
                icolor="red"
                value={ shortNumber(4329) }
                info="Added unique colors into our collection"

            />
            <AccountStatsCard
                title="Added color palettes"
                icon={ faPalette }
                icolor="orange"
                value={ shortNumber(49182) }
                info="Added unique color palettes into our collection"

            />
            <AccountStatsCard
                title="Added fonts"
                icon={ faFont }
                icolor="#30E7ED"
                value={ shortNumber(4441) }
                info="Added unique fonts into our collection"

            />
            <AccountStatsCard
                title="Wrote articles"
                icon={ faEnvelopeOpenText }
                icolor="#C09268"
                value={ shortNumber(435511) }
                info="Submited articles"

            />
            <AccountStatsCard
                title="Added articles"
                icon={ faFileAlt }
                icolor="rebeccapurple"
                value={ shortNumber(414) }
                info="Accepted articles by this user"

            />
            </div>
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: "MAIN_STAGE" // MAIN_STAGE
        }
    }

    render() {
        return(
            <div className="rn rn-account">
                <header className="rn-account-header">
                    <div className="rn-account-header-avatar">
                        <img src={ image } alt="user" />
                    </div>
                    <h2 className="rn-account-header-name">Oles Odynets</h2>
                    <p className="rn-account-header-status">user</p>
                </header>
                <AccountStats />
            </div>
        );
    }
}

export default Hero;
