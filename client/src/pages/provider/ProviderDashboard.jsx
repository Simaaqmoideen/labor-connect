import React, { useState, useEffect } from 'react';
import { providerAPI } from '../../services/api';
import WorkerCard from '../../components/WorkerCard';
import MapView from '../../components/MapView';
import useGeolocation from '../../hooks/useGeolocation';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const ProviderDashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ category: '', maxDistance: 10 });
  const { lat, lng, loading: geoLoading } = useGeolocation();

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = { ...searchParams };
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
      }
      const { data } = await providerAPI.searchWorkers(params);
      setWorkers(Array.isArray(data) ? data : (data.workers || []));
    } catch (error) {
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  // Silently save provider's current location to the DB so they appear on the admin map
  useEffect(() => {
    if (lat && lng) {
      providerAPI.updateProviderLocation(lat, lng).catch(() => {});
    }
  }, [lat, lng]);

  useEffect(() => {
    if (!geoLoading) {
      fetchWorkers();
    }
  }, [geoLoading]);

  const mapMarkers = workers.map(w => ({
    lat: w.lat,
    lng: w.lng,
    type: w.availability === 'available' ? 'worker-available' : 'worker-busy',
    popup: `${w.name} - ${w.category}`
  })).filter(m => m.lat && m.lng);

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px' }}>Find Workers</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Discover skilled labor near your location</p>
        </div>
      </div>

      <div className="card" style={{ padding: '15px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1, margin: 0 }}>
          <label className="form-label">Category</label>
          <select className="form-select" value={searchParams.category} onChange={e => setSearchParams({...searchParams, category: e.target.value})}>
            <option value="">All Categories</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Painter">Painter</option>
            <option value="Mason">Mason</option>
            <option value="Helper">Helper</option>
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, margin: 0 }}>
          <label className="form-label">Max Distance (km)</label>
          <input type="number" className="form-input" value={searchParams.maxDistance} onChange={e => setSearchParams({...searchParams, maxDistance: e.target.value})} />
        </div>
        <button className="btn btn-primary" onClick={fetchWorkers}>Search</button>
      </div>

      {lat && lng && (
        <div style={{ marginBottom: '20px' }}>
          <MapView center={[lat, lng]} zoom={11} markers={mapMarkers} showUserLocation height="300px" />
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : workers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No workers found in your area. Try increasing the search distance or changing the category.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {workers.map(worker => (
            <WorkerCard 
              key={worker.id} 
              worker={worker} 
              onSendJob={() => window.location.href = `/provider/jobs/new?workerId=${worker.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
