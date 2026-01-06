'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Grid } from './components/ui';
import { VERDICT_CONFIG, Verdict } from '@/lib/types';
import { Plus, FileText, Clock, ChevronRight, Sparkles, Trash2 } from 'lucide-react';
import LiquidEther from '@/components/LiquidEther';

interface ReportSummary {
  id: string;
  product_name: string;
  verdict: Verdict;
  overall_score: number;
  created_at: string;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Dashboard() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this report?')) return;

    try {
      await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 relative">
      {/* LiquidEther Background */}
      <div className="fixed inset-0 -z-10 bg-neutral-950">
        <LiquidEther
          mouseForce={8}
          cursorSize={210}
          isViscous
          viscous={20}
          colors={["#d1d1d1", "#292929", "#949494"]}
          autoDemo
          autoSpeed={0.3}
          autoIntensity={1.5}
          isBounce={false}
          resolution={0.5}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">Idea Analyzer</h1>
          <p className="text-gray-300 text-lg">Should you build it? Let&apos;s find out.</p>
        </div>

        {/* Action Cards */}
        <Grid cols={2} gap={4} className="mb-12">
          {/* New Report Card */}
          <button
            onClick={() => router.push('/new')}
            className="group text-left p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">New Analysis</h2>
                <p className="text-gray-400 text-sm">Analyze a new product idea with our 9-dimension framework</p>
              </div>
            </div>
          </button>

          {/* Sample Report Card */}
          <button
            onClick={() => router.push('/sample')}
            className="group text-left p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Sample Report</h2>
                <p className="text-gray-400 text-sm">See what an analysis looks like with our example report</p>
              </div>
            </div>
          </button>
        </Grid>

        {/* Reports List */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <span>📊</span>
              Your Reports
            </h2>
            {reports.length > 0 && (
              <p className="text-sm text-gray-400 mt-1">{reports.length} analysis{reports.length === 1 ? '' : 'es'} run</p>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <Sparkles className="w-6 h-6 animate-pulse mx-auto mb-2 text-gray-400" />
              <p className="text-gray-400 text-sm">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 mb-4">No reports yet</p>
              <Button
                onClick={() => router.push('/new')}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create your first analysis
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((report) => {
                const verdictConfig = VERDICT_CONFIG[report.verdict] || VERDICT_CONFIG.maybe;
                const createdAt = new Date(report.created_at);

                return (
                  <button
                    key={report.id}
                    onClick={() => router.push(`/report/${report.id}`)}
                    className="w-full group flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all text-left cursor-pointer"
                  >
                    <div className="text-2xl">{verdictConfig.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{report.product_name}</div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{verdictConfig.label}</span>
                        <span>•</span>
                        <span>{report.overall_score.toFixed(1)}/10</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatRelativeTime(createdAt)}</span>
                    </div>
                    <button
                      onClick={(e) => deleteReport(report.id, e)}
                      className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
