import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';

import links from '../../../links';

const Hero = ({ id, title, content }) => (
    <article className="rn-sections-item-content-article">
        <Link className="rn-sections-item-content-article-title" to={ `${ links["ARTICLE_DISPLAY_PAGE"].absolute }/${ id }` }>{ title }</Link>
        <p className="rn-sections-item-content-article-content">
            { content }
        </p>
    </article>
);

export default Hero;
