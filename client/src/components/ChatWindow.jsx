import React, { useState, useEffect, useRef, useContext } from 'react';
import { chatAPI } from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { FaPaperPlane } from 'react-icons/fa';
import { format } from 'date-fns';

const ChatWindow = ({ jobRequestId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await chatAPI.getHistory(jobRequestId);
        setMessages(data.messages);
      } catch (error) {
        console.error('Failed to load chat', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [jobRequestId]);

  useEffect(() => {
    if (!socket) return;
    
    // Tell server we're in this specific job room to receive chat directly here
    socket.emit('join_job_room', jobRequestId);

    const handleNewMessage = (msg) => {
      if (msg.job_request_id === parseInt(jobRequestId)) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('chat:message', handleNewMessage);
    return () => socket.off('chat:message', handleNewMessage);
  }, [socket, jobRequestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const msgText = newMessage.trim();
      setNewMessage(''); // optimistic clear
      
      const { data } = await chatAPI.sendMessage(jobRequestId, msgText);
      // The server will broadcast 'chat:message', but we also append our own immediately
      setMessages(prev => {
        // Prevent duplicate if socket is extremely fast
        if (prev.find(m => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
    } catch (error) {
      console.error('Failed to send', error);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading chat...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '400px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 'auto', marginBottom: 'auto' }}>No messages yet. Say hi!</div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === currentUser.id && msg.sender_role === currentUser.role;
            return (
              <div key={msg.id || i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                <div style={{
                  background: isMe ? 'var(--accent-blue)' : 'var(--bg-card)',
                  color: isMe ? 'white' : 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  boxShadow: 'var(--shadow-sm)',
                  border: isMe ? 'none' : '1px solid var(--border-color)'
                }}>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{msg.message}</p>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>
                  {msg.sent_at ? format(new Date(msg.sent_at), 'HH:mm') : 'Just now'}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '10px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Type a message..." 
          className="form-input" 
          style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none' }}
        />
        <button type="submit" className="btn btn-primary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '0 20px' }} disabled={!newMessage.trim()}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
