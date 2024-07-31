import { View, Text } from 'react-native'
import React from 'react'
import Navigation from './src/Navigation'
import { Provider } from 'react-redux';
import store from './src/Redux/store';

const App = () => {
  return (
    <Provider store={store}>
    <Navigation/>
     </Provider>
  )
}

export default App