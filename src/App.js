import React from 'react';

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const subscribe = (listener) => (
    listeners.push(listener)
  );

  const getState = () => (state);

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };

  return {
    subscribe,
    getState,
    dispatch,
  };
}

function reducer(state, action) {
  if(action.type === 'ADD_MESSAGE') {
    return {
      messages: state.messages.concat(action.message),
    };
  } else if(action.type === 'DELETE_MESSAGE') {
    return {
      messages: [
        ...state.messages.splice(0, action.index),
        ...state.messages.splice(
          action.index+1, state.messages.length
        ),
      ],
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };
const store = createStore(reducer, initialState);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const messages = store.getState().messages;
  }
}
