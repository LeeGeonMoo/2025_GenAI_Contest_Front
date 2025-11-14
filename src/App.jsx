import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import ChatWidgetButton from './components/ChatWidgetButton';
import ChatWidget from './components/ChatWidget';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      {!isChatOpen && <ChatWidgetButton onClick={() => setIsChatOpen(true)} />}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </BrowserRouter>
  );
}

export default App;
