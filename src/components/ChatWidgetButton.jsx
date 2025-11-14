function ChatWidgetButton({ onClick, label = '도움이 필요하신가요?' }) {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex items-end gap-3">
      <button
        type="button"
        onClick={onClick}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-[#4f8cff] to-[#1b45b0] text-white shadow-[0_15px_30px_rgba(0,68,185,0.25)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f8cff]"
        aria-label="채팅 열기"
      >
        <span className="absolute inset-0 rounded-full border border-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
          <path
            d="M5.5 4h13a.5.5 0 0 1 .5.5V18a.5.5 0 0 1-.8.4l-3.86-2.9a.5.5 0 0 0-.3-.1h-8.54a.5.5 0 0 1-.5-.5V4.5a.5.5 0 0 1 .5-.5Z"
            fill="currentColor"
          />
          <path d="M8 9h8M8 12h5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export default ChatWidgetButton;
