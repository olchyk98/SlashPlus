/* eslint-disable import/first */

import React, { Component, PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import './main.css';

import { ChromePicker } from 'react-color';
import { gql } from 'apollo-boost';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnderline, faQuoteRight, faListUl, faListOl, faBold, faCode, faFont, faItalic, faFileImage, faTimes, faHeading } from '@fortawesome/free-solid-svg-icons';
import { EditorState, RichUtils, AtomicBlockUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import Editor, { composeDecorators } from "draft-js-plugins-editor";
import createImagePlugin from 'draft-js-image-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';

const focusPlugin = createFocusPlugin();
const blockDndPlugin = createBlockDndPlugin();

const decorator = composeDecorators(
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

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

const AddArticleToolsItem = ({ icon, _onClick, active, aStyle }) => (
    <button className={constructClassName({
        "definp btn rn-create-addarticle-tools-btn": true,
        "active": active,
        [aStyle]: !!aStyle
    })} onMouseDown={ e => { e.preventDefault(); _onClick(e) } }>
        <FontAwesomeIcon icon={ icon } />
    </button>
);

AddArticleToolsItem.propTypes = {
    icon: PropTypes.object.isRequired,
    _onClick: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
    aStyle: PropTypes.string
}

class AddArticleTools extends PureComponent {
    render() {
        return(
            <menu className="rn-create-addarticle-tools">
                <button className="definp btn rn-create-addarticle-tools-tomodal" onClick={ this.props.onRegTitle }>Add title</button>
                <div className="rn-create-addarticle-tools-mat">
                    {
                        [
                            {
                                icon: faBold,
                                styleType: "BOLD"
                            },
                            {
                                icon: faItalic,
                                styleType: "ITALIC"
                            },
                            {
                                icon: faUnderline,
                                styleType: "UNDERLINE"
                            },
                            {
                                icon: faQuoteRight,
                                blockType: "blockquote"
                            },
                            {
                                icon: faCode,
                                blockType: "code-block"
                            },
                            {
                                icon: faListUl,
                                blockType: "unordered-list-item"
                            },
                            {
                                icon: faListOl,
                                blockType: "ordered-list-item"
                            },
                            {
                                icon: faFont,
                                blockType: "header-one",
                                astyle: "font-head-one"
                            },
                            {
                                icon: faFont,
                                blockType: "header-two",
                                astyle: "font-head-two"
                            },
                            {
                                icon: faFont,
                                blockType: "header-three",
                                astyle: "font-head-three"
                            },
                            {
                                icon: faFont,
                                blockType: "header-four",
                                astyle: "font-head-four"
                            },
                            {
                                icon: faFont,
                                blockType: "header-five",
                                astyle: "font-head-five"
                            },
                            {
                                icon: faFileImage,
                                action: this.props.addImage
                            }
                        ].map(({ icon, styleType, blockType, action, astyle }, index) => (
                            <AddArticleToolsItem
                                key={ index }
                                icon={ icon }
                                aStyle={ astyle }
                                active={!!(
                                    (styleType && this.props.currentStyle.has(styleType)) ||
                                    (blockType && this.props.currentBlock === blockType)
                                )}
                                _onClick={(!action) ? (
                                    e => { e.preventDefault(); this.props.applyStyle(styleType || blockType) }
                                ) : (action)}
                            />
                        ))
                    }
                </div>
                <button disabled={ !this.props.canPublish } onClick={ this.props.onPublish } className="definp btn rn-create-addarticle-tools-tomodal">Publish</button>
            </menu>
        );
    }
}

class AddArticleImageModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            srcIsValid: null,
            src: ""
        }
    }

    checkURL = () => {
        const v = a => this.setState({ srcIsValid: a });
        if(!this.state.src.replace(/\s|\n/g, "").length) return v(false);

        const a = new Image();
        a.src = this.state.src;

        v(false); // while loads
        a.onload = () => v(true);
        a.onerror = () => v(false);
    }

    render() {
        return(
            <>
                <div onClick={ this.props.onClose } className={constructClassName({
                    "rn-create-addarticle-addnim__bg": true,
                    "active": this.props.inFocus
                })} />
                <div className="rn-create-addarticle-addnim">
                    <button onClick={ this.props.onClose } className="rn-create-addarticle-close definp btn">
                        <FontAwesomeIcon icon={ faTimes } />
                    </button>
                    <div className="rn-create-addarticle-addnim-icon">
                        <FontAwesomeIcon icon={ faFileImage } />
                    </div>
                    <h2 className="rn-create-addarticle-addnim-title">
                        Paste image URL
                    </h2>
                    <input
                        type="text"
                        placeholder="Image URL"
                        className="rn-create-addarticle-addnim-url definp"
                        onChange={ ({ target: { value: a } }) => this.setState({ src: a }, this.checkURL) }
                    />
                    <button onClick={ () => { this.props._onSubmit(this.state.src); this.props.onClose(); } } disabled={ !this.state.srcIsValid } className={constructClassName({
                        "rn-create-addarticle-addnim-submit definp btn": true,
                        "offline": !this.state.srcIsValid
                    })}>Submit</button>
                </div>
            </>
        );
    }
}

