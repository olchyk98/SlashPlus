import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import client from '../../apollo';
import links from '../../links';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import parseHTML from 'html-react-parser';
import FlipMove from 'react-flip-move';

class Article extends Component {
    constructor(props) {
        super(props);

        this.state = {
            HTMLContent: null,
            contentHidden: false,
            isLoading: false
        }
    }

    loadContent = () => {
        if(this.state.isLoading) return;

        this.setState(() => ({ isLoading: true }), () => this.props.startFetch(true));

        client.query({
            query: gql`
                query($id: ID!) {
                    getArticleItem(id: $id) {
                        id,
                        contentHTML
                    }
                }
            `,
            variables: {
                id: this.props.id
            }
        }).then(({ data: { getArticleItem: a } }) => {
            this.setState(() => ({ isLoading: false }), () => this.props.startFetch(false));

            if(!a) return;

            this.setState(() => ({
                HTMLContent: a.contentHTML
            }));
        }).catch((err) => {
            console.error(err);
            this.setState(() => ({ isLoading: false }), () => this.props.startFetch(false));
        });
    }

    reject = () => {
        this.props.onClose();
        client.mutate({
            mutation: gql`
                mutation($id: ID!, $target: String!) {
                    verifyAsset(id: $id, isVerified: false, target: $target)
                }
            `,
            variables: {
                id: this.props.id,
                target: "ARTICLE"
            }
        }).catch(console.error);
    }

    submit = () => {
        this.props.onClose();
        client.mutate({
            mutation: gql`
                mutation($id: ID!, $target: String!) {
                    verifyAsset(id: $id, isVerified: true, target: $target)
                }
            `,
            variables: {
                id: this.props.id,
                target: "ARTICLE"
            }
        }).catch(console.error);
    }

    render() {
        return(
            <div className="rn-verifications-item rn-verifications-article">
                <p className="rn-verifications-item-title">{ this.props.title }</p>
                <button className="rn-verifications-article-togglem definp btn" onClick={
                    (!this.state.HTMLContent) ? this.loadContent : (
                        () => this.setState(({ contentHidden: a }) => ({ contentHidden: !a }))
                    )
                }>
                    {
                        (!this.state.HTMLContent) ? "Load content" : (!this.state.contentHidden) ? (
                            "Hide content"
                        ) : "Show content"
                    }
                </button>
                <span className="rn-articledisp-cover rn-verifications-article-title-preview">
                    {
                        (
                            !this.state.contentHidden &&
                            this.state.HTMLContent &&
                            parseHTML(this.state.HTMLContent)
                        ) || this.props.content
                    }
                </span>
                <div className="rn-verifications-item-submit">
                    <button className="reject definp" onClick={ this.reject }>Reject</button>
                    <button className="submit definp" onClick={ this.submit }>Submit</button>
                </div>
            </div>
        );
    }
}

Article.propTypes = {
    startFetch: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
}

class Font extends PureComponent {
    componentDidMount() {
        this.loadFont();
    }

    loadFont = () => {
        const a = document.createElement('link');
        a.setAttribute('rel', 'stylesheet');
        a.setAttribute('type', 'text/html');
        a.setAttribute('href', this.props.src);
        document.head.appendChild(a);
    }

    reject = () => {
        this.props.onClose();
        client.mutate({
            mutation: gql`
                mutation($id: ID!, $target: String!) {
                    verifyAsset(id: $id, isVerified: false, target: $target)
                }
            `,
            variables: {
                id: this.props.id,
                target: "FONT"
            }
        }).catch(console.error);
    }

    submit = () => {
        this.props.onClose();
        client.mutate({
            mutation: gql`
                mutation($id: ID!, $target: String!) {
                    verifyAsset(id: $id, isVerified: true, target: $target)
                }
            `,
            variables: {
                id: this.props.id,
                target: "FONT"
            }
        }).catch(console.error);
    }

    render() {
        return(
            <div className="rn-verifications-item rn-verifications-font">
                <p className="rn-verifications-item-title" style={{ fontFamily: this.props.execName }}>{ this.props.name }</p>
                <span>SRC is valid: <strong>{ (!!this.props.src).toString() }</strong></span>
                <span>Font exec name: <strong>{ this.props.execName }</strong></span>
                <div className="rn-verifications-item-submit">
                    <button className="reject definp" onClick={ this.reject }>Reject</button>
                    <button className="submit definp" onClick={ this.submit }>Submit</button>
                </div>
            </div>
        );
    }
}

Font.propTypes = {
    src: PropTypes.string.isRequired,
    execName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            verified: false,
            toVerificate: null,
            isLoading: false
        }
    }

    componentDidMount() {
        this.beginVes();
    }

    beginVes = () => {
        const castOut = (e = null) => {
            if(e) console.error(e);
            this.props.history.push(links["HOME_PAGE"].absolute);
        }

        this.props.startFetch(true);

        client.query({
            query: gql`
                query {
                    user {
                        id,
                        role
                    }
                }
            `
        }).then(({ data: { user: a } }) => {
            if(!a || a.role !== 'main') {
                this.props.startFetch(false);
                return castOut();
            }

            this.setState(() => ({
                verified: a.role === 'main'
            }));
            this.getData();
        }).catch((err) => {
            castOut(err);
            this.props.startFetch(false);
        });
    }

    getData = () => {
        if(this.state.isLoading) return;

        this.setState(() => ({ isLoading: true }), () => this.props.startFetch(true));

        client.query({
            query: gql`
                query {
                    getToVerifyFonts {
                        id,
                        src,
                        name,
                        fontName
                    },
                    getToVerifyArticles {
                        id,
                        title,
                        previewContent
                    }
                }
            `
        }).then(({ data: { getToVerifyFonts: a, getToVerifyArticles: b } }) => {
            this.setState(() => ({ isLoading: false }), () => this.props.startFetch(false));

            if(!a || !b) return;

            this.setState(() => ({
                toVerificate: [
                    ...a.map(io => ({ ...io, __type: "FONT" })),
                    ...b.map(io => ({ ...io, __type: "ARTICLE" }))
                ].sort(() => Math.random() - 0.5)
            }));
        }).catch((err) => {
            console.error(err);
            this.setState(() => ({ isLoading: false }), () => this.props.startFetch(false));
        });
    }

    hideItem = id => this.setState(({ toVerificate: a }) => ({
        toVerificate: a.filter(io => io.id !== id)
    }));

    render() {
        if(!this.state.verified || !this.state.toVerificate) return null;

        return(
            <FlipMove className="rn rn-verifications" enterAnimation="elevator" leaveAnimation="elevator">
                {
                    this.state.toVerificate.map((session) => {
                        if(session.__type === "FONT") {
                            return(
                                <Font
                                    key={ session.id }
                                    src={ session.src }
                                    id={ session.id }
                                    execName={ session.fontName }
                                    name={ session.name }
                                    onClose={ () => this.hideItem(session.id) }
                                />
                            );
                        } else if(session.__type === "ARTICLE") {
                            return(
                                <Article
                                    key={ session.id }
                                    id={ session.id }
                                    title={ session.title }
                                    content={ session.previewContent }
                                    startFetch={ this.props.startFetch }
                                    onClose={ () => this.hideItem(session.id) }
                                />
                            );
                        } else {
                            console.error(`Invalid content type: ${ session.__type }`);
                            return null;
                        }
                    })
                }
            </FlipMove>
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
