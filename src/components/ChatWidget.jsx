import { useState, useRef, useEffect } from 'react';

function ChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '안녕하세요! NotiSNU 챗봇입니다. 궁금한 공지사항이나 활동에 대해 물어보세요.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 드래그 및 리사이즈 상태
  const [position, setPosition] = useState(() => {
    // 초기 위치: 우측 하단
    if (typeof window !== 'undefined') {
      return {
        x: window.innerWidth - 420 - 24, // 우측에서 24px 떨어진 위치
        y: window.innerHeight - 600, // 하단에 붙임
      };
    }
    return { x: 0, y: 0 };
  });
  const [size, setSize] = useState({ width: 420, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null); // 'right', 'bottom', 'left', 'top', 'corner', 'top-left', 'top-right', 'bottom-left'
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const widgetRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    // 창이 처음 열릴 때만 초기 위치로 리셋
    if (isOpen && typeof window !== 'undefined') {
      setPosition((prev) => {
        // 위치가 설정되지 않았거나 (0,0)일 때만 초기화
        if (prev.x === 0 && prev.y === 0) {
          return {
            x: window.innerWidth - size.width - 24,
            y: window.innerHeight - size.height,
          };
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 드래그 핸들러
  const handleMouseDown = (e) => {
    if (e.target.closest('.resize-handle')) return; // 리사이즈 핸들 클릭 시 무시
    if (e.target.closest('button')) return; // 버튼 클릭 시 무시
    e.preventDefault(); // 텍스트 선택 방지
    setIsDragging(true);
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      // 마우스 위치와 창 위치의 차이를 저장
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleResizeMouseDown = (e, direction) => {
    e.stopPropagation();
    e.preventDefault(); // 텍스트 선택 방지
    setIsResizing(true);
    setResizeDirection(direction);
    const rect = widgetRef.current?.getBoundingClientRect();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      left: rect?.left || position.x,
      top: rect?.top || position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        // 마우스 위치에서 드래그 시작 시점의 오프셋을 빼서 창의 새 위치 계산
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // 화면 경계 체크
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = position.x;
        let newY = position.y;

        // 우측 가장자리
        if (
          resizeDirection === 'right' ||
          resizeDirection === 'corner' ||
          resizeDirection === 'top-right' ||
          resizeDirection === 'bottom-right'
        ) {
          newWidth = Math.max(320, Math.min(800, resizeStart.width + deltaX));
        }
        // 하단 가장자리
        if (
          resizeDirection === 'bottom' ||
          resizeDirection === 'corner' ||
          resizeDirection === 'bottom-left' ||
          resizeDirection === 'bottom-right'
        ) {
          newHeight = Math.max(400, Math.min(window.innerHeight - 20, resizeStart.height + deltaY));
        }
        // 왼쪽 가장자리
        if (
          resizeDirection === 'left' ||
          resizeDirection === 'top-left' ||
          resizeDirection === 'bottom-left'
        ) {
          const widthDelta = resizeStart.x - e.clientX;
          newWidth = Math.max(320, Math.min(800, resizeStart.width + widthDelta));
          if (newWidth !== resizeStart.width) {
            newX = resizeStart.left + (resizeStart.width - newWidth);
          }
        }
        // 위쪽 가장자리
        if (
          resizeDirection === 'top' ||
          resizeDirection === 'top-left' ||
          resizeDirection === 'top-right'
        ) {
          const heightDelta = resizeStart.y - e.clientY;
          newHeight = Math.max(
            400,
            Math.min(window.innerHeight - 20, resizeStart.height + heightDelta),
          );
          if (newHeight !== resizeStart.height) {
            newY = resizeStart.top + (resizeStart.height - newHeight);
          }
        }

        setSize({
          width: newWidth,
          height: newHeight,
        });

        // 위치 업데이트 (왼쪽/위쪽 리사이즈 시)
        if (newX !== position.x || newY !== position.y) {
          setPosition({
            x: Math.max(0, Math.min(newX, window.innerWidth - newWidth)),
            y: Math.max(0, Math.min(newY, window.innerHeight - newHeight)),
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, isResizing, resizeDirection, dragStart, resizeStart]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // TODO: 백엔드 API 호출
    // const response = await fetch('/api/chat', { ... });
    // const botResponse = await response.json();

    // 더미 응답 (나중에 API로 교체)
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: '죄송합니다. 아직 챗봇 기능이 준비 중입니다. 곧 만나요!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* 채팅 창 */}
      <div
        ref={widgetRef}
        className={`fixed z-50 flex flex-col rounded-[16px] bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'pointer-events-none translate-y-full'
        } ${isDragging ? 'cursor-move' : ''}`}
        style={{
          right: isOpen ? undefined : '24px',
          bottom: isOpen ? undefined : 0,
          left: isOpen ? `${position.x}px` : undefined,
          top: isOpen ? `${position.y}px` : undefined,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        {/* 헤더 */}
        <div
          className="flex cursor-move items-center justify-between border-b border-[#e6e9ef] px-4 py-3 select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4f8cff] to-[#1b45b0]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-white">
                <path
                  d="M5.5 4h13a.5.5 0 0 1 .5.5V18a.5.5 0 0 1-.8.4l-3.86-2.9a.5.5 0 0 0-.3-.1h-8.54a.5.5 0 0 1-.5-.5V4.5a.5.5 0 0 1 .5-.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[#1e232e]">NotiSNU 챗봇</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#7a8497] transition-colors hover:bg-[#f1f4f9] hover:text-[#1e232e]"
            aria-label="채팅 닫기"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M6.75 6.75 17.25 17.25M17.25 6.75 6.75 17.25"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-[12px] px-4 py-2.5 ${
                    message.type === 'user'
                      ? 'bg-[#0b3aa2] text-white'
                      : 'bg-[#f1f4f9] text-[#1e232e]'
                  }`}
                >
                  <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-[12px] bg-[#f1f4f9] px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#7a8497] [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#7a8497] [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#7a8497]" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="border-t border-[#e6e9ef] p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 rounded-[8px] border border-[#e6e9ef] px-4 py-2.5 text-[14px] text-[#1e232e] transition-colors outline-none placeholder:text-[#9aa3b2] focus:border-[#0b3aa2] focus:ring-1 focus:ring-[#0b3aa2]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[8px] bg-[#0b3aa2] text-white transition-colors hover:bg-[#0a3490] disabled:cursor-not-allowed disabled:bg-[#cfd5df]"
              aria-label="메시지 전송"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
              </svg>
            </button>
          </form>
        </div>

        {/* 리사이즈 핸들 - 우측 가장자리 */}
        <div
          className="resize-handle absolute top-0 right-0 h-full w-1 cursor-ew-resize select-none hover:bg-[#0b3aa2]/10"
          onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
        />

        {/* 리사이즈 핸들 - 하단 가장자리 */}
        <div
          className="resize-handle absolute bottom-0 left-0 h-1 w-full cursor-ns-resize select-none hover:bg-[#0b3aa2]/10"
          onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
        />

        {/* 리사이즈 핸들 - 왼쪽 가장자리 */}
        <div
          className="resize-handle absolute top-0 left-0 h-full w-1 cursor-ew-resize select-none hover:bg-[#0b3aa2]/10"
          onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
        />

        {/* 리사이즈 핸들 - 위쪽 가장자리 */}
        <div
          className="resize-handle absolute top-0 left-0 h-1 w-full cursor-ns-resize select-none hover:bg-[#0b3aa2]/10"
          onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
        />

        {/* 리사이즈 핸들 - 우측 하단 모서리 */}
        <div
          className="resize-handle absolute right-0 bottom-0 z-10 h-4 w-4 cursor-nwse-resize select-none"
          onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
        />

        {/* 리사이즈 핸들 - 좌측 하단 모서리 */}
        <div
          className="resize-handle absolute bottom-0 left-0 z-10 h-4 w-4 cursor-nesw-resize select-none"
          onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
        />

        {/* 리사이즈 핸들 - 우측 상단 모서리 */}
        <div
          className="resize-handle absolute top-0 right-0 z-10 h-4 w-4 cursor-nesw-resize select-none"
          onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
        />

        {/* 리사이즈 핸들 - 좌측 상단 모서리 */}
        <div
          className="resize-handle absolute top-0 left-0 z-10 h-4 w-4 cursor-nwse-resize select-none"
          onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
        />
      </div>
    </>
  );
}

export default ChatWidget;
