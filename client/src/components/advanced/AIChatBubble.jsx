import React from 'react';

const AIChatBubble = ({ message, isBot, language = 'en' }) => {
  return (
    <div className={isBot ? 'ai-bubble-bot' : 'ai-bubble-user'}>
      {message}
    </div>
  );
};

export default AIChatBubble;
