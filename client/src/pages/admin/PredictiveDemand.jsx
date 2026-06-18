import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { FaChartLine, FaExclamationTriangle, FaMapMarkerAlt, FaRobot, FaCalendarAlt } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const PredictiveDemand = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  // Mock Data
  const [demandForecast, setDemandForecast] = useState(null);
  const [shortageAlerts, setShortageAlerts] = useState([]);
  const [highDemandCategories, setHighDemandCategories] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDemandForecast({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Predicted Demand (Jobs)',
            data: [120, 150, 180, 220, 300, 350, 400, 380, 310, 250, 180, 140],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Available Workforce',
            data: [100, 120, 130, 160, 210, 250, 290, 280, 260, 220, 160, 110],
            borderColor: '#10B981',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      });

      setShortageAlerts([
        { location: 'Downtown Hub', category: 'Construction', shortfall: 45, urgency: 'High' },
        { location: 'North Industrial', category: 'Electricians', shortfall: 20, urgency: 'Medium' },
        { location: 'South Suburbs', category: 'Plumbing', shortfall: 15, urgency: 'Medium' }
      ]);

      setHighDemandCategories([
        { category: 'Heavy Machinery Operators', growth: '+45%', currentDemand: 'Very High' },
        { category: 'Carpenters', growth: '+30%', currentDemand: 'High' },
        { category: 'General Labor', growth: '+25%', currentDemand: 'High' }
      ]);

      setAiRecommendations([
        "Offer a +15% wage bonus for Construction workers in Downtown Hub to bridge the 45-worker shortfall next month.",
        "Initiate a targeted training program for Electricians; demand is predicted to outpace supply by Q3.",
        "Shift 20% of unassigned General Labor to South Suburbs where residential projects are spiking."
      ]);

      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <FaChartLine style={{ fontSize: '3rem', marginBottom: '10px', animation: 'pulse 2s infinite' }} />
        <h2>Analyzing Predictive Models...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaChartLine style={{ color: '#3B82F6' }} /> {t('predictive_demand_analytics', 'Predictive Labor Demand Analytics')}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Forecast future labor needs based on historical data and seasonal trends.</p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <FaCalendarAlt /> Generate Q3 Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Main Chart */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 20px' }}>12-Month Demand vs Supply Forecast</h3>
          <div style={{ height: '350px' }}>
            <Line 
              data={demandForecast} 
              options={{
                maintainAspectRatio: false,
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { position: 'top' } },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'var(--border-color)' } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>

        {/* Shortage Alerts */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444' }}>
            <FaExclamationTriangle /> Worker Shortage Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {shortageAlerts.map((alert, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px',
                borderLeft: `4px solid ${alert.urgency === 'High' ? '#EF4444' : '#F59E0B'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{alert.category}</strong>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: alert.urgency === 'High' ? '#EF4444' : '#F59E0B' }}>{alert.urgency}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <FaMapMarkerAlt /> {alert.location}
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                  Predicted Shortfall: <span style={{ color: '#EF4444' }}>{alert.shortfall} workers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* High Demand Categories */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px' }}>Trending Job Categories</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>YoY Growth</th>
                <th style={{ padding: '10px', color: 'var(--text-secondary)' }}>Current Demand</th>
              </tr>
            </thead>
            <tbody>
              {highDemandCategories.map((cat, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 500 }}>{cat.category}</td>
                  <td style={{ padding: '12px 10px', color: '#10B981', fontWeight: 600 }}>{cat.growth}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600
                    }}>
                      {cat.currentDemand}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations */}
        <div className="card" style={{ padding: '20px', background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(139, 92, 246, 0.05) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6' }}>
            <FaRobot /> AI Workforce Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {aiRecommendations.map((rec, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px',
                display: 'flex', gap: '12px', alignItems: 'flex-start'
              }}>
                <div style={{ 
                  background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', 
                  width: '28px', height: '28px', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' 
                }}>
                  {idx + 1}
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveDemand;
