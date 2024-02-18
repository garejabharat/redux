import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import axios from 'axios';
import thunk from 'redux-thunk';
//action name constante

const inc = 'account/INCREMENT';
const dec = 'account/DECREMENT';
const incbyamt = 'account/INCREMENTBYAMOUT';
// const init = 'account/INIT';
const getAccUserPending = 'account/getUser/pending';
const getAccUserFullfilled = 'account/getUser/fullfilled';
const getAccUserRejected = 'account/getUser/rejected';

const incBonus = 'bonus/INCRESEBONUS';

//store
const store = createStore(
  combineReducers({
    account: accountReducer,
    bonus: bonusReducer,
  }),
  applyMiddleware(logger.default, thunk.default)
);

//reducer

const history = [];

function accountReducer(state = { amout: 1 }, action) {
  switch (action.type) {
    case inc:
      return { amout: state.amout + 1 };
    case getAccUserFullfilled:
      return { amout: action.playload, pending: false };
    case getAccUserPending:
      return { ...state, pending: true };
    case getAccUserRejected:
      return { ...state, error: action.error, pending: false };
    case dec:
      return { amout: state.amout - 1 };
    case incbyamt:
      return { amout: state.amout + action.playload };

    default:
      return state;
  }
}

function incrementBonus() {
  return { type: incBonus };
}

 
//globalstate
// store.subscribe(() => {
//   history.push(store.getState());
//   console.log(history);
// });

//Action creater
// async function getUser(dispatch, getState) {
//   const { data } = await axios.get('http://localhost:3000/accounts/1');
//   dispatch(initUser(data.amout));
// }

function getUserAccount(id) {
  return async (dispatch, getState) => {
    try {
      dispatch(getAccountUserPending());
      const { data } = await axios(`http://localhost:3000/accounts/${id}`);

      dispatch(getAccountUserFulfilled(data.amount));
    } catch (error) {
      dispatch(getAccountUserRejected(error.message));
    }
  };
}
function getAccountUserFulfilled(value) {
  return { type: getAccUserFullfilled, payload: value };
}
function getAccountUserRejected(error) {
  return { type: getAccUserRejected, error: error };
}
function getAccountUserPending() {
  return { type: getAccUserPendings };
}

function incrementFun() {
  return { type: inc };
}
function decrementFun() {
  return { type: dec };
}

function incrementbyamountFun(value) {
  return { type: incbyamt, playload: value };
}

setTimeout(() => {
  store.dispatch(getUserAccount(2));
  //   store.dispatch(incrementBonus());
}, 2000);
// console.log(store.getState());

//Async API call

// async function getUser() {
//   const { data } = await axios.get('http://localhost:3000/accounts/1');
//   console.log(data);
// }
// getUser();
