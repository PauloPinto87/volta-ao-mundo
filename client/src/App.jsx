import './App.css';
import UserContext from './contexts/UserContext';
import { useContext } from 'react';
// elements
import Login from './components/Login';
import GameRoom from './components/GameRoom';
import WaitingPlayer from './components/WaitingPlayer';


const App = () => {
  const { isLogged, isFullRoom, } = useContext(UserContext);

  
  return (
    <div className="container">
        { isLogged == false ? 
          <Login/> 
          : 
          isFullRoom == false ? 
          <WaitingPlayer/> 
          : 
          <GameRoom />}
    </div>
  );
};

export default App;
