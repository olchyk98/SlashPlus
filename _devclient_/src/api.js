// const api = {
// 	api: 'http://localhost:4000',
// 	storage: 'http://localhost:4000'
// }

const api = {
	api: `${ window.location.origin }/api`,
	storage: window.location.origin
}

export default api;
