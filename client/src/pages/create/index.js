import React, { Component, PureComponent } from 'react';
import './main.css';

import { ChromePicker } from 'react-color';
import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import { constructClassName } from '../../utils';
import client from '../../apollo';
import links from '../../links';

const MessageAsset = ({ active, isError, message }) => (!active) ? null : (
    <p className={constructClassName({
        "rn-create-error": true,
        "error": isError,
        "success": !isError
    })}>{ message }</p>
);

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
class AddFont extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            name: null,
            execName: null,
            isSubmitting: false,
            message: {
                active: false,
                message: "",
                isError: false
            }
        }
    }

    castMessage = (active = false, message = "", isError = false) => {
        this.setState(() => ({
            message: { active, message, isError }
        }));
    }

    addFont = () => {
        if(this.state.isSubmitting) return;

        const { file, execName, name } = this.state;
        if(
            !file ||
            (!execName || !execName.replace(/\s|\n/g, "")) ||
            (!name || !name.replace(/\s|\n/g, ""))
        ) return;

        this.props.startFetch(true);
        this.setState(() => ({
            isSubmitting: true
        }));
        this.castMessage(); // remove prev message

        client.mutate({
            mutation: gql`
                mutation($file: Upload!, $execName: String!, $name: String!) {
                    addFont(file: $file, execName: $execName, name: $name) {
                        id
                    }
                }
            `,
            variables: { execName, file, name }
        }).then(({ data: { addFont: a } }) => {
            this.props.startFetch(false);
            this.setState(() => ({
                isSubmitting: true
            }));

            if(!a) {
                this.castMessage(true, "Font with that name already exists in our collection!", true);
                return;
            }

            this.castMessage(true, "New font was sended to review.", false);
        }).catch((err) => {
            this.props.startFetch(false);
            this.setState(() => ({
                isSubmitting: true
            }));

            this.castMessage(true, "Something went wrong. Please, try later.", true);
            console.error(err);
        })
    }

    render() {
        return(
            <>
                <input
                    type="text"
                    className="rn-create-addfont-it rn-create-addfont-name definp"
                    placeholder="Type the font name"
                    onChange={(e) => {
                        e.persist();

                        if(e.keyCode === 13) {
                            e.preventDefault();
                        } else {
                            this.setState(() => ({
                                name: e.target.value
                            }));
                        }
                    }}
                />
                <div className="rn-create-addfont-it rn-create-addfont-execname">
                    <span>Launch name for this font:</span>
                    <input
                        className="definp"
                        placeholder="execfontname"
                        onChange={ ({ target: { value: a } }) => this.setState({ execName: a }) }
                    />
                </div>
                <input
                    className="rn-create-addfont-it"
                    type="file"
                    accept=".ttf, .otf, .woff, .eot"
                    onChange={ ({ target: { files: [file] } }) => (file) ? this.setState({ file }) : null }
                />
                <MessageAsset { ...this.state.message } />
                <button disabled={ this.state.isSubmitting } onClick={ this.addFont } className="rn-create-article-cadd rn-create-addfont-it definp btn">Send to review</button>
            </>
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
                <MessageAsset { ...this.state.message } />
                <button disabled={ this.state.isSubmitting } onClick={ this.addColor } className="rn-create-article-cadd definp btn">Add</button>
            </>
        )
    }
}
class AddPalette extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            palette: [null, null],
            currCol: "#333",
            isSubmitting: false,
            selectedIndex: 0,
            message: {
                active: false,
                message: "",
                isError: false
            }
        }

        this.maxColors = 6;
    }

    castMessage = (active = false, message = "", isError = false) => {
        this.setState(() => ({
            message: {
                active,
                message,
                isError
            }
        }));
    }

    addColor = () => {
        let a = this.state.palette;
        if(a.length > this.maxColors) return;

        this.setState(() => ({
            palette: a.concat(null)
        }));
    }

    pushColor = () => {
        const a = Array.from(this.state.palette);
        a[this.state.selectedIndex] = this.state.currCol;

        this.setState(() => ({
            palette: a
        }));
    }

    addPalette = () => {
        if(this.state.isSubmitting) return;

        // Check if all cells are filled
        const a = Array.from(this.state.palette);
        if(a.filter(io => io).length !== a.length) return;

        this.props.startFetch(true);

        // ...
        client.mutate({
            mutation: gql`
                mutation($colors: [String]!) {
                    addPalette(colors: $colors) {
                        id
                    }
                }
            `,
            variables: {
                colors: a
            }
        }).then(({ data: { addPalette: a } }) => {
            this.props.startFetch(false);
            if(!a) {
                this.castMessage(true, "Something went wrong", true);
                return;
            }

            this.castMessage(true, "Our collections was successfully updated. Thanks!", false)
        }).catch((err) => {
            console.error(err);
            this.props.startFetch(false);
            this.castMessage(true, "Something went wrong", true);
        });
    }

    render() {
        return(
            <>
                <ChromePicker
                    className="rn-create-article-cpicker"
                    color={ this.state.currCol }
                    onChange={ ({ hex: a }) => this.setState({ currCol: a }) }
                />
                <button className="rn-create-palette-cpush definp btn" onClick={ this.pushColor }>Push</button>

                <div className="rn-create-palette">
                    {
                        this.state.palette.map((session, index) => (
                            <button
                                key={ index }
                                className={constructClassName({
                                    "rn-create-palette-item definp btn": true,
                                    "selected": this.state.selectedIndex === index
                                })}
                                onClick={ () => this.setState({ selectedIndex: index }) }
                                style={{
                                    background: session
                                }}
                            />
                        ))
                    }
                    {
                        (this.state.palette.length <= this.maxColors) ? (
                            <button className="rn-create-palette-item definp btn" onClick={ this.addColor }>+</button>
                        ) : null
                    }
                </div>
                <MessageAsset { ...this.state.message } />
                <button disabled={ this.state.isSubmitting } onClick={ this.addPalette } className="rn-create-article-cadd definp btn">Submit</button>
            </>
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
            "palette": "ADD_PALETTE",
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
