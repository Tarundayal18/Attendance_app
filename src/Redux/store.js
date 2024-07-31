// store.js
import { combineReducers, createStore } from 'redux';
import {reducer} from './reducers';


const reducerMAin=combineReducers({auth:reducer})
const store = createStore(reducerMAin);

export default store;


// import { combineReducers, createStore } from "redux";
// import {reducer} from './reducers';

// const red=combineReducers({mainState:reducer});

// export const  store=createStore(red);
