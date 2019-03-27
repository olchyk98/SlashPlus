const links = {
	"HOME_PAGE": {
		absolute: '/',
		route: '/'
	},
	"ACCOUNT_PAGE": {
		absolute: '/u',
		route: '/u/:login?'
	},
	"CREATE_PAGE": {
		absolute: '/new',
		route: '/new/:part?'
	},
	"PALETTES_PAGE": {
		absolute: '/palettes',
		route: '/palettes'
	},
	"COLORS_PAGE": {
		absolute: '/colors',
		route: '/colors'
	},
	"FONTS_PAGE": {
		absolute: '/fonts',
		route: '/fonts'
	},
	"ARTICLES_PAGE": {
		absolute: '/articles',
		route: '/articles'
	},
	"ARTICLE_DISPLAY_PAGE": {
		absolute: '/a',
		route: '/a/:id'
	}
}

export default links;
