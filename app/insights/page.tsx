'use client';

import React from 'react';
import { MOCK_MARKET_SKILLS } from '@/lib/mock-data';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Sparkles,
  Info,
  DollarSign,
  Briefcase,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function InsightsPage() {
  const chartData = MOCK_MARKET_SKILLS.map(s => ({
    name: s.skill.split('/')[0].trim(),
    demand: s.percentage,
    salary: s.averageSalary,
    jobs: s.jobCount
  }));

  const workModeData = [
    { name: 'Hybrid', value: 45, color: '#6366f1' },
    { name: 'Remote', value: 35, color: '#06b6d4' },
    { name: 'On-site', value: 20, color: '#8b5cf6' }
  ];

  const salaryRangeData = [
    { range: '₹6-8 LPA', count: 32 },
    { range: '₹8-12 LPA', count: 68 },
    { range: '₹12-16 LPA', count: 44 },
    { range: '₹16-24 LPA', count: 18 }
  ];

  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#172554] flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-[#4F46E5]" />
            <span>Job Market Intelligence</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Aggregated trends across analyzed Java Developer postings in your search radius
          </p>
        </div>

        {/* Dataset Disclaimer Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#dbe7f7] text-[11px] text-[#64748b]">
          <Info className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Analysis based on 247 collected job listings in active dataset</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Requested Skills Bar Chart (2 spans) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#4F46E5]" />
                <span>Most Requested Skills (% of Listings)</span>
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Among Java roles analyzed this week, <strong>AWS appeared in 64%</strong> of postings
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" tickFormatter={v => `${v}%`} fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#cbd5e1" fontSize={11} width={100} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-[#172554]">{data.name}</p>
                          <p className="text-[#06B6D4]">Demand: {data.demand}% of jobs</p>
                          <p className="text-[#10B981]">Avg CTC: {data.salary}</p>
                          <p className="text-[#64748b]">Sample: {data.jobs} postings</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="demand" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work Mode Breakdown (1 span) */}
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#06B6D4]" />
              <span>Work Mode Distribution</span>
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">Hybrid continues to dominate entry-level postings</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workModeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {workModeData.map((entry, index) => (
                    <Cell key={`mode-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around text-xs pt-2 border-t border-[#dbe7f7]">
            {workModeData.map(m => (
              <div key={m.name} className="text-center">
                <div className="font-bold text-[#172554]">{m.value}%</div>
                <div className="text-[11px] text-[#64748b]">{m.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Distribution Row */}
      <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#10B981]" />
          <span>Compensation Range Frequency (Fresher / 0-2 yrs)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {salaryRangeData.map(s => (
            <div key={s.range} className="p-4 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7]">
              <span className="text-xs text-[#64748b]">{s.range}</span>
              <div className="text-xl font-bold text-[#10B981] mt-1">{s.count} Postings</div>
              <p className="text-[10px] text-[#64748b] mt-0.5">Standard industry bracket</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
