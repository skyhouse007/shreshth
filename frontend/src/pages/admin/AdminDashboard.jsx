import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Building2, Inbox, Mail, Sparkles } from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';
import { StatCardSkeleton } from '../../components/Skeletons.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-sm text-neutral-500">Could not load dashboard.</p>;
  }

  const cards = [
    { label: 'Projects', value: stats.totalProperties, icon: Building2, hint: `${stats.featuredProperties} featured` },
    { label: 'Leads', value: stats.totalLeads, icon: Inbox, hint: `${stats.unreadLeads} unread` },
    { label: 'Messages', value: stats.totalContacts, icon: Mail, hint: `${stats.unreadContacts} unread` },
    {
      label: 'Notifications',
      value: stats.notificationCount,
      icon: Sparkles,
      hint: 'Unread leads + messages',
    },
  ];

  return (
    <>
      <SEO title="Dashboard" />
      <div>
        <h1 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">Overview</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Performance snapshot for Shresth Properties.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold heading-dlf text-neutral-500">{c.label}</p>
                  <p className="mt-2 font-sans text-3xl font-bold tabular-nums text-neutral-900 dark:text-white">{c.value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{c.hint}</p>
                </div>
                <span className="rounded-xl bg-gold/15 p-2 text-gold">
                  <c.icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-sm font-semibold heading-dlf text-gold">Inventory by type</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartByType || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#c9a962" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-sm font-semibold heading-dlf text-gold">Recent activity</h2>
            <ul className="mt-4 max-h-72 space-y-4 overflow-y-auto text-sm">
              {(stats.timeline || []).map((item, i) => (
                <li key={i} className="flex gap-3 border-b border-neutral-100 pb-3 dark:border-neutral-800">
                  <span
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                      item.kind === 'lead' ? 'bg-gold' : 'bg-neutral-400'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {item.kind === 'lead' ? 'Lead' : 'Contact'} · {item.title}
                    </p>
                    <p className="text-xs text-neutral-500">{item.subtitle}</p>
                    <p className="text-[10px] heading-dlf text-neutral-400">
                      {item.at ? new Date(item.at).toLocaleString() : ''}
                    </p>
                  </div>
                </li>
              ))}
              {!stats.timeline?.length && <li className="text-neutral-500">No recent items.</li>}
            </ul>
            <div className="mt-4 flex gap-3 text-xs">
              <Link to="/admin/leads" className="text-gold hover:underline">
                View leads
              </Link>
              <Link to="/admin/messages" className="text-gold hover:underline">
                View messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
