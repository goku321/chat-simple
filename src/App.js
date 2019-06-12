import React from 'react';
import { createStore } from 'redux';
import uuid from 'uuid';

function reducer(state, action) {
  if(action.type === 'ADD_MESSAGE') {
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4(),
    };

    return {
      messages: state.messages.concat(newMessage),
    };
  } else if(action.type === 'DELETE_MESSAGE') {
    return {
      messages: state.messages.filter(message => (
        message.id !== action.id
      )),
    };
  } else {
    return state;
  }
}

const initialState = {
  activeThreadId: '1-fac2',
  threads: [
    {
      id: '1-fac2',
      title: 'Ramesh',
      messages: [
        {
          text: 'How are you, Ramesh?',
          timestamp: Date.now(),
          id: uuid.v4(),
        },
      ],
    },
    {
      id: '2-be91',
      title: 'Powar',
      messages: [],
    },
  ],
};
const store = createStore(reducer, initialState);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const state = store.getState();
    const activeThreadId = state.activeThreadId;
    const threads = state.threads;
    const activeThread = threads.find((t) => t.id === activeThreadId);

    return (
      <div className="ui segment">
        <Thread thread={activeThread} />
      </div>
    );
  }
}

class Thread extends React.Component {
  handleClick = (id) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id: id,
    });
  }
  render() {
    const messages = this.props.thread.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(message.id)}
      >
        <div className='text'>
          {message.text}
          <span className='metadata'>@{message.timestamp}</span>
        </div>
      </div>
    ));
    return (
      <div className='ui center aligned basic segment'>
        <div className='ui comments'>
          {messages}
        </div>
        <MessageInput />
      </div>
    );
  }
}

class MessageInput extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.state.value,
    });

    this.setState({
      value: '',
    });
  }

  render() {
    return (
      <div className="ui input">
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className="ui primary button"
          type='submit'
        >
          Submit
        </button>
      </div>
    );
  }
}

export default App;
