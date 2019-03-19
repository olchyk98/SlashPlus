import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

// TODO: Fix -> cannot destroy 'userid' cookie

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import api from '../../api';
import client from '../../apollo';
import { shortNumber } from '../../utils';
import links from '../../links';

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
                value={ shortNumber(this.props.colors) }
                info="Added unique colors into our collection"
            />
            <AccountStatsCard
                title="Added color palettes"
                icon={ faPalette }
                icolor="orange"
                value={ shortNumber(this.props.palettes) }
                info="Added unique color palettes into our collection"
            />
            <AccountStatsCard
                title="Added fonts"
                icon={ faFont }
                icolor="#30E7ED"
                value={ shortNumber(this.props.fonts) }
                info="Added unique fonts into our collection"
            />
            <AccountStatsCard
                title="Wrote articles"
                icon={ faFileAlt }
                icolor="#C09268"
                value={ shortNumber(this.props.articles) }
                info="Submited articles"
            />
            <AccountStatsCard
                title="Verified articles"
                icon={ faEnvelopeOpenText }
                icolor="rebeccapurple"
                value={ shortNumber(this.props.acceptedArticles) }
                info="Articles by this user that can be displayed on the main page"
            />
            </div>
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: false
        }
    }

    componentDidMount() {
        this.fetchUser();
    }

    fetchUser = () => {
        let a = this.props.match.params.login;

        this.props.startFetch(true);

        client.query({
            query: gql`
                query($targetLogin: String) {
                    user(targetLogin: $targetLogin) {
                        id,
                        avatar,
                        name,
                        permission,
                        colorsInt,
                        fontsInt,
                        articlesInt,
                        articlesAcceptedInt,
                        palettesInt
                    }
                }
            `,
            variables: {
                targetLogin: a || null
            }
        }).then(({ data: { user: a } }) => {
            this.props.startFetch(false);
            if(!a) return this.props.history.push(links["HOME_PAGE"].absolute);

            this.setState(() => ({
                user: a
            }))
        }).catch((err) => {
            console.error(err);
            this.props.startFetch(false);
        });
    }

    render() {
        return(
            <div className="rn rn-account">
                <header className="rn-account-header">
                    <div className="rn-account-header-avatar">
                        <img src={ api.storage + this.state.user.avatar } alt="user" />
                    </div>
                    <h2 className="rn-account-header-name">{ this.state.user.name }</h2>
                    <p className="rn-account-header-status">{ this.state.user.permission }</p>
                </header>
                <AccountStats
                    colors={ this.state.user.colorsInt }
                    fonts={ this.state.user.fontsInt }
                    palettes={ this.state.user.palettesInt }
                    articles={ this.state.user.articlesInt }
                    acceptedArticles={ this.state.user.articlesAcceptedInt }
                />
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
	startFetch: payload => ({ type: 'SET_FETCH_STATUS', payload })
}

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Hero);
