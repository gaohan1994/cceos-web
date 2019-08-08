import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import store, { StoreType } from './store';

export type Store = {
  store: StoreType
};

const reducer = combineReducers({
  store
});

export const configureStore = () => {

  const store = process.env.NODE_ENV === 'prodcution'
    ? createStore(
      reducer,
      compose(
        applyMiddleware(thunk)
      )
    )
    : createStore(
      reducer,
      compose(
        applyMiddleware(thunk, logger)
      )
    );

  return store;
};

export default reducer;