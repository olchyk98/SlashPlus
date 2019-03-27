import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import client from '../../apollo';

import Font from '../__forall__/font';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fonts: null,
            isLoading: false
        }
    }

    componentDidMount() {
        this.fetchFonts();
    }

    fetchFonts = () => {
        if(this.state.isLoading) return;

        this.setState(() => ({
            isLoading: true
        }));

        this.props.startFetch(true);

        client.query({
            query: gql`
                query($limit: Int!) {
                    getFonts(limit: $limit) {
                        id,
                        name,
                        fontName,
                        src
                    }
                }
            `,
            variables: {
                limit: 20
            }
        }).then(({ data: { getFonts: a } }) => {
            this.props.startFetch(false);
            this.setState(() => ({
                isLoading: false
            }));

            if(!a) return;

            this.setState(() => ({
                fonts: a
            }));
        }).catch((err) => {
            console.error(err);
            this.props.startFetch(false);
            this.setState(() => ({
                isLoading: false
            }));
        })
    }

    render() {
        return(
            <div className="rn rn-fonts">
                <h1 className="rn__middle__title">Fonts</h1>
                <button className="definp btn rn-palettes-rand" onClick={ () => this.fetchFonts() }>
                    <FontAwesomeIcon icon={ faRedo } />
                </button>
                <div className="rn-sections-item-content rn-palettes-grid flex">
                    {
                        (this.state.fonts) ? (
                            this.state.fonts.map(({ id, name, fontName, src }) => (
                                <Font
                                    key={ id }
                                    name={ name }
                                    font={ fontName }
                                    src={ src }
                                />
                            ))
                        ) : null
                    }
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
