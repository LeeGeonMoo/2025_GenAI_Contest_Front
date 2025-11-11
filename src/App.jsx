import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import ChatWidgetButton from './components/ChatWidgetButton';

function App() {
  return (
    <BrowserRouter>
      <div className="app-scale">
        <div className="app-scale__inner">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </div>
      </div>
      <ChatWidgetButton />
    </BrowserRouter>
  );
}

export default App;
