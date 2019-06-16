import React from 'react';
import { createStore } from 'redux';
import uuid from 'uuid';

function reducer(state, action) {
  return {
    activeThreadId: activeThreadIdReducer(state.activeThreadId, action),
    threads: threadsReducer(state.threads, action),
  }
}

function activeThreadIdReducer(state, action) {
  if(action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state;
  }
}

function threadsReducer(state, action) {
  if(action.type === 'ADD_MESSAGE') {
    const threadIndex = state.findIndex(
      (t) => t.id === action.threadId
    );

    const oldThread = state[threadIndex];

    const newThread = {
      ...oldThread,
      messages: messagesReducer(oldThread.messages, action),
    };

    return [
      ...state.slice(0, threadIndex),
      newThread,
      ...state.slice(threadIndex+1, state.length),
    ]
  } else if(action.type === 'DELETE_MESSAGE') {
    const threadIndex = state.findIndex(
      (t) => t.messages.find((m) => (
        m.id === action.id
      ))
    );

    const oldThread = state[threadIndex];
    
    const newThread = {
      ...oldThread,
      messages: oldThread.messages.filter((m) => (
        m.id !== action.id
      )),                                            // messageReducer(oldThread.messages)
    };
    return [
      ...state.slice(0, threadIndex),
      newThread,
      ...state.slice(threadIndex+1, state.length),
    ]
  } else {
    return state;
  }
}

function messagesReducer(state, action) {
  if(action.type === 'ADD_MESSAGE') {
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4(),
    };

    return state.concat(newMessage);
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
    const tabs = threads.map((t) => (
      {
        title: t.title,
        active: t.id === activeThreadId,
        id: t.id,
      }
    ));

    return (
      <div className="ui segment">
        <ThreadTabs tabs={tabs} />
        <Thread thread={activeThread} />
      </div>
    );
  }
}

class ThreadTabs extends React.Component {
  handleClick = (id) => {
    store.dispatch({
      type: 'OPEN_THREAD',
      id: id,
    });
  }
  render() {
    const tabs = this.props.tabs.map((t, index) => (
      <div
        className={t.active? 'active item' : 'item'}
        key={index}
        onClick={() => this.handleClick(t.id)}
      >
        {t.title}
      </div>
    ));

    return (
      <div className='ui top attached tabular menu'>
        {tabs}
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
        <MessageInput threadId={this.props.thread.id}/>
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
      threadId: this.props.threadId,
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
