import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import client from '../../apollo';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            colors: false,
            isLoading: false
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        if(this.state.isLoading) return;

        this.setState(() => ({
            isLoading: true
        }));

        this.props.startFetch(true);

        client.query({
            query: gql`
                query($colorsLimit: Int!) {
                    getColors(limit: $colorsLimit) {
                        id,
                        color
                    }
                }
            `,
            variables: {
                colorsLimit: 10
            }
        }).then(({ data: { getColors: a } }) => {
            this.props.startFetch(false);
            this.setState(() => ({
                isLoading: false
            }));

            if(!a) return;

            this.setState(() => ({
                colors: a
            }));
        }).catch((err) => {
            console.error(err);
            this.props.startFetch(false);
            this.setState(() => ({
                isLoading: false
            }));
        });
    }

    render() {
        return(
            <div className="rn rn-colors">
                <h1 className="rn__middle__title">Colors</h1>
                <button className="definp btn rn-palettes-rand" onClick={ () => this.fetchData() }>
                    <FontAwesomeIcon icon={ faRedo } />
                </button>
                <div className="rn-sections-item-content grid rn-palettes-grid">
                    {
                        (this.state.colors) ? (
                            this.state.colors.map(({ color }, index) => (
                                <div
                                    key={ index }
                                    onClick={() => {
                                        // Alternative: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
                                        // But doesn't work in Edge and IE

                                        const el = document.createElement('textarea');
                                        el.class = "hidden";
                                        el.value = color;
                                        document.body.appendChild(el);
                                        el.select();
                                        document.execCommand('copy');
                                        document.body.removeChild(el);

                                        this.props.castAlert(<>Color <strong>{ color }</strong> was copied to clipboard!</>);
                                    }}
                                    className="rn-sections-item-palette">
                            		<div style={{ background: color }} />
                            	</div>
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
	startFetch: payload => ({ type: 'SET_FETCH_STATUS', payload }),
    castAlert: message => ({ type: "PUSH_ALERTION_STATE", payload: { message } })
}

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Hero);
