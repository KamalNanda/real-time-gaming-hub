import './App.css';
import PigGame from './pages/pig-game';
import Login from './pages/login';
import Menu from './pages/Menu';
import Room from './pages/room';
import Profile from './pages/Profile';
import Register from './pages/register';
import Chat from './components/chat'
import StonePaperScissors from './pages/stone-paper-scissors';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import {BrowserRouter} from 'react-router-dom'
import {Switch, Route} from 'react-router'

function App() {
  return (<>
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/register" component={(history) => <Register  history={history}/> } />
          <Route exact path="/" component={(history) => <Login history={history}/> } />
          <Route exact path="/stonepaperscissors" component={(history) => <StonePaperScissors  history={history}/> } />
          <Route exact path="/piggame" component={(history) => <PigGame  history={history}/> } />
          <Route exact path="/menu" component={(history) => <Menu  history={history}/> } />
          <Route exact path="/chat" component={(history) => <Chat  history={history}/> } />
          <Route exact path="/room" component={(history) => <Room  history={history}/> } />
          <Route exact path="/profile" component={(history) => <Profile  history={history}/> } />
        </Switch>
        {/* <PigGame /> */}
        {/* <StonePaperScissors /> */}
        {/* <Login /> */} 
      </div>
    </BrowserRouter>
    <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
    />
  </>);
}

export default App;
