import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './I18n/i18n';

function App() {

  useEffect(() => {
    console.log("window.hlsEvents", window.hlsEvents);

  }, [])
  
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <AppRouter />
      </Router>
    </I18nextProvider>
  )
}

export default App
