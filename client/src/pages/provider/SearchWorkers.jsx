import React, { useState, useEffect, useContext } from 'react';
import { providerAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import WorkerCard from '../../components/WorkerCard';
import MapView from '../../components/MapView';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from '../../context/AuthContext';

const SKILLS = ['Mason', 'Carpenter', 'Electrician', 'Plumber', 'Painter', 'Welder', 'Driver', 'Cleaner', 'Gardener', 'Security'];

const SearchWorkers = () => {
  const { user } = useContext(AuthContext);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [filters, setFilters] = useState({
    skill: '',
    maxDistance: 20,
    minRating: 0,
    available: true,
    lat: user?.lat || 12.9716,
    lng: user?.lng || 77.5946,
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await providerAPI.searchWorkers(filters);
      setWorkers(res.data.workers || []);
      if ((res.data.workers || []).length === 0) toast('No workers found matching your criteria');
    } catch {
      toast.error('Failed to search workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handleSearch(); }, []);

  const handleHire = (workerId) => {
    window.location.href = `/provider/jobs/new?workerId=${workerId}`;
  };

  const workerMarkers = workers.map(w => ({
    lat: w.lat,
    lng: w.lng,
    label: w.name,
    type: 'worker',
  }));

  return (
    <div className="search-workers-page">
      <div className="page-header">
        <h1 className="page-title">Find Workers</h1>
        <p className="page-subtitle">Search available workers by skill and location</p>
      </div>

      {/* Filter Panel */}
      <div className="search-filters card">
        <div className="filters-grid">
          <div className="form-group">
            <label>Skill / Trade</label>
            <select
              className="form-control"
              value={filters.skill}
              onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))}
            >
              <option value="">All Skills</option>
              {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Max Distance: {filters.maxDistance} km</label>
            <input
              type="range"
              min={1} max={100}
              value={filters.maxDistance}
              onChange={e => setFilters(f => ({ ...f, maxDistance: Number(e.target.value) }))}
              className="range-slider"
            />
          </div>

          <div className="form-group">
            <label>Min Rating: {filters.minRating}⭐</label>
            <input
              type="range"
              min={0} max={5} step={0.5}
              value={filters.minRating}
              onChange={e => setFilters(f => ({ ...f, minRating: Number(e.target.value) }))}
              className="range-slider"
            />
          </div>

          <div className="form-group toggle-row" style={{ alignSelf: 'end' }}>
            <div>
              <div className="toggle-label">Available Only</div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={filters.available}
                onChange={e => setFilters(f => ({ ...f, available: e.target.checked }))}
              />
              <span className="slider" />
            </label>
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search Workers'}
          </button>
          <div className="view-toggle">
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('list')}
            >📋 List</button>
            <button
              className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('map')}
            >🗺️ Map</button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="search-results">
        <p className="results-count">{workers.length} worker{workers.length !== 1 ? 's' : ''} found</p>

        {loading ? (
          <LoadingSpinner />
        ) : viewMode === 'map' ? (
          <div style={{ height: '500px', borderRadius: '12px', overflow: 'hidden' }}>
            <MapView
              center={[filters.lat, filters.lng]}
              markers={workerMarkers}
              zoom={12}
            />
          </div>
        ) : (
          <div className="workers-grid">
            {workers.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize: '3rem' }}>🔎</span>
                <p>No workers found. Try adjusting your filters.</p>
              </div>
            ) : (
              workers.map(worker => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onSendJob={() => handleHire(worker.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWorkers;
