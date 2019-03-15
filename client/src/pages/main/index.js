import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';

import links from '../../links';

class Hero extends Component {
	render() {
		return(
			<div className="rn rn-sections">
				{/* color palettes */}
				<article className="rn-sections-item">
					<Link to={ "/" } className="rn-sections-item-title">Color palettes</Link>
					<div className="rn-sections-item_split" />
					<div className="rn-sections-item-content grid">
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
						<div className="rn-sections-item-palette">
							{
								[
									"#261E1B",
									"#373938",
									"#26A96C",
									"#F4DDC8",
									"#EC6C5B",
									"#F7B304"
								].map((session, index) => (
									<div key={ index } style={{ background: session }} />
								))
							}
						</div>
						<div className="rn-sections-item-palette">
							{
								["#f0d8a8","#3d1c00","#86b8b1","#f2d694","#fa2a00"].map((session, index) => (
									<div key={ index } style={{ background: session }} />
								))
							}
						</div>
						<div className="rn-sections-item-palette">
							{
								["#C2412D","#D1AA34","#A7A844","#A46583","#5A1E4A"].map((session, index) => (
									<div key={ index } style={{ background: session }} />
								))
							}
						</div>
					</div>
				</article>
				{/* colours */}
				{/* fonts */}
				{/* articles */}
			</div>
		);
	}
}

export default Hero;