import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './components/App/store';
import './index.css'
import App from './App.jsx'
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh the page')
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

let persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
)
