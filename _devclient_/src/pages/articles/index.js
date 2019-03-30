import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import client from '../../apollo';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

import Article from '../__forall__/article';

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: false,
            isLoading: false
        }
    }

    componentDidMount() {
        this.fetchArticles();
    }

    fetchArticles = () => {
        if(this.state.isLoading) return;

        this.setState(() => ({ isLoading: true }), () => this.props.startFetch(true));

        client.query({
            query: gql`
                query($limit: Int!) {
                    getArticles(limit: $limit) {
                        id,
                        previewContent,
                        title
                    }
                }
            `,
            variables: {
                limit: 15
            }
        }).then(({ data: { getArticles: a } }) => {
            this.setState(() => ({ isLoading: false }), () => this.props.startFetch(false));

            if(!a) return;

            this.setState(() => ({
                articles: a
            }));
        }).catch((err) => {
            console.error(err);
            this.setState(() => ({ isLoading: false }), () => this.props.startFetch(false));
        });
    }

    render() {
        return(
            <div className="rn rn-articles">
                <h1 className="rn__middle__title">Articles</h1>
                <button className="definp btn rn-palettes-rand" onClick={ this.fetchArticles }>
                    <FontAwesomeIcon icon={ faRedo } />
                </button>
                <div className="rn-sections-item-content grid rn-palettes-grid">
                    {
                        (this.state.articles) ? (
                            this.state.articles.map(({ id, previewContent, title }, index) => (
                                <Article
                                    key={ id }
                                    id={ id }
                                    content={ previewContent }
                                    title={ title }
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
