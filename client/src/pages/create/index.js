import React, { Component, PureComponent } from 'react';
import './main.css';

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
class AddArticle extends PureComponent {
    render() {
        return(
            null
        );
    }
}
class AddPalette extends PureComponent {
    render() {
        return(
            null
        );
    }
}
class AddColor extends PureComponent {
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
                        "ADD_FONT": <AddFont />,
                        "ADD_ARTICLE": <AddArticle />,
                        "ADD_PALETTE": <AddPalette />,
                        "ADD_COLOR": <AddColor />
                    }[this.state.stage] || (console.error("Invalid Stage") || null) // DEBUG
                }
            </div>
        );
    }
}

export default Hero;
