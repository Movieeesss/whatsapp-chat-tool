import React, { useState, useEffect } from 'react';

interface RecentChat {
  phone: string;
  name?: string;
  timestamp: number;
}

const DEFAULT_TEMPLATES = [
  "Hi, please share your current location.",
  "Hello, here is my address: ",
  "Hi, please call me back when you are free.",
  "Hi, payment done. Please verify.",
  "Hello, can you send the bill / invoice copy?"
];

export default function WhatsAppDirect() {
  const [countryCode, setCountryCode] = useState('91');
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [message, setMessage] = useState('');
  const [recents, setRecents] = useState<RecentChat[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wa_recent_chats');
      if (saved) {
        setRecents(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveToHistory = (cleanedPhone: string, label?: string) => {
    const newEntry: RecentChat = {
      phone: cleanedPhone,
      name: label?.trim() || undefined,
      timestamp: Date.now()
    };
    const updated = [newEntry, ...recents.filter(item => item.phone !== cleanedPhone)].slice(0, 10);
    setRecents(updated);
    localStorage.setItem('wa_recent_chats', JSON.stringify(updated));
  };

  const handleOpenChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanedNumber = phone.replace(/\D/g, '');
    if (cleanedNumber.length < 7) {
      alert("Please enter a valid phone number!");
      return;
    }

    const fullPhone = `${countryCode.replace(/\D/g, '')}${cleanedNumber}`;
    saveToHistory(fullPhone, contactName);

    const encodedMsg = encodeURIComponent(message.trim());
    const waUrl = encodedMsg 
      ? `https://wa.me/${fullPhone}?text=${encodedMsg}`
      : `https://wa.me/${fullPhone}`;

    window.open(waUrl, '_blank');
  };

  const clearHistory = () => {
    localStorage.removeItem('wa_recent_chats');
    setRecents([]);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'sans-serif' }}>
      <header style={{ backgroundColor: '#25D366', padding: '16px', textAlign: 'center', color: '#fff', borderBottom: '3px solid #1EBE5D' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
          WHATSAPP DIRECT CHAT
        </h2>
        <span style={{ fontSize: '12px', opacity: 0.9 }}>Chat without saving numbers</span>
      </header>

      <div style={{ padding: '16px' }}>
        <form onSubmit={handleOpenChat} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>
            PHONE NUMBER
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={`+${countryCode}`}
              onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, ''))}
              style={{ width: '65px', padding: '12px 8px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}
            />
            <input
              type="tel"
              placeholder="Enter 10-digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px' }}
              required
            />
          </div>

          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>
            CONTACT NAME / NOTE (OPTIONAL)
          </label>
          <input
            type="text"
            placeholder="e.g. Delivery boy, Electrician"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px', marginBottom: '12px' }}
          />

          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>
            MESSAGE (OPTIONAL)
          </label>
          <textarea
            rows={3}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px', resize: 'none', marginBottom: '12px' }}
          />

          <button
            type="submit"
            style={{ width: '100%', padding: '14px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            START CHAT ON WHATSAPP 🚀
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>
            Quick Templates
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {DEFAULT_TEMPLATES.map((tmpl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setMessage(tmpl)}
                style={{ backgroundColor: '#fff', border: '1px solid #0070c0', color: '#0070c0', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer' }}
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>

        {recents.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>
                Recent Chats
              </span>
              <button
                onClick={clearHistory}
                style={{ background: 'none', border: 'none', color: '#ff4d4d', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear History
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recents.map((item) => (
                <div
                  key={item.phone}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e1e4e8' }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
                      {item.name || `+${item.phone}`}
                    </div>
                    {item.name && <div style={{ fontSize: '11px', color: '#777' }}>+{item.phone}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhone(item.phone.replace(/^91/, ''));
                      setContactName(item.name || '');
                    }}
                    style={{ backgroundColor: '#eefaff', border: '1px solid #0070c0', color: '#0070c0', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
