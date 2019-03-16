import React, { Component, PureComponent } from 'react';
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
					[
						"#624480",
						"#714E93",
						"#865DAF",
						"#A96DD1",
						"#B57EDC"
					].map((session, index) => (
						<div key={ index } style={{ background: session }} />
					))
				}
			</div>
		);
	}
}

class Palettes extends PureComponent {
	render() {
		return(
			<article className="rn-sections-item">
				<Link to={ "/" } className="rn-sections-item-title">Color palettes</Link>
				<div className="rn-sections-item_split" />
				<div className="rn-sections-item-content grid">
					<PalettesItem />
					<PalettesItem />
					<PalettesItem />
					<PalettesItem />
				</div>
			</article>
		);
	}
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
	componentDidMount() {
		client.query({
			query: gql`
				{
					users {
						id
					}
				}
			`
		}).then(console.log);
	}

	render() {
		return(
			<div className="rn rn-sections">
				{/* color palettes */}
				<Palettes />
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