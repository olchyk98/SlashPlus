import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import client from '../../apollo';

import Article from '../__forall__/article';

class Hero extends Component {
    render() {
        return(
            <div className="rn rn-articles">
                <h1 className="rn__middle__title">Articles</h1>
                <div className="rn-sections-item-content grid rn-palettes-grid">

                </div>
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