AddArticleImageModal.propTypes = {
    _onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    inFocus: PropTypes.bool.isRequired
}

class AddArticleSettingsModal extends PureComponent {
    constructor(props) {
        super(props);

        this.data = {
            title: ""
        }
    }

    render() {
        return(
            <>
                <div onClick={ this.props.onClose } className={constructClassName({
                    "rn-create-addarticle-settings__bg": true,
                    "active": this.props.inFocus
                })} />
                <div className="rn-create-addarticle-settings">
                    <button onClick={ this.props.onClose } className="rn-create-addarticle-close definp btn">
                        <FontAwesomeIcon icon={ faTimes } />
                    </button>
                    <div className="rn-create-addarticle-addnim-icon">
                        <FontAwesomeIcon icon={ faHeading } />
                    </div>
                    <h2 className="rn-create-addarticle-addnim-title">
                        Add title
                    </h2>
                    <input
                        type="text"
                        placeholder="Article title"
                        className="rn-create-addarticle-addnim-url definp"
                        onChange={ ({ target: { value: a } }) => this.data.title = a }
                    />
                    <button onClick={ () => { this.props._onSubmit(this.data.title); this.props.onClose(); } } className="rn-create-addarticle-addnim-submit definp btn">Submit</button>
                </div>
            </>
        );
    }
}

AddArticleSettingsModal.propTypes = {
    _onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    inFocus: PropTypes.bool.isRequired
}

class AddArticleSubmitModal extends PureComponent {
    render() {
        return(
            <>
                <div onClick={ this.props.onClose } className={constructClassName({
                    "rn-create-addarticle-submitmodal__bg": true,
                    "active": this.props.inFocus
                })} />
                <div className="rn-create-addarticle-submitmodal">
                    <button onClick={ this.props.onClose } className="rn-create-addarticle-close definp btn">
                        <FontAwesomeIcon icon={ faTimes } />
                    </button>
                    <div className="rn-create-addarticle-addnim-icon">
                        <FontAwesomeIcon icon={ faHeading } />
                    </div>
                    <h2 className="rn-create-addarticle-addnim-title">
                        Are you sure that you want to submit?
                    </h2>
                    <p className="rn-create-addarticle-addnim-content">
                        You won't be able to change content after publication. Your article will be sent to administration, they can apply or deny your article.
                        Anyway your visitors are able to see even denied articles. <strong>After you click submit button we will redirect you to the home page.</strong>
                    </p>
                    <button onClick={ () => { this.props._onSubmit(); this.props.onClose(); } } className="rn-create-addarticle-addnim-submit definp btn">Submit</button>
                </div>
            </>
        );
    }
}

AddArticleSubmitModal.propTypes = {
    _onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    inFocus: PropTypes.bool.isRequired
}

class AddArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
            currentBlock: null,
            addImageModal: false,
            addSettingsModal: false,
            articleTitle: "",
            submitArticleModal: false
        }
    }

    getEditorBlock = () => {
		let a = this.state.editorState;
	    return a.getCurrentContent()
	          .getBlockForKey(a.getSelection().getStartKey())
	          .getType();
	}

    editText = (state = null, action = "") => {
		if(!state && !action) throw new Error("Editor: Invalid arguments pack");

		let a = {
			"ITALIC": "toggleInlineStyle",
			"BOLD": "toggleInlineStyle",
			"UNDERLINE": "toggleInlineStyle",
			"header-one": "toggleBlockType",
			"header-two": "toggleBlockType",
			"header-three": "toggleBlockType",
			"header-four": "toggleBlockType",
			"header-five": "toggleBlockType",
			"ordered-list-item": "toggleBlockType",
			"unordered-list-item": "toggleBlockType",
			"code-block": "toggleBlockType",
			"blockquote": "toggleBlockType"
		}

		if(Object.keys(a).includes(action)) {
			state = RichUtils[a[action]](
				this.state.editorState,
				action
			);
		} else if(!state) {
			return console.error("Editor: Invlid action");
		}

		this.setState(() => ({
			editorState: state
		}));
	}

    addImage = (src) => {
        const a = this.state.editorState.getCurrentContent();
        const b = a.createEntity(
          "image",
          "IMMUTABLE",
          { src }
        );

        const c = b.getLastCreatedEntityKey();
        const d = EditorState.set(this.state.editorState, {
          currentContent: b
        });

        this.setState(() => ({
            editorState: AtomicBlockUtils.insertAtomicBlock(d, c, " ")
        }));
    }

    publishArticle = () => {
        if(
            !this.state.articleTitle.replace(/\s|\n/g, "").length ||
            !this.state.editorState.getCurrentContent().hasText()
        ) return;

        this.props.startFetch(true);

        client.mutate({
            mutation: gql`
                mutation($title: String!, $contentHTML: String!) {
                    addArticle(title: $title, contentHTML: $contentHTML) {
                        id
                    }
                }
            `,
            variables: {
                title: this.state.articleTitle,
                contentHTML: stateToHTML(this.state.editorState.getCurrentContent())
            }
        }).then(({ data: { addArticle: a } }) => {
            this.props.startFetch(false);

            if(!a) {
                alert("An error occured, please try to reload the page.");
                return;
            }

            this.props.pushHistory(links["HOME_PAGE"].absolute);
        }).catch((err) => {
            this.props.startFetch(false);
            console.error(err);
        });
    }

    render() {
        return(
            <div className="rn-create-addarticle">
                <AddArticleImageModal
                    inFocus={ this.state.addImageModal }
                    _onSubmit={ this.addImage }
                    onClose={ () => this.setState({ addImageModal: false }) }
                />
                <AddArticleSettingsModal
                    inFocus={ this.state.addSettingsModal }
                    _onSubmit={ (title) => this.setState({ articleTitle: title }) }
                    onClose={ () => this.setState({ addSettingsModal: false }) }
                />
                <AddArticleSubmitModal
                    inFocus={ this.state.submitArticleModal }
                    _onSubmit={ this.publishArticle }
                    onClose={ () => this.setState({ submitArticleModal: false }) }
                />
                <AddArticleTools
                    applyStyle={ style => this.editText(null, style) }
                    currentBlock={ this.state.currentBlock }
                    currentStyle={ this.state.editorState.getCurrentInlineStyle() }
                    addImage={ () => this.setState({ addImageModal: true }) }
                    canPublish={
                        this.state.articleTitle.replace(/\s|\n/g, "").length &&
                        this.state.editorState.getCurrentContent().hasText()
                    }
                    onPublish={ () => this.setState({ submitArticleModal: true }) }
                    onRegTitle={ () => this.setState({ addSettingsModal: true }) }
                />
                <div className="rn-create-addarticle-workspace">
                    <Editor
                        onChange={ this.editText }
                        editorState={ this.state.editorState }
                        plugins={[
                          blockDndPlugin,
                          focusPlugin,
                          imagePlugin
                        ]}
                        ref={ ref => this.editorMat = ref }
                        blockStyleFn={a => {
                            let b = a.getType();

                            switch(b) {
                                case 'blockquote': return "rn-create-addarticle-workspace__inc__blockquote";
                                case 'code-block': return "rn-create-addarticle-workspace__inc__code";
                                case 'header-one': return "rn-create-addarticle-workspace__inc__title";
                                default:break;
                            }
                        }}
                    />
                </div>
            </div>
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
                        "ADD_ARTICLE": <AddArticle
                            startFetch={ this.props.startFetch }
                            pushHistory={ this.props.history.push }
                        />,
                        "ADD_PALETTE": <AddPalette startFetch={ this.props.startFetch } />,
                        "ADD_COLOR": <AddColor startFetch={ this.props.startFetch } />
                    }[this.state.stage] || null
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
