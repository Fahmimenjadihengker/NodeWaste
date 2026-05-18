const iconPaths = {
  home: 'M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z',
  scan: 'M5 8V5h3M16 5h3v3M19 16v3h-3M8 19H5v-3M8 12h8M12 8v8',
  pet: 'M8.5 10.5c1.2 0 2 1 2 2.2 0 1.4-1 2.3-2.2 2.3H7.6C6.4 15 5.5 14 5.5 12.8c0-1.3.8-2.3 2-2.3h1Zm7 0h1c1.2 0 2 1 2 2.3 0 1.2-.9 2.2-2.1 2.2h-.7c-1.2 0-2.2-.9-2.2-2.3 0-1.2.8-2.2 2-2.2ZM8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-4 3c-2.8 0-5 2-5 4.8C7 18.4 9.1 20 12 20s5-1.6 5-4.2C17 13 14.8 11 12 11Z',
  schedule: 'M7 3v3M17 3v3M5 8h14M7 12h3v3H7v-3Zm7 0h3v3h-3v-3ZM6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.8-3.4 3.5-5.5 7-5.5s6.2 2.1 7 5.5H5Z',
}

function AppNavIcon({ name }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  )
}

export default AppNavIcon
