import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { fetchUserData } from './store/slices/authSlice';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const token = localStorage.getItem('authToken');
if (token) {
  store.dispatch(fetchUserData());
}

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);