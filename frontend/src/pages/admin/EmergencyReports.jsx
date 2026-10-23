import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import RiskBadge from '../../components/ui/RiskBadge';
import { useToast } from '../../context/ToastContext';
import {
  listReports,
  updateReportStatus,
  assignResource,
  getNearbyResources,
} from '../../services/emergencyService';
import { formatDate, formatLabel } from '../../utils/formatters';
import { REPORT_STATUSES } from '../../utils/constants';

export default function AdminEmergencyReports() {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyMap, setNearbyMap] = useState({});

  const load = () => {
    setLoading(true);
    listReports()
      .then(({ data }) => setReports(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      toast.success(`Status updated to ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const loadNearby = async (id) => {
    try {
      const { data } = await getNearbyResources(id);
      setNearbyMap((m) => ({ ...m, [id]: data.data || [] }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load resources');
    }
  };

  const handleAssign = async (reportId, resourceId) => {
    try {
      await assignResource(reportId, resourceId);
      toast.success('Resource assigned');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen label="Loading reports..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Emergency Reports</h1>
        <p className="mt-1 text-sm text-slate-400">Review and coordinate emergency responses</p>
      </div>

      {!reports.length ? (
        <EmptyState title="No reports" message="No emergency reports have been submitted." />
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <article key={r._id} className="rounded-xl border border-command-700 bg-command-900/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{formatLabel(r.disasterType)}</span>
                    <RiskBadge level={r.urgency === 'CRITICAL' || r.urgency === 'HIGH' ? 'HIGH' : r.urgency === 'MEDIUM' ? 'MEDIUM' : 'LOW'} />
                    <span className="text-xs uppercase text-slate-500">{formatLabel(r.status)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{r.description}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {r.locationName} — Reported by {r.userId?.name || 'Unknown'} — {formatDate(r.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {REPORT_STATUSES.filter((s) => s !== r.status).map((s) => (
                  <button key={s} type="button" onClick={() => handleStatus(r._id, s)}
                    className="rounded border border-command-700 px-2 py-1 text-xs text-slate-400 hover:bg-command-800">
                    → {formatLabel(s)}
                  </button>
                ))}
                <button type="button" onClick={() => loadNearby(r._id)}
                  className="rounded border border-teal-500/30 px-2 py-1 text-xs text-teal-400 hover:bg-teal-500/10">
                  Find Nearby Resources
                </button>
              </div>

              {nearbyMap[r._id]?.length > 0 && (
                <div className="mt-3 rounded-lg bg-command-800/50 p-3">
                  <p className="text-xs font-medium text-slate-400">Nearby Resources</p>
                  <ul className="mt-2 space-y-1">
                    {nearbyMap[r._id].map((res) => (
                      <li key={res._id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{res.name} ({formatLabel(res.type)})</span>
                        <button type="button" onClick={() => handleAssign(r._id, res._id)}
                          className="text-xs text-teal-400 hover:underline">
                          Assign
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
