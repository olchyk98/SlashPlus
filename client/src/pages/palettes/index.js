import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import client from '../../apollo';
import { constructClassName } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

import Palette from '../__forall__/colorpalette';

class PalettesFocusbarItem extends PureComponent {
    render() {
        return(
            <button
                className={constructClassName({
                    "definp btn rn-palettes-focusbar-item": true,
                    "active": this.props.active
                })}
                onClick={ this.props._onClick }
                style={{
                    "background": this.props.color
                }}
            />
        );
    }
}

PalettesFocusbarItem.propTypes = {
    color: PropTypes.string.isRequired,
    _onClick: PropTypes.func.isRequired
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focusColor: null,
            searchingByColor: false,
            palettes: false,
            popColors: false
        }
    }

    getPopColors = _a => {
        const a = _a.flat(),
              b = [];

        for(let ma of a) {
            const _a_ = b.findIndex(io => io.color === ma);
            if(_a_ !== -1) {
                b[_a_].found++;
            } else {
                b.push({
                    color: ma,
                    found: 1
                });
            }
        }

        let c = b.sort((io, ia) => (io.found > ia.found) ? -1 : 1); // big -> small
        c.length = 7; // max

        return c.filter(io => io.found).map(io => io.color);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = (focusCol = null, callback = null) => {
        this.props.startFetch(true);

        client.query({
            query: gql`
                query($palettesLimit: Int!, $focusCol: String) {
                    getColorPalletes(limit: $palettesLimit, focusCol: $focusCol) {
						id,
						colors
					}
                }
            `,
            variables: {
                palettesLimit: 30,
                focusCol: focusCol
            }
        }).then(({ data: { getColorPalletes: a } }) => {
            this.props.startFetch(false);

            this.setState(({ popColors }) => ({
                palettes: a,
                popColors: (!focusCol) ? this.getPopColors(a.map(io => io.colors)) : popColors,
                focusColor: focusCol
            }), () => (callback) ? callback() : null);
        }).catch((err) => {
            console.error(err);
            this.props.startFetch(false);
        });
    }

    focusColor = color => {
        if(this.state.searchingByColor) return;

        this.setState(() => ({
            searchingByColor: true,
            focusColor: color,
            palettes: false
        }));

        this.fetchData(color, () => this.setState({ searchingByColor: false }));
    }

    render() {
        return(
            <div className="rn rn-palettes">
                <h1 className="rn__middle__title">Color Palettes</h1>
                <div className="rn-palettes-focusbar">
                    {
                        (this.state.popColors) ? (
                            this.state.popColors.map((color, index) => {
                                const a = this.state.focusColor === color; // active

                                return(
                                    <PalettesFocusbarItem
                                        key={ index }
                                        color={ color }
                                        _onClick={ () => !(a) ? this.focusColor(color) : this.fetchData() }
                                        active={ a }
                                    />
                                );
                            })
                        ) : null
                    }
                </div>
                <button className="definp btn rn-palettes-rand" onClick={ () => this.fetchData() }>
                    <FontAwesomeIcon icon={ faRedo } />
                </button>
                <div className="rn-sections-item-content grid rn-palettes-grid">
                    {
                        (this.state.palettes) ? (
                            this.state.palettes.map(({ id, colors }) => (
                                <Palette
                                    key={ id }
                                    colors={ colors }
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
