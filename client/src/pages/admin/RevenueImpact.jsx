import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { FaRupeeSign, FaChartLine, FaDownload, FaBriefcase, FaHandHoldingUsd, FaUsers } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const StatCard = ({ title, value, subtitle, icon, trend, color }) => (
  <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{
      width: '60px', height: '60px', borderRadius: '16px',
      background: `rgba(${color}, 0.15)`, color: `rgb(${color})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem'
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: '0 0 4px', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
      <h2 style={{ margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {value}
        {trend && (
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: trend.startsWith('+') ? '#10B981' : '#EF4444', background: trend.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
            {trend}
          </span>
        )}
      </h2>
      {subtitle && <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{subtitle}</p>}
    </div>
  </div>
);

const RevenueImpact = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const dashboardRef = useRef(null);

  // Mock Data
  const [revenueTrend, setRevenueTrend] = useState(null);
  const [categoryIncome, setCategoryIncome] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setRevenueTrend({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Total Wages Generated (₹)',
            data: [450000, 520000, 610000, 580000, 720000, 850000],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Platform Revenue (₹)',
            data: [45000, 52000, 61000, 58000, 72000, 85000],
            borderColor: '#3B82F6',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      });

      setCategoryIncome({
        labels: ['Construction', 'Plumbing', 'Electrical', 'Carpentry', 'General Labor'],
        datasets: [{
          data: [35, 20, 25, 10, 10],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      });

      setLoading(false);
    }, 800);
  }, []);

  const handleDownloadReport = () => {
    setIsGenerating(true);
    
    // Give React a moment to render the hidden report element
    setTimeout(async () => {
      const reportElement = document.getElementById('pdf-report-container');
      if (!reportElement) return setIsGenerating(false);
      
      try {
        const canvas = await html2canvas(reportElement, {
          scale: 2,
          useCORS: true,
          logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`revenue_impact_report_${new Date().toISOString().slice(0, 10)}.pdf`);
      } catch (err) {
        console.error("Failed to generate PDF", err);
      } finally {
        setIsGenerating(false);
      }
    }, 500); // Wait 500ms for charts in the hidden div to fully render
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <FaRupeeSign style={{ fontSize: '3rem', marginBottom: '10px', animation: 'pulse 2s infinite' }} />
        <h2>Calculating Economic Impact...</h2>
      </div>
    );
  }

  return (
    <div className="container" ref={dashboardRef} style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaChartLine style={{ color: '#10B981' }} /> Revenue & Economic Impact
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Track total jobs created, wages distributed, and overall platform growth.</p>
        </div>
        <button className="btn btn-primary" onClick={handleDownloadReport} disabled={isGenerating} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isGenerating ? <div className="spinner" style={{width: 16, height: 16, border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div> : <FaDownload />} 
          {isGenerating ? 'Generating...' : 'Download Report'}
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <StatCard 
          title="Total Wages Generated" value="₹3.7M" trend="+18.5%" subtitle="In the last 6 months" 
          icon={<FaRupeeSign />} color="16, 185, 129" 
        />
        <StatCard 
          title="Platform Revenue" value="₹373K" trend="+18.5%" subtitle="10% platform fee applied" 
          icon={<FaChartLine />} color="59, 130, 246" 
        />
        <StatCard 
          title="Avg. Worker Earnings" value="₹18,500" trend="+5.2%" subtitle="Per month on average" 
          icon={<FaHandHoldingUsd />} color="245, 158, 11" 
        />
        <StatCard 
          title="Jobs Created" value="4,250" trend="+12.4%" subtitle="Successfully completed jobs" 
          icon={<FaBriefcase />} color="139, 92, 246" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Employment Growth Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px' }}>Wages & Revenue Growth (6 Months)</h3>
          <div style={{ height: '350px' }}>
            <Line 
              data={revenueTrend} 
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

        {/* Category Income Distribution */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 20px' }}>Income by Category</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ height: '250px', width: '100%' }}>
              <Doughnut 
                data={categoryIncome} 
                options={{
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: { legend: { position: 'bottom', labels: { padding: 20 } } }
                }} 
              />
            </div>
            {/* Center Text */}
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Top Category</p>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#3B82F6' }}>35%</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Economic Impact Analytics */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)', border: 'none' }}>
        <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUsers style={{ color: '#8B5CF6' }} /> Community Economic Impact
        </h3>
        <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Labor Connect has significantly contributed to the local economy by bridging the gap between gig workers and employers. The platform has effectively reduced unemployment idle time by <strong>34%</strong> and increased the average daily wage of a registered worker by <strong>₹150</strong> compared to the unorganized sector.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #10B981' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Skill Upgradation Impact</h4>
            <p style={{ margin: 0, fontWeight: 600 }}>28% of workers moved to higher-paying categories.</p>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Financial Inclusion</h4>
            <p style={{ margin: 0, fontWeight: 600 }}>1,200+ workers opened their first bank accounts.</p>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #8B5CF6' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Regional Growth</h4>
            <p style={{ margin: 0, fontWeight: 600 }}>Tier-2 cities saw a 45% increase in job postings.</p>
          </div>
        </div>
      </div>

      {/* Hidden Report Container for PDF Generation */}
      {isGenerating && (
        <div id="pdf-report-container" style={{
          position: 'absolute', top: '-10000px', left: '-10000px',
          width: '1000px', backgroundColor: '#ffffff', color: '#1e293b',
          padding: '60px', fontFamily: '"Inter", sans-serif'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '3px solid #10B981', paddingBottom: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#10B981', color: 'white', padding: '12px', borderRadius: '12px', fontSize: '2rem' }}>
              <FaChartLine />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#0f172a' }}>Labor Connect</h1>
              <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '1.2rem' }}>Revenue & Economic Impact Report — {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            <div style={{ flex: 1, padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
               <p style={{ margin: '0 0 8px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.85rem' }}>Total Wages Generated</p>
               <h2 style={{ margin: 0, color: '#10B981', fontSize: '2.2rem' }}>₹3.7M</h2>
               <p style={{ margin: '8px 0 0', color: '#10B981', fontWeight: 600, fontSize: '0.9rem', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>+18.5%</p>
            </div>
            <div style={{ flex: 1, padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
               <p style={{ margin: '0 0 8px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.85rem' }}>Platform Revenue</p>
               <h2 style={{ margin: 0, color: '#3B82F6', fontSize: '2.2rem' }}>₹373K</h2>
               <p style={{ margin: '8px 0 0', color: '#10B981', fontWeight: 600, fontSize: '0.9rem', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>+18.5%</p>
            </div>
            <div style={{ flex: 1, padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
               <p style={{ margin: '0 0 8px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.85rem' }}>Avg. Worker Earnings</p>
               <h2 style={{ margin: 0, color: '#F59E0B', fontSize: '2.2rem' }}>₹18,500</h2>
               <p style={{ margin: '8px 0 0', color: '#10B981', fontWeight: 600, fontSize: '0.9rem', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>+5.2%</p>
            </div>
            <div style={{ flex: 1, padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
               <p style={{ margin: '0 0 8px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.85rem' }}>Jobs Created</p>
               <h2 style={{ margin: 0, color: '#8B5CF6', fontSize: '2.2rem' }}>4,250</h2>
               <p style={{ margin: '8px 0 0', color: '#10B981', fontWeight: 600, fontSize: '0.9rem', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>+12.4%</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
             <div style={{ flex: 2, padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
               <h3 style={{ margin: '0 0 20px', color: '#0f172a' }}>Wages & Revenue Growth (6 Months)</h3>
               <div style={{ height: '300px' }}>
                 <Line data={revenueTrend} options={{ maintainAspectRatio: false, animation: false, plugins: { legend: { position: 'top', labels: { color: '#334155' } } }, scales: { x: { ticks: { color: '#64748b' }, grid: { display: false } }, y: { ticks: { color: '#64748b' }, grid: { color: '#f1f5f9' } } } }} />
               </div>
             </div>
             <div style={{ flex: 1, padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
               <h3 style={{ margin: '0 0 20px', color: '#0f172a' }}>Income by Category</h3>
               <div style={{ flex: 1, position: 'relative' }}>
                 <Doughnut data={categoryIncome} options={{ maintainAspectRatio: false, animation: false, plugins: { legend: { position: 'bottom', labels: { color: '#334155', padding: 15 } } } }} />
               </div>
             </div>
          </div>
          
          <div style={{ padding: '30px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUsers style={{ color: '#8B5CF6' }} /> Community Economic Impact
            </h3>
            <p style={{ margin: '0 0 24px', color: '#475569', lineHeight: 1.6, fontSize: '1.05rem' }}>
              Labor Connect has significantly contributed to the local economy by bridging the gap between gig workers and employers. The platform has effectively reduced unemployment idle time by <strong>34%</strong> and increased the average daily wage of a registered worker by <strong>₹150</strong> compared to the unorganized sector.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #10B981', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#64748b' }}>Skill Upgradation Impact</h4>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>28% of workers moved to higher-paying categories.</p>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3B82F6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#64748b' }}>Financial Inclusion</h4>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>1,200+ workers opened their first bank accounts.</p>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #8B5CF6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#64748b' }}>Regional Growth</h4>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>Tier-2 cities saw a 45% increase in job postings.</p>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            © {new Date().getFullYear()} Labor Connect Platform Analytics. Confidential internal report.
          </div>
        </div>
      )}

    </div>
  );
};

export default RevenueImpact;
