import React from 'react';

const VerificationBadge = ({ type, label }) => {
  const iconMap = {
    verified: '✔',
    certified: '🎓',
    licensed: '📜',
    default: '✔'
  };

  // Extract type from label to determine icon (e.g. "✔ Certified Plumber" -> "certified")
  const getIcon = () => {
    const l = label.toLowerCase();
    if (l.includes('certif')) return iconMap.certified;
    if (l.includes('licens')) return iconMap.licensed;
    return iconMap.verified;
  };

  return (
    <div className="verification-badge" title={label}>
      <span>{getIcon()}</span>
      <span>{label.replace(/✔\s*/, '')}</span>
    </div>
  );
};

export default VerificationBadge;
