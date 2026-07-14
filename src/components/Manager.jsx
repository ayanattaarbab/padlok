import React from 'react'
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

// Loads the icon script on the client side
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
const Hero = ({ size = 150 }) => (
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

const Manager = () => {
    // Form, vault data, and password visibility states
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])
    const [showFormPassword, setShowFormPassword] = useState(false)
    const [revealed, setRevealed] = useState({})

    useEffect(() => { ensureIconify() }, [])

    const getPasswords = async () => {
        let request = await fetch("http://localhost:3000/")
        let passwords = await request.json()
        setPasswordArray(passwords)
    }

    // Fetch all saved passwords when page loads
    useEffect(() => {
        getPasswords()
    }, [])

    const toastOpts = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark"
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    // Saves or updates password entry in database
    const savePassword = async () => {
        if (form.site.length > 0 && form.username.length > 0 && form.password.length > 0) {
            const finalId = form.id ? form.id : uuidv4();
            const passwordData = { ...form, id: finalId };
            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: form.id })
            });
            setPasswordArray([...passwordArray, passwordData]);

            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwordData)
            });

            setform({ site: "", username: "", password: "" });

            toast("Password saved!", {
                ...toastOpts,
                icon: <iconify-icon icon="mdi:check-circle-outline" width="22" style={{ color: '#10b981' }} />
            });
        }
        else {
            toast("Please fill in all required fields.", {
                ...toastOpts,
                icon: <iconify-icon icon="mdi:alert-circle-outline" width="22" style={{ color: '#f59e0b' }} />
            });
        }
    }

    // Deletes entry from database after confirmation
    const deletePassword = async (id) => {
        let confirmation = confirm("Delete this password? This action cannot be undone.")
        if (confirmation) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
            toast("Password deleted!", {
                ...toastOpts,
                icon: <iconify-icon icon="mdi:check-circle-outline" width="22" style={{ color: '#10b981' }} />
            })
        }
    }

    // Loads selected entry back into the inputs to edit
    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }

    // Copies text to clipboard and shows success toast
    const copyText = (text) => {
        navigator.clipboard.writeText(text)
        toast(`Copied to clipboard!`, {
            ...toastOpts,
            icon: <iconify-icon icon="mdi:check-circle-outline" width="22" style={{ color: '#10b981' }} />
        })
    }


    const toggleReveal = (id) => {
        setRevealed(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <>
            <ToastContainer {...toastOpts} />
            <div className="padlok-font min-h-[88.2vh] relative overflow-hidden" style={{ background: '#0B0C14', color: '#F5F5FA' }}>
                <div className="blob-a absolute -top-32 -left-20 w-105 h-105 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)', filter: 'blur(10px)' }} />
                <div className="blob-b absolute top-40 -right-32 w-115 h-115 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.16), transparent 70%)', filter: 'blur(10px)' }} />
                <div className="relative mycontainer px-4 md:px-6 py-14">
                    <div className="flex flex-col items-center text-center gap-3 mb-14">
                        <Hero />
                        <p className="text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ color: '#67E8F9' }}>Your password manager</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ background: 'linear-gradient(135deg,#EDE9FE,#A78BFA 45%,#67E8F9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                            Padlok
                        </h1>
                        <p className="max-w-md" style={{ color: '#9CA3B8' }}>
                            Every password, kept close and locked down — organized in one secure place.
                        </p>
                    </div>

                    <div
                        className="max-w-2xl mx-auto rounded-3xl p-6 md:p-8"
                        style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)', boxShadow: '0 30px 80px -40px rgba(0,0,0,0.6)' }}
                    >
                        <h2 className="text-lg font-bold mb-1">Add a new entry</h2>
                        <p className="text-sm mb-6" style={{ color: '#8288A0' }}>Fill in the details and it's sealed into your vault.</p>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="site" className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#8288A0' }}>Website</label>
                                <input
                                    value={form.site}
                                    onChange={handleChange}
                                    placeholder="example.com"
                                    className="padlok-input w-full rounded-xl px-4 py-2.5 text-sm"
                                    style={{ color: '#F5F5FA' }}
                                    type="text" name="site" id="site"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label htmlFor="username" className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#8288A0' }}>Username</label>
                                    <input
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="your.name"
                                        className="padlok-input w-full rounded-xl px-4 py-2.5 text-sm"
                                        style={{ color: '#F5F5FA' }}
                                        type="text" name="username" id="username"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="password" className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: '#8288A0' }}>Password</label>
                                    <div className="relative">
                                        <input
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                            className="padlok-input w-full rounded-xl px-4 py-2.5 pr-11 text-sm"
                                            style={{ color: '#F5F5FA' }}
                                            type={showFormPassword ? "text" : "password"} name="password" id="password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowFormPassword(!showFormPassword)}
                                            className="padlok-icon-btn absolute right-2.5 top-3/5 -translate-y-1/2 cursor-pointer"
                                            style={{ color: '#A78BFA' }}
                                        >
                                            <iconify-icon icon={showFormPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} width="19"></iconify-icon>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={savePassword}
                                className="padlok-save-btn mt-2 self-center flex items-center gap-2 text-white font-semibold text-sm rounded-full px-7 py-2.5 cursor-pointer"
                            >
                                <iconify-icon icon="mdi:shield-lock-outline" width="17"></iconify-icon>
                                Save to vault
                            </button>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto mt-16">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-2xl font-bold">Your vault</h2>
                            <span className="text-xs uppercase tracking-wide rounded-full px-3 py-1" style={{ color: '#9CA3B8', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {passwordArray.length} {passwordArray.length === 1 ? 'entry' : 'entries'}
                            </span>
                        </div>

                        {passwordArray.length === 0 && (
                            <div className="text-center rounded-2xl py-14" style={{ border: '1px dashed rgba(255,255,255,0.14)', color: '#8288A0' }}>
                                Nothing stored yet. Add your first password above and it'll show up here.
                            </div>
                        )}

                        {passwordArray.length !== 0 && (
                            <div className="flex flex-col gap-3">
                                {passwordArray.map((item, index) => (
                                    <div
                                        key={index}
                                        className="padlok-row grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1.1fr_auto] gap-3 md:gap-4 items-center rounded-2xl px-5 py-3.5"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', animationDelay: `${index * 45}ms` }}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <a
                                                href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="truncate text-sm font-medium transition-colors"
                                                style={{ color: '#F5F5FA' }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = '#A78BFA'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = '#F5F5FA'}
                                            >
                                                {item.site}
                                            </a>
                                            <button aria-label="Copy website" onClick={() => copyText(item.site)} className="padlok-icon-btn shrink-0 mt-1.5 cursor-pointer" style={{ color: '#6B7189' }}>
                                                <iconify-icon icon="mdi:content-copy" width="15"></iconify-icon>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="truncate text-sm" style={{ color: '#B8BCCB' }}>{item.username}</span>
                                            <button aria-label="Copy username" onClick={() => copyText(item.username)} className="padlok-icon-btn shrink-0 mt-1.5 cursor-pointer" style={{ color: '#6B7189' }}>
                                                <iconify-icon icon="mdi:content-copy" width="15"></iconify-icon>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="padlok-mono text-sm tracking-wider" style={{ color: '#B8BCCB' }}>
                                                {revealed[item.id] ? item.password : '••••••••'}
                                            </span>
                                            <button aria-label={revealed[item.id] ? "Hide password" : "Reveal password"} onClick={() => toggleReveal(item.id)} className="padlok-icon-btn shrink-0 mt-1.5 cursor-pointer" style={{ color: '#6B7189' }}>
                                                <iconify-icon icon={revealed[item.id] ? "mdi:eye-off-outline" : "mdi:eye-outline"} width="16"></iconify-icon>
                                            </button>
                                            <button aria-label="Copy password" onClick={() => copyText(item.password)} className="padlok-icon-btn shrink-0 mt-1.5 cursor-pointer" style={{ color: '#6B7189' }}>
                                                <iconify-icon icon="mdi:content-copy" width="15"></iconify-icon>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 justify-start md:justify-end">
                                            <button aria-label="Edit entry" onClick={() => editPassword(item.id)} className="padlok-icon-btn mt-1.5 cursor-pointer" style={{ color: '#8288A0' }}>
                                                <iconify-icon icon="line-md:pencil" width="18"></iconify-icon>
                                            </button>
                                            <button aria-label="Delete entry" onClick={() => deletePassword(item.id)} className="padlok-icon-btn mt-1.5 cursor-pointer" style={{ color: '#8288A0' }}>
                                                <iconify-icon icon="mdi:trash-can-outline" width="17"></iconify-icon>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Manager