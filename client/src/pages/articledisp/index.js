import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import parseHTML from 'html-react-parser';

import client from '../../apollo';
import links from '../../links';

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            article: false
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;

        this.loadArticle(id);
    }

    loadArticle = id => {
        this.props.startFetch(true);

        client.query({
            query: gql`
                query($id: ID!) {
                    readArticle(id: $id) {
                        id,
                        title,
                        contentHTML,
                        date,
                        creator {
                            id,
                            name,
                            login
                        }
                    }
                }
            `,
            variables: { id }
        }).then(({ data: { readArticle: a } }) => {
            this.props.startFetch(false);

            if(!a) return;

            this.setState(() => ({
                article: a
            }));
        }).catch((err) => {
            console.error(err);
            this.props.startFetch(false);
        });
    }

    render() {
        return(
            <div className="rn rn-articledisp">
                {
                    (this.state.article) ? (
                        <div className="rn-articledisp-cover">
                            <h1 class="rn-articledisp-title">
                                { this.state.article.title }
                            </h1>
                            <p class="rn-articledisp-date">By <Link to={ `${ links["ACCOUNT_PAGE"].absolute }/${ this.state.article.creator.login }` }>{ this.state.article.creator.name }</Link></p>
                            { parseHTML(this.state.article.contentHTML) }
                        </div>
                    ) : null
                }
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
