import { createStore } from 'redux';

function reducer(state = {}, { type, payload }) {
    let a = Object.assign({}, store);

    switch(type) {
        case 'SET_FETCH_STATUS':
            a.isFetching = payload;
        break;

        default:break;
    }

    return a;
}

const store = createStore(
    reducer,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store;
