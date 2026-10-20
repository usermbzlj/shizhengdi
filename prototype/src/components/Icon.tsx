const PATHS: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4.2-4.2',
  play: 'M8 5.5v13l10.5-6.5z',
  pause: 'M8 5v14M16 5v14',
  home: 'M4 11l8-6.5 8 6.5M6 9.5V19h12V9.5',
  layers: 'M12 4l9 5-9 5-9-5 9-5zM3 14l9 5 9-5',
  book: 'M12 6.5C10.5 5.3 8 4.8 4 5v13c4-.2 6.5.3 8 1.5 1.5-1.2 4-1.7 8-1.5V5c-4-.2-6.5.3-8 1.5zM12 6.5v13',
  mute: 'M5 9.5h3.5L13 6v12l-4.5-3.5H5zM17 9.5l4 5M21 9.5l-4 5',
  sound: 'M5 9.5h3.5L13 6v12l-4.5-3.5H5zM16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11',
  sun: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4',
  moon: 'M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z',
  close: 'M6 6l12 12M18 6 6 18',
  next: 'M9 6l6 6-6 6',
  prev: 'M15 6l-6 6 6 6',
  send: 'M4 12l16-7-6 16-3-7z',
  travel: 'M4 12h13M13 7l5 5-5 5',
  pin: 'M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z',
  skip: 'M6 6l7 6-7 6M15 6v12',
}

export function Icon({ name, size = 18 }: { name: keyof typeof PATHS | string; size?: number }) {
  const filled = name === 'play'
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
