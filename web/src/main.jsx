import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { ThemeWrapper } from './components/ThemeWrapper.jsx';
import './App.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeWrapper>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeWrapper>
    </BrowserRouter>
  </StrictMode>
);
