import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import RiskBadge from '../../components/ui/RiskBadge';
import SourceLabel from '../../components/ui/SourceLabel';
import { useToast } from '../../context/ToastContext';
import { listAlerts, createAlert, updateAlert } from '../../services/alertService';
import { formatDate } from '../../utils/formatters';
import { DEFAULT_LOCATION } from '../../utils/constants';

export default function AdminAlerts() {
  const toast = useToast();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    message: '',
    disasterType: 'FLOOD',
    riskLevel: 'MEDIUM',
    affectedArea: DEFAULT_LOCATION.locationName,
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
    radiusKm: 25,
    instructions: '',
    source: 'DEMO',
    active: true,
  });

  const load = () => {
    listAlerts()
      .then(({ data }) => setAlerts(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAlert({
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radiusKm: Number(form.radiusKm),
      });
      toast.success('Alert created');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create alert');
    }
  };

  const toggleActive = async (alert) => {
    try {
      await updateAlert(alert._id, { active: !alert.active });
      toast.success(alert.active ? 'Alert deactivated' : 'Alert activated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading alerts..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Alerts Management</h1>
          <p className="mt-1 text-sm text-slate-400">Create and manage disaster alerts</p>
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-500">
          {showForm ? 'Cancel' : 'Create Alert'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="space-y-4 rounded-xl border border-command-700 bg-command-900/60 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="title" required placeholder="Alert title" value={form.title} onChange={handleChange}
              className="rounded-lg border border-command-700 bg-command-900 px-3 py-2 text-sm text-slate-200" />
            <select name="source" value={form.source} onChange={handleChange}
              className="rounded-lg border border-command-700 bg-command-900 px-3 py-2 text-sm text-slate-200">
              <option value="LIVE">LIVE</option>
              <option value="DEMO">DEMO</option>
              <option value="SIMULATED">SIMULATED</option>
            </select>
          </div>
          <textarea name="message" required rows={3} placeholder="Alert message" value={form.message} onChange={handleChange}
            className="w-full rounded-lg border border-command-700 bg-command-900 px-3 py-2 text-sm text-slate-200" />
          <div className="grid gap-4 sm:grid-cols-3">
            <select name="riskLevel" value={form.riskLevel} onChange={handleChange}
              className="rounded-lg border border-command-700 bg-command-900 px-3 py-2 text-sm text-slate-200">
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
            <input name="affectedArea" required placeholder="Affected area" value={form.affectedArea} onChange={handleChange}
              className="rounded-lg border border-command-700 bg-command-900 px-3 py-2 text-sm text-slate-200" />
            <input name="radiusKm" type="number" placeholder="Radius (km)" value={form.radiusKm} onChange={handleChange}
              className="rounded-lg border border-command-700 bg-command-900 px-3 py-2 text-sm text-slate-200" />
          </div>
          <textarea name="instructions" rows={2} placeholder="Safety instructions" value={form.instructions} onChange={handleChange}
            className="w-full rounded-lg border border-command-700 bg-command-900 px-3 py-2 text-sm text-slate-200" />
          <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-500">
            Publish Alert
          </button>
        </form>
      )}

      {!alerts.length ? (
        <EmptyState title="No alerts" message="Create your first disaster alert." />
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a._id} className="flex items-start justify-between gap-4 rounded-xl border border-command-700 bg-command-900/60 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={a.riskLevel} />
                  <SourceLabel source={a.source} />
                  {!a.active && <span className="text-xs text-slate-500">Inactive</span>}
                </div>
                <p className="mt-2 font-medium text-slate-200">{a.title}</p>
                <p className="text-sm text-slate-400">{a.message}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(a.createdAt)}</p>
              </div>
              <button type="button" onClick={() => toggleActive(a)}
                className="shrink-0 rounded border border-command-700 px-3 py-1 text-xs text-slate-400 hover:bg-command-800">
                {a.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
