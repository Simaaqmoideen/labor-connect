import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { providerAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProviderChat = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get('with');
  const recipientName = searchParams.get('name') || 'Worker';

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!recipientId) { setLoading(false); return; }
      try {
        const res = await providerAPI.getChatHistory(recipientId);
        setMessages(res.data.messages || []);
      } catch {
        toast.error('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [recipientId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinRoom', { userId: user?.id });
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('receiveMessage');
  }, [socket, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msgData = {
      senderId: user?.id,
      receiverId: recipientId,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    try {
      setSending(true);
      socket?.emit('sendMessage', msgData);
      setMessages(prev => [...prev, { ...msgData, fromSelf: true }]);
      setNewMessage('');
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!recipientId) {
    return (
      <div className="chat-page">
        <div className="page-header">
          <h1 className="page-title">Messages</h1>
        </div>
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>💬</span>
          <p>Select a worker to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-header card">
        <div className="avatar">
          <span>{recipientName[0]?.toUpperCase()}</span>
        </div>
        <div>
          <h2 className="chat-name">{recipientName}</h2>
          <span className="online-indicator">● Online</span>
        </div>
      </div>

      <div className="chat-body card">
        {loading ? (
          <LoadingSpinner />
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <span>👋</span>
            <p>Start the conversation!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, i) => {
              const isSelf = msg.fromSelf || msg.senderId === user?.id;
              return (
                <div key={i} className={`message-bubble ${isSelf ? 'bubble-self' : 'bubble-other'}`}>
                  <p>{msg.message}</p>
                  <span className="msg-time">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="chat-input-form">
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          disabled={sending}
        />
        <button type="submit" className="btn btn-primary chat-send-btn" disabled={sending || !newMessage.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default ProviderChat;
