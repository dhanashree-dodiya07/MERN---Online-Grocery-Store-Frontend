import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { setAuthToken } from './api';

const token = localStorage.getItem('token');
if (token) setAuthToken(token);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);