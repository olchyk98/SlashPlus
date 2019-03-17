import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';

import { cookieControl, constructClassName } from '../../../utils';
import links from '../../../links';
import client from '../../../apollo';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faKey, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

// https://css-tricks.com/building-progress-ring-quickly/
class ProgressRing extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	progress: 0
        }

        const { radius, stroke } = this.props;

        this.normalizedRadius = radius - stroke * 2;
        this.circumference = this.normalizedRadius * 2 * Math.PI;

        this.inAnimation = this.amDown = false;
    }

    componentDidMount() {
    	this.inAnimation = true;
    	this.progressCircle();
    }

    componentWillUnmount() {
    	clearInterval(this.animationINT);
    	this.inAnimation = this.amDown = false;
    }

    progressCircle = () => {
    	if(!this.inAnimation) return;

    	this.setState(({ progress: a }) => ({
    		progress: a + 2.5
    	}));
    	requestAnimationFrame(this.progressCircle);
    }

    render() {
        const { radius, stroke } = this.props;
        const strokeDashoffset = this.circumference - (this.state.progress / 100) * this.circumference;

        return (
            <svg height={ radius * 2 } width={ radius * 2 }>
                <circle
                    stroke="rebeccapurple"
                    fill="transparent"
                    strokeWidth={ stroke }
                    strokeDasharray={ this.circumference + " " + this.circumference }
                    style={{ strokeDashoffset }}
                    r={ this.normalizedRadius }
                    cx={ radius }
                    cy={ radius }
                />
            </svg>
        );
    }
}

class LoginModalInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inFocus: false
        }
    }

    static defaultProps = {
        _required: false,
        valid: null
    }

    render() {
        return(
            <div className="gl-nav-loginmodal-input">
                <div>
                    <div className="gl-nav-loginmodal-input-icon">
                        <FontAwesomeIcon icon={ this.props.icon } />
                    </div>
                    <input
                        type={ this.props._type }
                        className="definp"
                        placeholder={ this.props._placeholder }
                        onFocus={ () => this.setState({ inFocus: true }) }
                        onBlur={ () => this.setState({ inFocus: false }) }
                        onChange={ ({ target: { value: a } }) => this.props._onChange(a) }
                        required={ this.props._required }
                        ref={ ref => (this.props._ref) ? this.props._ref(ref) : null }
                    />
                    <div className={constructClassName({
                        "gl-nav-loginmodal-input-icon score": true,
                        "active": this.props.valid !== null,
                        "valid": this.props.valid,
                        "invalid": !this.props.valid
                    })}>
                        {
                            (this.props.valid === null) ? null : (this.props.valid) ? ( // true
                                <FontAwesomeIcon icon={ faCheck } />
                            ) : ( // false
                                <FontAwesomeIcon icon={ faTimes } />
                            )
                        }
                    </div>
                </div>
                <div className={constructClassName({
                    "gl-nav-loginmodal-input-underline": true,
                    "infocus": this.state.inFocus,
                    "loading": this.props.loading,
                    "success": this.props.success,
                    "error": this.props.error
                })} />
            </div>
        );
    }
}

LoginModalInput.propTypes = {
    _type: PropTypes.string.isRequired,
    _placeholder: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    _onChange: PropTypes.func.isRequired,
    _required: PropTypes.bool,
    valid: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    success: PropTypes.bool,
    _ref: PropTypes.func
}

class LoginModalLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            isError: false,
            isSuccess: false
        }

        this.data = {
            login: null,
            password: null
        }

        this._refs = {
            login: React.createRef(),
            password: React.createRef()
        }
    }

    login = () => {
        if(this.state.loading) return;

        const { login, password } = this.data;

        this.setState(() => ({
            loading: true,
            isError: false,
            isSuccess: false
        }));

        client.mutate({
            mutation: gql`
                mutation($login: String!, $password: String!) {
                    loginUser(login: $login, password: $password) {
                        id,
                        name
                    }
                }
            `,
            variables: { login, password }
        }).then(({ data: { loginUser: a } }) => {
            this.setState(() => ({ loading: false }));

            if(!a) {
                this.setState(() => ({
                    isError: true
                }));

                return null;
            }

            for(let ma of Object.values(this._refs)) ma.value = "";

            cookieControl.set("userid", a.id);

            this.props.onAuth();
        }).catch((err) => {
            this.setState(() => ({
                loading: false
            }));
            console.error(err);
        });
    }

    render() {
        return(
            <form onSubmit={ e => { e.preventDefault(); this.login(); } }>
                <h2 className="gl-nav-loginmodal-title">Welcome back!</h2>
                <LoginModalInput
                    _type="text"
                    _placeholder="Login"
                    icon={ faUser }
                    _onChange={ value => this.data.login = value }
                    _required={ true }
                    loading={ this.state.loading }
                    error={ this.state.isError }
                    success={ this.state.isSuccess }
                    _ref={ ref => this._refs.login = ref }
                />
                <LoginModalInput
                    _type="password"
                    _placeholder="Password"
                    icon={ faKey }
                    _onChange={ value => this.data.password = value }
                    _required={ true }
                    loading={ this.state.loading }
                    error={ this.state.isError }
                    success={ this.state.isSuccess }
                    _ref={ ref => this._refs.password = ref }
                />
                <button disabled={ this.state.isSuccess || this.state.loading } type="submit" className="gl-nav-loginmodal-submit definp btn">Enter</button>
                <button disabled={ this.state.isSuccess || this.state.loading } type="button" className="gl-nav-loginmodal-link definp btn" onClick={ () => this.props.route("REGISTER_STAGE") }>Register</button>
            </form>
        );
    }
}

class LoginModalRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emailValid: null,
            loginValid: null,
            validatingFields: false,
            isError: false,
            isSuccess: false,
            loading: false
        }

        this.data = {
            login: null,
            email: null,
            password: null,
            name: null
        }

        this._refs = {
            name: React.createRef(),
            login: React.createRef(),
            password: React.createRef(),
            email: React.createRef()
        }

        this.validateFieldsINT = null;
    }

    register = () => {
        if(this.state.loading) return;

        const { login, email, password, name } = this.data;

        this.setState(() => ({
            loading: true,
            isError: false
        }));

        client.mutate({
            mutation: gql`
                mutation($name: String!, $password: String!, $email: String!, $login: String!) {
                    registerUser(name: $name, password: $password, email: $email, login: $login) {
                        id
                    }
                }
            `,
            variables: { name, password, email, login }
        }).then(({ data: { registerUser: a } }) => {
            this.setState(() => ({
                loading: false
            }));

            if(!a) {
                this.setState(() => ({
                    isError: true
                }))
                return;
            }

            for(let ma of Object.values(this._refs)) ma.value = "";

            this.props.onAuth();
        }).catch((err) => {
            console.error(err);
            this.setState(() => ({
                isError: true
            }));
        });
    }

    validateFields = () => {
        clearTimeout(this.validateFieldsINT);
        this.validateFieldsINT = setTimeout(this.validateUser, 200);
    }

    validateUser = () => {
        if(
            this.state.validatingFields ||
            (
                !this.data.login ||
                !this.data.login.replace(/\s|\n/g, "").length
            ) ||
            (
                !this.data.email ||
                !this.data.email.replace(/\s|\n/g, "").length
            )
        ) return;

        this.setState(() => ({
            validatingFields: true
        }));

        const { login, email } = this.data;

        client.query({
            query: gql`
                query($login: String!, $email: String!) {
                    validateUser(login: $login, email: $email)
                }
            `,
            variables: { login, email }
        }).then(({ data: { validateUser: a } }) => {
            this.setState(() => ({
                validatingFields: false
            }));

            if(!a) {
                this.setState(() => ({
                    isError: true
                }));

                return;
            }

            this.setState(() => ({
                loginValid: a[0],
                emailValid: a[1]
            }));
        }).catch((err) => {
            console.error(err);
            this.setState(() => ({
                isError: true
            }));
        });
    }

    render() {
        return(
            <form onSubmit={ e => { e.preventDefault(); this.register(); } }>
                <h2 className="gl-nav-loginmodal-title">Register to continue.</h2>
                <LoginModalInput
                    _type="email"
                    _placeholder="Email"
                    icon={ faEnvelope }
                    _onChange={(value) => {
                        this.data.email = value;
                        this.validateFields();
                    }}
                    _required={ true }
                    valid={ this.state.emailValid }
                    success={ this.state.isSuccess }
                    error={ this.state.isError }
                    loading={ this.state.loading || this.state.validatingFields }
                    _ref={ ref => this._refs.email = ref }
                />
                <LoginModalInput
                    _type="text"
                    _placeholder="Name"
                    icon={ faUser }
                    _onChange={ value => this.data.name = value }
                    _required={ true }
                    success={ this.state.isSuccess }
                    error={ this.state.isError }
                    loading={ this.state.loading }
                    _ref={ ref => this._refs.name = ref }
                />
                <LoginModalInput
                    _type="text"
                    _placeholder="Login"
                    icon={ faUser }
                    _onChange={(value) => {
                        this.data.login = value;
                        this.validateFields();
                    }}
                    _required={ true }
                    valid={ this.state.loginValid }
                    success={ this.state.isSuccess }
                    error={ this.state.isError }
                    loading={ this.state.loading || this.state.validatingFields }
                    _ref={ ref => this._refs.login = ref }
                />
                <LoginModalInput
                    _type="password"
                    _placeholder="Password"
                    icon={ faKey }
                    _onChange={ value => this.data.password = value }
                    _required={ true }
                    success={ this.state.isSuccess }
                    error={ this.state.isError }
                    loading={ this.state.loading }
                    _ref={ ref => this._refs.password = ref }
                />
                <button type="submit" disabled={ this.state.loading || this.state.validatingFields } className="gl-nav-loginmodal-submit definp btn">Enter</button>
                <button type="button" disabled={ this.state.loading } className="gl-nav-loginmodal-link definp btn" onClick={ () => this.props.route("LOGIN_STAGE") }>Login</button>
            </form>
        );
    }
}

class LoginModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: "LOGIN_STAGE" // LOGIN_STAGE, REGISTER_STAGE
        }
    }

    componentDidUpdate(pProps) {
        if(this.props.active !== pProps.active) {
            this.setState(() => ({
                stage: "LOGIN_STAGE"
            }))
        }
    }

    render() {
        return(
            <>
                <div
                    className={ `gl-nav-loginmodal__bg${ (!this.props.active) ? "" : " active" }` }
                    onClick={ this.props.onClose }
                />
                <div className="gl-nav-loginmodal">
                    {
                        (this.state.stage === "LOGIN_STAGE") ? (
                            <LoginModalLogin
                                route={ a => this.setState({ stage: a }) }
                                onAuth={ () => { this.props.onAuth(); this.props.onClose(); } }
                            />
                        ) : (this.state.stage === "REGISTER_STAGE") ? (
                            <LoginModalRegister
                                route={ a => this.setState({ stage: a }) }
                                onAuth={ () => { this.props.onAuth(); this.props.onClose(); } }
                            />
                        ) : null
                    }
                </div>
            </>
        );
    }
}

class NavAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false,
            logoutProcessing: false
        }
    }

    logout = () => {
        if(this.state.logoutProcessing) return;

        this.setState(() => ({
            logoutProcessing: true
        }));

        client.mutate({
            mutation: gql`
                mutation {
                    logout {
                        id
                    }
                }
            `
        }).then(({ data: { logout: a } }) => {
            this.setState(() => ({
                logoutProcessing: false
            }));

            if(!a) return null;

            cookieControl.delete("userid");
            this.props.onLogout();
        }).catch((err) => {
            this.setState(() => ({
                logoutProcessing: false
            }));
            console.error(err);
        });
    }

    render() {
        return(
            <div className="gl-nav-name" onMouseEnter={ () => this.setState({ hover: true }) }
                 onMouseLeave={ () => this.setState({ hover: false }) }>
                {
                    (!this.state.hover) ? null : (
                        <button onClick={ this.logout } className="definp btn">Logout</button>
                    )
                }
                <Link to="/">{ this.props.client.name }</Link>
            </div>
        );
    }
}

NavAccount.propTypes = {
    client: PropTypes.object,
    onLogout: PropTypes.func.isRequired
}

class Hero extends Component {
	constructor(props) {
		super(props);

        this.clientID = cookieControl.get("userid");

        this.state = {
            lginModal: false,
            client: (!this.clientID) ? null : {
                id: this.clientID,
                name: "..."
            }
        }

		this.lCircleSize = 40;
	}

    componentDidMount() {
        if(this.state.client) {
            this.checkAuth();
        }
    }

    checkAuth = () => {
        const reset = () => this.setState(() => ({ client: null }));

        client.query({
            query: gql`
                query {
                    user {
                        id,
                        name
                    }
                }
            `
        }).then(({ data: { user: a } }) => {
            if(!a) return reset();

            this.setState(() => ({
                client: {
                    id: a.id,
                    name: a.name
                }
            }));
        }).catch((err) => {
            console.error(err);
            reset();
        });
    }

	render() {
		return(
            <>
    			<nav className="gl-nav">
    				<Link to={ links["HOME_PAGE"].absolute } className="rn-nav-logo">
    					Home
    				</Link>
    				<div className="rn-nav-loading">
    					{
    						(true) ? <>/+</> : (
    							<ProgressRing
    								radius={ this.lCircleSize / 2 }
    								stroke={ 4 }
    							/>
    						)
    					}
    				</div>
                    {
                        (!this.state.client) ? (
                            <button onClick={() => {
                                if(this.props.clientID) return;

                                this.setState(() => ({
                                    lginModal: true
                                }));
                            }} className="definp btn">Login</button>
                        ) : (
                             <NavAccount
                                client={ this.state.client }
                                onLogout={ this.checkAuth }
                            />
                        )
                    }
    			</nav>
                <LoginModal
                    active={ this.state.lginModal }
                    onClose={ () => this.setState(() => ({ lginModal: false })) }
                    onAuth={ this.checkAuth }
                />
            </>
		);
	}
}

export default Hero;
