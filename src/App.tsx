import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { GameMenu } from './pages/GameMenu';
import { GameAssessment } from './pages/GameAssessment';
import { GameResult } from './pages/GameResult';
import { ScoreHistory } from './pages/ScoreHistory';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes with Layout (header and padding) */}
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<GameMenu />} />
            <Route path="/history" element={<ScoreHistory />} />
          </Route>

          {/* Fullscreen routes without Layout */}
          <Route path="/game/assessment" element={<GameAssessment />} />
          <Route path="/game/result" element={<GameResult />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
