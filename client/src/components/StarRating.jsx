import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, value, count, setRating, onChange, interactive = false, readOnly, size }) => {
  const currentRating = rating !== undefined ? rating : value || 0;
  const isInteractive = interactive || !!onChange || (!readOnly && !!setRating);
  const handleRatingChange = onChange || setRating;
  
  const roundedRating = Math.round(currentRating * 2) / 2;

  const handleStarClick = (index) => {
    if (isInteractive && handleRatingChange) {
      handleRatingChange(index + 1);
    }
  };

  const getSizeStyle = () => {
    if (size === 'sm') return '1rem';
    if (size === 'lg') return '2rem';
    return isInteractive ? '1.5rem' : '1.2rem';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', color: 'var(--accent-amber)', fontSize: getSizeStyle() }}>
        {[...Array(5)].map((_, i) => {
          if (isInteractive) {
            return (
              <span key={i} onClick={() => handleStarClick(i)} style={{ cursor: 'pointer', transition: 'transform 0.1s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                {i < currentRating ? <FaStar /> : <FaRegStar />}
              </span>
            );
          }
          
          if (roundedRating >= i + 1) return <FaStar key={i} />;
          if (roundedRating === i + 0.5) return <FaStarHalfAlt key={i} />;
          return <FaRegStar key={i} />;
        })}
      </div>
      {!isInteractive && count !== undefined && (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>({count})</span>
      )}
    </div>
  );
};

export default StarRating;
