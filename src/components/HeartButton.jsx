function HeartButton({ active = false, onToggle, size = 'md', srLabel = '즐겨찾기' }) {
  const dimension = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex ${dimension} items-center justify-center transition-colors ${
        active ? 'text-[#c73531]' : 'text-[#9aa3b2] hover:text-[#0b3aa2]'
      }`}
      aria-pressed={active}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconSize}>
        <path
          d="M12 21s-6.4-4.59-8.46-7.3C1.2 11.2 1.6 7.84 3.9 5.78 6 3.93 9.05 4.5 12 7.27c2.95-2.77 6-3.34 8.1-1.49 2.3 2.06 2.7 5.42.36 7.92C18.4 16.41 12 21 12 21Z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">{srLabel}</span>
    </button>
  );
}

export default HeartButton;
