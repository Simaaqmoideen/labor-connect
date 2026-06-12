import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AccommodationFinder = () => {
  const { user } = useAuth();
  const [lodges, setLodges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(2000); // meters

  useEffect(() => {
    // Only workers need accommodation generally, but we can allow providers to search too
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchAccommodations(pos.coords.latitude, pos.coords.longitude),
        () => setError('Location access denied. Cannot find nearby lodges.')
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, [radius]);

  const fetchAccommodations = async (lat, lng) => {
    setLoading(true);
    setError('');
    try {
      // Overpass API query for hotels, motels, guest_houses, hostels
      const query = `
        [out:json];
        (
          node["tourism"~"hotel|motel|guest_house|hostel"](around:${radius},${lat},${lng});
          way["tourism"~"hotel|motel|guest_house|hostel"](around:${radius},${lat},${lng});
        );
        out center;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();

      const results = data.elements.map(el => {
        const name = el.tags.name || 'Unnamed Lodge';
        const type = el.tags.tourism || 'Lodge';
        const phone = el.tags.phone || el.tags['contact:phone'] || 'N/A';
        const elLat = el.lat || el.center.lat;
        const elLng = el.lon || el.center.lon;
        // Simple distance calculation (haversine approx)
        const R = 6371; // km
        const dLat = (elLat - lat) * Math.PI / 180;
        const dLon = (elLng - lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat * Math.PI / 180) * Math.cos(elLat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return { id: el.id, name, type, phone, lat: elLat, lng: elLng, distance };
      }).sort((a, b) => a.distance - b.distance);

      setLodges(results);
    } catch (err) {
      setError('Failed to fetch accommodations from OpenStreetMap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Nearby Accommodations</h2>
        <select 
          value={radius} onChange={e => setRadius(Number(e.target.value))}
          style={{ padding: '8px 16px', borderRadius: '4px' }}
        >
          <option value={1000}>Within 1 km</option>
          <option value={2000}>Within 2 km</option>
          <option value={5000}>Within 5 km</option>
          <option value={10000}>Within 10 km</option>
        </select>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Find budget lodges, guest houses, and hostels near your current location or job site.
      </p>

      {error && <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <p>Searching for nearby places...</p>
      ) : lodges.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {lodges.map(lodge => (
            <div key={lodge.id} className="dashboard-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{lodge.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                  <span style={{ textTransform: 'capitalize' }}>🏠 {lodge.type.replace('_', ' ')}</span>
                  <span>📞 {lodge.phone}</span>
                  <span>📍 {lodge.distance.toFixed(1)} km away</span>
                </div>
              </div>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${lodge.lat},${lodge.lng}`} 
                target="_blank" rel="noreferrer"
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Directions
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '48px' }}>
          <span style={{ fontSize: '3rem' }}>🏨</span>
          <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>No accommodations found within the selected radius.</p>
        </div>
      )}
    </div>
  );
};

export default AccommodationFinder;
