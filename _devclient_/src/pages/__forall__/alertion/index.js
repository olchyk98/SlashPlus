import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { constructClassName } from '../../../utils';

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ""
        }

        this.outTimerINT = null;
    }

    componentDidUpdate(a) {
        if(
            (!a.data && this.props.data) ||
            (
                a.data && this.props.data &&
                this.state.message !== this.props.data.message
            )
        ) { // just appeared
            clearTimeout(this.outTimerINT);
            this.outTimerINT = setTimeout(this.props.closeSelf, 4e3);
            this.setState(() => ({
                message: this.props.data.message
            }));
        }
    }

    render() {
        return(
            <div className={constructClassName({
                "gl-alertion": true,
                "active": this.props.data
            })}>
                <span className="gl-alertion-content">{ this.state.message }</span>
                <button className="gl-alertion-times definp btn" onClick={ this.props.closeSelf }>
                    <FontAwesomeIcon icon={ faTimes } />
                </button>
            </div>
        );
    }
}

const mapStateToProps = ({ globalAlert }) => ({
    data: globalAlert
});

const mapActionsToProps = {
    closeSelf: () => ({ type: "PUSH_ALERTION_STATE", payload: null })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);
