import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';

const Hero = ({ title, content }) => (
    <article className="rn-sections-item-content-article">
        <Link className="rn-sections-item-content-article-title" to="/">{ title }</Link>
        <p className="rn-sections-item-content-article-content">
            { content }
        </p>
    </article>
);

export default Hero;
