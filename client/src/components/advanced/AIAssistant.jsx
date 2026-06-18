import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import AIChatBubble from './AIChatBubble';
import { useAuth } from '../../context/AuthContext';

const AIAssistant = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef(null);

  // Web Speech API for voice
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai-chat/history');
      const hist = res.data.history.map(h => [
        { id: `u-${h.id}`, text: h.message, isBot: false },
        { id: `b-${h.id}`, text: h.response, isBot: true }
      ]).flat();
      
      if (hist.length === 0) {
        setMessages([{ id: 'init', text: "Hello! I'm your AI Assistant. How can I help?", isBot: true }]);
      } else {
        setMessages(hist);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), text: msg, isBot: false }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai-chat/message', { message: msg, language });
      setMessages(prev => [...prev, { id: Date.now().toString() + 'b', text: res.data.response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString() + 'e', text: 'Error connecting to AI.', isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListen = () => {
    if (!recognition) return alert('Speech recognition not supported in your browser.');
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    // Set recognition language based on selected UI language
    const langMap = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN', te: 'te-IN', ml: 'ml-IN' };
    recognition.lang = langMap[language] || 'en-IN';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after a short delay
      setTimeout(() => handleSend(transcript), 500);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <div className={`ai-chat-drawer ${isOpen ? '' : 'hidden'}`}>
      <div className="ai-chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong>Labor Connect AI</strong>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Available 24/7</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            value={language} onChange={e => setLanguage(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px', borderRadius: '4px', fontSize: '0.8rem' }}
          >
            <option value="en" style={{color:'black'}}>Eng</option>
            <option value="hi" style={{color:'black'}}>हिंदी</option>
            <option value="kn" style={{color:'black'}}>ಕನ್ನಡ</option>
            <option value="ta" style={{color:'black'}}>தமிழ்</option>
            <option value="te" style={{color:'black'}}>తెలుగు</option>
            <option value="ml" style={{color:'black'}}>മലയാളം</option>
          </select>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
        </div>
      </div>

      <div className="ai-chat-body">
        {messages.map(m => (
          <AIChatBubble key={m.id} message={m.text} isBot={m.isBot} />
        ))}
        {loading && <AIChatBubble isBot={true} message="..." />}
        <div ref={endRef} />
      </div>

      <div style={{ padding: '0 16px' }}>
        <div className="ai-quick-cmds">
          {user?.role === 'provider' ? (
            <>
              <button className="ai-cmd-btn" onClick={() => handleSend('find electricians')}>Find Electrician</button>
              <button className="ai-cmd-btn" onClick={() => handleSend('estimate cost plumber')}>Cost for Plumber</button>
            </>
          ) : (
            <>
              <button className="ai-cmd-btn" onClick={() => handleSend('find jobs')}>Find Jobs</button>
              <button className="ai-cmd-btn" onClick={() => handleSend('show my earnings')}>My Earnings</button>
              <button className="ai-cmd-btn" onClick={() => handleSend('check level')}>My Level</button>
            </>
          )}
        </div>
      </div>

      <div className="ai-chat-footer">
        <button 
          onClick={toggleListen}
          style={{ 
            background: isListening ? 'var(--accent-red)' : 'var(--bg-secondary)', 
            color: isListening ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          🎤
        </button>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', outline: 'none' }}
        />
        <button 
          onClick={() => handleSend()}
          style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
