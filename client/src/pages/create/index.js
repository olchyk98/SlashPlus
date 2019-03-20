import React, { Component, PureComponent } from 'react';
import './main.css';

import { ChromePicker } from 'react-color';
import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import { constructClassName } from '../../utils';
import client from '../../apollo';
import links from '../../links';

class Menu extends PureComponent {
    render() {
        return(
            <div className="rn-create-menu">
                {
                    [
                        {
                            title: "Add Font",
                            stage: "ADD_FONT"
                        },
                        {
                            title: "Add Article",
                            stage: "ADD_ARTICLE"
                        },
                        {
                            title: "Add Color Palette",
                            stage: "ADD_PALETTE"
                        },
                        {
                            title: "Add Color",
                            stage: "ADD_COLOR"
                        }
                    ].map(({ title, stage }, index) => (
                        <button key={ index } onClick={ () => this.props.forward(stage) } className="rn-create-menu-btn definp btn">{ title }</button>
                    ))
                }
            </div>
        );
    }
}
class AddFont extends PureComponent {
    render() {
        return(
            null
        );
    }
}
class AddColor extends Component {
    constructor(props) {
        super(props);

        this.initCol = "#333";

        this.state = {
            color: this.initCol,
            isSubmitting: false,
            message: {
                active: false,
                message: "",
                isError: false
            }
        }
    }

    castMessage = (active = false, message = "", isError = false) => { // @defaults -> disable
        this.setState(() => ({
            message: { active, message, isError }
        }));
    }

    addColor = () => {
        if(this.state.isSubmitting || this.initCol === this.state.color) return;

        this.setState(() => ({
            isSubmitting: true
        }));
        this.props.startFetch(true);

        client.mutate({
            mutation: gql`
                mutation($color: String!) {
                    addColor(color: $color) {
                        id
                    }
                }
            `,
            variables: {
                color: this.state.color
            }
        }).then(({ data: { addColor: a } }) => {
            this.props.startFetch(false);
            this.setState(() => ({
                isSubmitting: false
            }));

            if(!a) {
                this.setState(() => ({
                    status: {
                        active: true
                    }
                }));
                console.error(`Error -> Server responsed ${ a }`);
                this.castMessage(true, "Seems like we already have this color in our collection.", true);
                return;
            }

            this.castMessage(true, "Thanks for adding a new color to our collection!", false);
        }).catch((err) => {
            console.error(err);
            this.castMessage(true, "Something went wrong", true);
        });
    }

    render() {
        return(
            <>
                <ChromePicker
                    className="rn-create-article-cpicker"
                    color={ this.state.color }
                    onChange={ ({ hex: a }) => this.setState({ color: a }) }
                />
                {
                    (!this.state.message.active) ? null : (
                        <p className={constructClassName({
                            "rn-create-article-error": true,
                            "error": this.state.message.isError,
                            "success": !this.state.message.isError
                        })}>{ this.state.message.message }</p>
                    )
                }
                <button disabled={ this.state.isSubmitting } onClick={ this.addColor } className="rn-create-article-cadd definp btn">Add</button>
            </>
        )
    }
}
class AddPalette extends PureComponent {
    render() {
        return(
            null
        );
    }
}
class AddArticle extends PureComponent {
    render() {
        return(
            null
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: "SELECT_PART" // SELECT_PART, ADD_FONT, ADD_ARTICLE, ADD_PALETTE, ADD_COLOR
        }
    }

    componentDidMount() {
        let stageP = {
            "article": "ADD_ARTICLE",
            "font": "ADD_FONT",
            "palette": "ADD_ARTICLE",
            "color": "ADD_COLOR"
        }[ this.props.match.params.part ]

        if(stageP) this.setState({ stage: stageP })
    }

    forwardStage = stage => {
        const stageoptions = {
            "ADD_FONT": { aurl: '/font' },
            "ADD_PALETTE": { aurl: '/palette' },
            "ADD_ARTICLE": { aurl: '/article' },
            "ADD_COLOR": { aurl: '/color' }
        }[stage];

        window.history.pushState(null, null, `${ links["CREATE_PAGE"].absolute }${ (stageoptions && stageoptions.aurl) || "" }`);
        this.setState(() => ({ stage }));
    }

    render() {
        return(
            <div className="rn rn-create">
                {
                    {
                        "SELECT_PART": <Menu forward={ stage => this.forwardStage(stage) } />,
                        "ADD_FONT": <AddFont startFetch={ this.props.startFetch } />,
                        "ADD_ARTICLE": <AddArticle startFetch={ this.props.startFetch } />,
                        "ADD_PALETTE": <AddPalette startFetch={ this.props.startFetch } />,
                        "ADD_COLOR": <AddColor startFetch={ this.props.startFetch } />
                    }[this.state.stage] || (console.error("Invalid Stage") || null) // DEBUG
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
