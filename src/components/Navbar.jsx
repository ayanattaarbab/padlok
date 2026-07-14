import React, { useEffect } from 'react'

// Load Iconify script on the client side
const ensureIconify = () => {
  if (typeof window === 'undefined') return
  if (!window.customElements || window.customElements.get('iconify-icon')) return
  if (document.getElementById('iconify-icon-script')) return
  const script = document.createElement('script')
  script.id = 'iconify-icon-script'
  script.src = 'https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js'
  document.head.appendChild(script)
}

// Animated Lock SVG Logo
const KeyholdMark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <linearGradient id="navGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#A78BFA" />
        <stop offset="1" stopColor="#22D3EE" />
      </linearGradient>
      <style>{`
        @keyframes lock-shackle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes keyhole-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        .shackle {
          transform-origin: 32px 28px;
          animation: lock-shackle 4s ease-in-out infinite;
        }
        .keyhole {
          transform-origin: 32px 42px;
          animation: keyhole-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </defs>
    <path
      className="shackle"
      d="M21 28V19a11 11 0 0 1 22 0v9"
      fill="none"
      stroke="url(#navGrad)"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <rect x="14" y="28" width="36" height="28" rx="7" fill="none" stroke="url(#navGrad)" strokeWidth="2.6" />
    <g className="keyhole">
      <circle cx="32" cy="40" r="4.2" fill="url(#navGrad)" />
      <path d="M32 43.5V49" stroke="url(#navGrad)" strokeWidth="3.4" strokeLinecap="round" />
    </g>
  </svg>
)

const Navbar = () => {
  useEffect(() => { 
    ensureIconify() 
  }, [])

  return (
    <nav className="sticky top-0 z-30 text-[#F5F5FA]" style={{ background: '#0B0C14', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mycontainer flex justify-between items-center px-4 md:px-6 py-3">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <KeyholdMark />
          <span className="padlok-font text-xl font-bold tracking-tight" style={{ background: 'linear-gradient(135deg,#C4B5FD,#67E8F9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Padlok
          </span>
        </div>

        {/* Security Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-full px-3.5 py-1.5">
          <iconify-icon icon="mdi:shield-check-outline" width="15" style={{ color: '#67E8F9' }}></iconify-icon>
          <span className="padlok-font text-[11px] tracking-wide font-medium text-[#9CA3B8]">
            Encrypted end-to-end
          </span>
        </div>

      </div>
    </nav>
  )
}

export default Navbar