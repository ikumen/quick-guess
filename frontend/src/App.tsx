import './App.css';
import { GameProvider } from './components/GameContext';
import { Switch, Route } from 'react-router-dom';
import { DeepgramApiKeyProvider } from './components/DeepgramApiKeyContext';
import LandingPage from './pages/LandingPage';
import QuickGuessPage from './pages/QuickGuessPage';

function App() {
  return <>
  <Switch>
    <Route exact={true} path="/quick-guess">
      <DeepgramApiKeyProvider>
        <GameProvider>
          <div className="w-100 tc mt4 ph6-ns ph3-m ph1">
          <QuickGuessPage />
          </div>
        </GameProvider>
      </DeepgramApiKeyProvider>
    </Route>
    <Route component={LandingPage} />
  </Switch>
  </>;
}

export default App;
