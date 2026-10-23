import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { listReports } from '../../services/emergencyService';
import { listUsers, getAnalytics, triggerDemoHighRisk } from '../../services/adminService';
import { submitSensorReading } from '../../services/sensorService';
import { listAlerts } from '../../services/alertService';

export default function AdminDashboard() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ reports: 0, users: 0, alerts: 0, pending: 0 });
  const [triggering, setTriggering] = useState(false);
  const [sensorSending, setSensorSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [reportsRes, usersRes, alertsRes] = await Promise.allSettled([
          listReports(),
          listUsers(),
          listAlerts(),
        ]);
        const reports = reportsRes.status === 'fulfilled' ? reportsRes.value.data.data || [] : [];
        const users = usersRes.status === 'fulfilled' ? usersRes.value.data.data || [] : [];
        const alerts = alertsRes.status === 'fulfilled' ? alertsRes.value.data.data || [] : [];
        setStats({
          reports: reports.length,
          users: users.length,
          alerts: alerts.filter((a) => a.active).length,
          pending: reports.filter((r) => r.status === 'PENDING').length,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDemoTrigger = async () => {
    setTriggering(true);
    try {
      await triggerDemoHighRisk({});
      toast.success('DEMO high-risk event triggered');
      const { data } = await getAnalytics();
      if (data.data) toast.info('Analytics updated with new prediction');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Demo trigger failed');
    } finally {
      setTriggering(false);
    }
  };

  const handleSensorHighRisk = async () => {
    setSensorSending(true);
    try {
      await submitSensorReading({
        scenario: 'HIGH_RISK',
        rainfall: 180,
        waterLevel: 5.2,
        humidity: 95,
        temperature: 27,
        latitude: 14.68,
        longitude: 77.6,
        locationName: 'Anantapur, Andhra Pradesh',
      });
      toast.success('Simulated HIGH-RISK sensor data sent through ML pipeline');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sensor simulation failed');
    } finally {
      setSensorSending(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading admin dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Coordination overview and demo controls</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Emergency Reports" value={stats.reports} sub={`${stats.pending} pending`} icon="🆘" accent="red" />
        <StatCard label="Registered Users" value={stats.users} icon="👥" />
        <StatCard label="Active Alerts" value={stats.alerts} icon="🔔" accent="amber" />
        <StatCard label="Pending Reviews" value={stats.pending} icon="📋" accent="amber" />
      </div>

      <section className="rounded-xl border border-risk-medium/30 bg-risk-medium/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Demo Control</p>
            <p className="mt-1 text-sm text-slate-400">
              Simulated sensor data → ML → alert → in-app notification (not real IoT hardware)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={sensorSending}
              onClick={handleSensorHighRisk}
              className="rounded-lg bg-teal-600/80 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-50"
            >
              {sensorSending ? 'Sending...' : 'Simulate HIGH sensor reading'}
            </button>
            <button
              type="button"
              disabled={triggering}
              onClick={handleDemoTrigger}
              className="rounded-lg bg-risk-medium/80 px-4 py-2 text-sm font-medium text-white hover:bg-risk-medium disabled:opacity-50"
            >
              {triggering ? 'Triggering...' : 'Trigger DEMO High Risk'}
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          CLI alternative: <code className="text-teal-300">cd sensor-simulator && node simulator.js high</code>
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { to: '/admin/reports', label: 'Manage Reports' },
          { to: '/admin/resources', label: 'Rescue Resources' },
          { to: '/admin/analytics', label: 'View Analytics' },
        ].map((link) => (
          <Link key={link.to} to={link.to}
            className="rounded-lg border border-command-700 bg-command-900/60 px-4 py-3 text-sm text-slate-300 hover:bg-command-800">
            {link.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
