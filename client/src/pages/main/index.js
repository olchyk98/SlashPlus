import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';

import client from '../../apollo';
import links from '../../links';

class PalettesItem extends PureComponent {
	render() {
		return(
			<div className="rn-sections-item-palette">
				{
					this.props.colors.map((session, index) => (
						<div key={ index } style={{ background: session }} />
					))
				}
			</div>
		);
	}
}

PalettesItem.propTypes = {
	colors: PropTypes.array.isRequired
}

class Palettes extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item">
				<Link to={ "/" } className="rn-sections-item-title">Color palettes</Link>
				<div className="rn-sections-item_split" />
				<div className="rn-sections-item-content grid">
					{
						(this.props.palettes) ? (
							this.props.palettes.map((io) => (
								<PalettesItem
									key={ io.id }
									colors={ io.colors }
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

class ColoursItem extends PureComponent {
	render() {
		return(
			<div className="rn-sections-item-palette hov">
				<div style={{ background: "purple" }} />
			</div>
		);
	}
}

class Colours extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item">
				<Link to={ "/" } className="rn-sections-item-title">Colours</Link>
				<div className="rn-sections-item_split" />
				<div className="rn-sections-item-content grid">
					<ColoursItem />
					<ColoursItem />
					<ColoursItem />
					<ColoursItem />
				</div>
			</article>
		);
	}
}

class FontsItem extends PureComponent {
	render() {
		return(
			<button className="rn-sections-item-content-font definp" style={{ fontFamily: "Lato" }}>Lato</button>
		);
	}
}

class Fonts extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item">
				<Link to={ "/" } className="rn-sections-item-title">Fonts</Link>
				<div className="rn-sections-item_split" />
				<div className="rn-sections-item-content flex">
					<FontsItem />
					<FontsItem />
					<FontsItem />
				</div>
			</article>
		);
	}
}

class ArticlesItem extends PureComponent {
	render() {
		return(
			<div className="rn-sections-item-content-article">
				<h4 className="rn-sections-item-content-article-title">Citrus Lentil Salad</h4>
				<p className="rn-sections-item-content-article-content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet pharetra augue, id blandit ex mattis ac. Quisque imperdiet commodo arcu ac euismod. Mauris vitae ligula id erat tempor sodales. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
				</p>
			</div>
		);
	}
}

class Articles extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item">
				<Link to={ "/" } className="rn-sections-item-title">Articles</Link>
				<div className="rn-sections-item_split" />
				<div className="rn-sections-item-content flex">
					<ArticlesItem />
					<ArticlesItem />
					<ArticlesItem />
					<ArticlesItem />
					<ArticlesItem />
					<ArticlesItem />
				</div>
			</article>
		);
	}
}

class Hero extends Component {
	constructor(props) {
		super(props);

		this.state = {
			assets: false
		}
	}

	// TODO: Loading placeholder
	// TODO: Create and fetch more data
	// TODO: Fill color palettes

	componentDidMount() {
		client.query({
			query: gql`
				query($palettesLimit: Int!) {
					getColorPalletes(limit: $palettesLimit) {
						id,
						colors
					},
					# getColors
				}
			`,
			variables: {
				palettesLimit: 4
			}
		}).then(({ data: { getColorPalletes: a } }) => {
			if(!a) return;

			this.setState(() => ({
				assets: {
					palettes: a.map(({ id, colors }) => ({ id, colors }))
				}
			}));
		}).catch(console.error);
	}

	render() {
		return(
			<div className="rn rn-sections">
				{/* color palettes */}
				<Palettes
					palettes={ this.state.assets && this.state.assets.palettes }
				/>
				{/* colours */}
				<Colours />
				{/* fonts */}
				<Fonts />
				{/* articles */}
				<Articles />
			</div>
		);
	}
}

export default Hero;
