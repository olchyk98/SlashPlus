import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { connect } from 'react-redux';

import client from '../../apollo';
import links from '../../links';
import { constructClassName } from '../../utils';

import PalettesItem from '../__forall__/colorpalette';

class Palettes extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item">
				<Link to={ links["PALETTES_PAGE"].absolute } className="rn-sections-item-title">Color palettes</Link>
				<div className="rn-sections-item_split" />
				<div className="rn-sections-item-content grid">
					{
						(this.props.palettes) ? (
							this.props.palettes.map(({ id, colors }) => (
								<PalettesItem
									key={ id }
									colors={ colors }
								/>
							))
						) : <>Loading</>
					}
				</div>
			</article>
		);
	}
}

Palettes.propTypes = {
	palettes: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.bool
	])
}

const ColoursItem = ({ color }) => (
	<div className="rn-sections-item-palette hov">
		<div style={{ background: color }} />
	</div>
)

class Colours extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item">
				<Link to={ "/" } className="rn-sections-item-title">Colours</Link>
				<div className="rn-sections-item_split" />
				<div className="rn-sections-item-content grid">
					{
						(this.props.colors) ? (
							this.props.colors.map(({ id, color }) => (
								<ColoursItem
									key={ id }
									color={ color }
								/>
							))
						) : <>Loading</>
					}
				</div>
			</article>
		);
	}
}

Colours.propTypes = {
	colors: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.bool
	])
}

const FontsItem = ({ font, name }) => (
	<button className="rn-sections-item-content-font definp" style={{ fontFamily: font }}>{ name }</button>
)

class Fonts extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item">
				<Link to={ "/" } className="rn-sections-item-title">Fonts</Link>
				<div className="rn-sections-item_split" />
				<div className="rn-sections-item-content flex">
					{
						(this.props.fonts) ? (
							this.props.fonts.map(({ id, name, fontName }) => (
								<FontsItem
									key={ id }
									name={ name }
									font={ fontName }
								/>
							))
						) : <>Loading</>
					}
				</div>
			</article>
		);
	}
}

Fonts.propTypes = {
	fonts: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.bool
	])
}

class ArticlesItem extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item-content-article">
				<Link className="rn-sections-item-content-article-title" to="/">{ this.props.title }</Link>
				<p className="rn-sections-item-content-article-content">
					{ this.props.content }
				</p>
			</article>
		);
	}
}

ArticlesItem.propTypes = {
	title: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired
}

class Articles extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item">
				<Link to={ "/" } className="rn-sections-item-title">Articles</Link>
				<div className="rn-sections-item_split" />
				<div className="rn-sections-item-content flex">
					{
						(this.props.articles) ? (
							this.props.articles.map(({ id, previewContent, title }) => (
								<ArticlesItem
									key={ id }
									id={ id }
									content={ previewContent }
									title={ title }
								/>
							))
						) : <>Loading</>
					}
				</div>
			</article>
		);
	}
}

Articles.propTypes = {
	articles: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.bool
	])
}

class Hero extends Component {
	constructor(props) {
		super(props);

		this.state = {
			assets: false
		}
	}

	// TODO: Loading placeholder

	componentDidMount() {
		this.fetchData();
	}

	fetchData = () => {
		this.props.startFetch(true);

		client.query({
			query: gql`
				query($palettesLimit: Int!, $colorsLimit: Int!, $fontsLimit: Int!, $articlesLimit: Int!) {
					getColorPalletes(limit: $palettesLimit) {
						id,
						colors
					},
					getColors(limit: $colorsLimit) {
						id,
						color
					},
					getFonts(limit: $fontsLimit) {
						id,
						src,
						name,
						fontName
					},
					getArticles(limit: $articlesLimit) {
						id,
						title,
						previewContent
					}
				}
			`,
			variables: {
				palettesLimit: 4,
				colorsLimit: 4,
				fontsLimit: 3,
				articlesLimit: 4
			}
		}).then(({ data: { getColorPalletes: a, getColors: b, getFonts: c, getArticles: d } }) => {
			this.props.startFetch(false);
			// Check if all data was transported correctly
			if(!a || !b || !c || !d) return console.error("Requested data wasn't successfully verified.");

			// Load fonts which we will display
			for(let ma of c.map(io => io.src)) {
				const _a = document.createElement('link');
				_a.setAttribute('rel', 'stylesheet');
				_a.setAttribute('type', 'text/css');
				_a.setAttribute('href', ma);
				document.head.appendChild(_a);
			}

			// Accept data
			this.setState(() => ({
				assets: {
					palettes: a.map(({ id, colors }) => ({ id, colors })),
					colors: b.map(({ id, color }) => ({ id, color })),
					fonts: c.map(({ id, src, name, fontName }) => ({ id, src, name, fontName })),
					articles: d.map(({ id, title, previewContent }) => ({ id, title, previewContent }))
				}
			}));
		}).catch(console.error);
	}

	render() {
		return(
			<div className="rn rn-sections">
				<Palettes
					palettes={ this.state.assets && this.state.assets.palettes }
				/>
				<Colours
					colors={ this.state.assets && this.state.assets.colors }
				/>
				<Fonts
					fonts={ this.state.assets && this.state.assets.fonts }
				/>
				<Articles
					articles={ this.state.assets && this.state.assets.articles }
				/>
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
