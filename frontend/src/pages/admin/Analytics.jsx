import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { getAnalytics } from '../../services/adminService';
import { formatLabel } from '../../utils/formatters';

const COLORS = ['#0f766e', '#b45309', '#b91c1c', '#2563eb', '#7c3aed', '#64748b'];

function toChartData(aggregate, keyField = '_id') {
  return (aggregate || []).map((item) => ({
    name: formatLabel(item[keyField] || 'Unknown'),
    count: item.count,
  }));
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalytics()
      .then(({ data: res }) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen label="Loading analytics..." />;
  if (error) return <EmptyState title="Analytics unavailable" message={error} />;
  if (!data) return <EmptyState title="No analytics data" />;

  const disasterData = toChartData(data.byDisasterType);
  const urgencyData = toChartData(data.byUrgency);
  const riskData = toChartData(data.byRiskLevel);
  const statusData = toChartData(data.byStatus);
  const resourceData = toChartData(data.resourceAvailability);
  const historyData = (data.predictionHistory || []).map((p) => ({
    date: new Date(p.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    probability: Math.round((p.riskProbability || 0) * 100),
    level: p.riskLevel,
    source: p.source,
  })).reverse();

  const ChartCard = ({ title, children }) => (
    <div className="rounded-xl border border-command-700 bg-command-900/60 p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">Real-time statistics from API data</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Reports by Disaster Type">
          {disasterData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={disasterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b3654" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#12263f', border: '1px solid #1b3654', borderRadius: 8 }} />
                <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">No data</p>}
        </ChartCard>

        <ChartCard title="Reports by Urgency">
          {urgencyData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={urgencyData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {urgencyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#12263f', border: '1px solid #1b3654', borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">No data</p>}
        </ChartCard>

        <ChartCard title="Predictions by Risk Level">
          {riskData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b3654" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#12263f', border: '1px solid #1b3654', borderRadius: 8 }} />
                <Bar dataKey="count" fill="#b45309" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">No data</p>}
        </ChartCard>

        <ChartCard title="Report Status Distribution">
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#12263f', border: '1px solid #1b3654', borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">No data</p>}
        </ChartCard>

        <ChartCard title="Resource Availability">
          {resourceData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={resourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b3654" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#12263f', border: '1px solid #1b3654', borderRadius: 8 }} />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">No data</p>}
        </ChartCard>

        <ChartCard title="Prediction History (Risk %)">
          {historyData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b3654" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#12263f', border: '1px solid #1b3654', borderRadius: 8 }} />
                <Line type="monotone" dataKey="probability" stroke="#b91c1c" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">No prediction history yet</p>}
        </ChartCard>
      </div>
    </div>
  );
}
