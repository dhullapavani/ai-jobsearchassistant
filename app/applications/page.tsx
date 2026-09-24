'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { ApplicationRecord, ApplicationStatus } from '@/lib/types';
import {
  KanbanSquare,
  Table,
  Download,
  Plus,
  Clock,
  Sparkles,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Trash2,
  Edit,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  X
} from 'lucide-react';

const KANBAN_COLUMNS: { status: ApplicationStatus; label: string; color: string; bg: string }[] = [
  { status: 'Saved', label: 'Saved', color: 'text-[#475569]', bg: 'border-[#dbe7f7]' },
  { status: 'Review', label: 'Review', color: 'text-[#4F46E5]', bg: 'border-indigo-900/50' },
  { status: 'Ready', label: 'Ready', color: 'text-[#F59E0B]', bg: 'border-amber-900/50' },
  { status: 'Applied', label: 'Applied', color: 'text-blue-300', bg: 'border-blue-900/50' },
  { status: 'Submission Unverified', label: 'Unverified', color: 'text-[#F59E0B]', bg: 'border-amber-900/50' },
  { status: 'Assessment', label: 'Assessment', color: 'text-purple-300', bg: 'border-purple-900/50' },
  { status: 'Interview', label: 'Interview', color: 'text-[#10B981]', bg: 'border-emerald-900/50' },
  { status: 'Offer', label: 'Offer', color: 'text-[#06B6D4]', bg: 'border-cyan-900/50' },
  { status: 'Rejected', label: 'Rejected', color: 'text-[#EF4444]', bg: 'border-rose-900/50' },
  { status: 'Withdrawn', label: 'Withdrawn', color: 'text-[#64748b]', bg: 'border-[#dbe7f7]' }
];

export default function ApplicationsPage() {
  const {
    applications,
    updateApplicationStatus,
    updateApplicationNotes,
    deleteApplication,
    addToast
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedAppForModal, setSelectedAppForModal] = useState<ApplicationRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Handle Export to CSV
  const handleExportCsv = () => {
    const headers = ['Job Title', 'Company', 'Platform', 'Location', 'Status', 'Match Score', 'Date Created', 'Date Applied', 'Notes'];
    const rows = applications.map(a => [
      `"${a.job.title.replace(/"/g, '""')}"`,
      `"${a.job.company.replace(/"/g, '""')}"`,
      `"${a.job.platform}"`,
      `"${a.job.location}"`,
      `"${a.status}"`,
      `"${a.matchScore}%"`,
      `"${a.dateCreated}"`,
      `"${a.dateApplied || 'N/A'}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ai_jobpilot_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Export Complete',
      message: 'Applications exported to CSV successfully.'
    });
  };

  const handleOpenNotesModal = (app: ApplicationRecord) => {
    setSelectedAppForModal(app);
    setEditingNotes(app.notes || '');
  };

  const handleSaveNotes = () => {
    if (selectedAppForModal) {
      updateApplicationNotes(selectedAppForModal.id, editingNotes);
      setSelectedAppForModal({ ...selectedAppForModal, notes: editingNotes });
      addToast({
        type: 'success',
        title: 'Notes Saved',
        message: 'Updated application notes and interview notes.'
      });
    }
  };

  const filteredApps = applications.filter(a => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return a.job.title.toLowerCase().includes(q) || a.job.company.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#172554] flex items-center gap-2.5">
            <KanbanSquare className="w-6 h-6 text-purple-400" />
            <span>Application Tracker & Audit History</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Manage your full application pipeline across 9 distinct lifecycle stages with audit trail
          </p>
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-[#dbe7f7] text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[#64748b] hover:text-white'
              }`}
            >
              <KanbanSquare className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[#64748b] hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>History Table</span>
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 text-xs font-bold text-[#172554] bg-white hover:bg-[#f8faff] border border-[#dbe7f7] rounded-xl transition-all flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
          {KANBAN_COLUMNS.map(col => {
            const colApps = filteredApps.filter(a => a.status === col.status);

            return (
              <div
                key={col.status}
                className="w-72 flex-shrink-0 flex flex-col rounded-2xl bg-white border border-[#dbe7f7] p-3.5 max-h-[78vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#dbe7f7]">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#f8faff] text-[#64748b]">
                      {colApps.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {colApps.length === 0 ? (
                    <div className="p-4 text-center border border-dashed border-[#dbe7f7] rounded-xl text-[11px] text-slate-600">
                      No jobs in {col.label}
                    </div>
                  ) : (
                    colApps.map(app => (
                      <div
                        key={app.id}
                        className="p-4 rounded-xl bg-[#f5f8ff]/80 border border-[#dbe7f7] hover:border-indigo-500/50 transition-all space-y-2.5 group shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f8faff] text-[#475569]">
                            {app.job.platform}
                          </span>
                          <span className="text-[10px] font-bold text-[#10B981]">
                            {app.matchScore}% Match
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-[#172554] leading-tight">{app.job.title}</h4>
                          <p className="text-[11px] text-[#64748b] mt-0.5">{app.job.company}</p>
                        </div>

                        <div className="text-[10px] text-[#64748b] flex items-center justify-between pt-1 border-t border-[#dbe7f7]">
                          <span>{app.job.location.split(',')[0]}</span>
                          <span>{app.dateApplied ? `Applied ${app.dateApplied}` : app.dateCreated}</span>
                        </div>

                        {/* Card Controls & Status Selector */}
                        <div className="pt-2 flex items-center justify-between gap-1">
                          <select
                            value={app.status}
                            onChange={e => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                            className="text-[10px] bg-white border border-[#dbe7f7] rounded-lg px-2 py-1 text-[#475569] focus:outline-none"
                          >
                            {KANBAN_COLUMNS.map(c => (
                              <option key={c.status} value={c.status}>
                                {c.label}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleOpenNotesModal(app)}
                            className="p-1 rounded text-[#64748b] hover:text-[#172554] hover:bg-[#f8faff]"
                            title="Notes & Audit Trail"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabular History View */}
      {viewMode === 'table' && (
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748b]" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Filter applications..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8faff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none"
              />
            </div>
            <span className="text-xs text-[#64748b]">{filteredApps.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#475569]">
              <thead className="border-b border-[#dbe7f7] text-[10px] uppercase font-bold text-[#64748b] bg-[#f5f8ff]/40">
                <tr>
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Match %</th>
                  <th className="py-3 px-4">Date Added</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-[#f8faff] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#172554]">{app.job.title}</div>
                      <div className="text-[11px] text-[#64748b]">{app.job.company} • {app.job.location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f8faff] text-[#475569] border border-[#dbe7f7]">
                        {app.job.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#10B981]">{app.matchScore}%</span>
                    </td>
                    <td className="py-3 px-4 text-[#64748b] font-mono text-[11px]">
                      {app.dateCreated}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={e => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                        className="text-xs bg-[#f8faff] border border-[#dbe7f7] rounded-lg px-2.5 py-1 text-[#172554]"
                      >
                        {KANBAN_COLUMNS.map(c => (
                          <option key={c.status} value={c.status}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenNotesModal(app)}
                          className="p-1.5 text-[#64748b] hover:text-[#172554] rounded-lg hover:bg-[#f8faff]"
                          title="View Details"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="p-1.5 text-[#64748b] hover:text-[#EF4444] rounded-lg hover:bg-[#f8faff]"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes & Audit Trail Modal */}
      {selectedAppForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f5f8ff]/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white border border-[#dbe7f7] p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-[#dbe7f7] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172554]">{selectedAppForModal.job.title}</h3>
                <p className="text-xs text-[#64748b]">{selectedAppForModal.job.company} • Status: {selectedAppForModal.status}</p>
              </div>
              <button
                onClick={() => setSelectedAppForModal(null)}
                className="p-1.5 text-[#64748b] hover:text-[#172554] rounded-lg hover:bg-[#f8faff]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notes Editor */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                Application & Interview Notes
              </label>
              <textarea
                rows={4}
                value={editingNotes}
                onChange={e => setEditingNotes(e.target.value)}
                placeholder="Add assessment deadlines, recruiter contact details, interview feedback..."
                className="w-full p-3 text-xs bg-[#f5f8ff] border border-[#dbe7f7] rounded-2xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] rounded-xl transition-colors shadow-md"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Verifiable Audit Trail */}
            <div className="space-y-3 pt-3 border-t border-[#dbe7f7]">
              <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>Verifiable Application Audit Trail</span>
              </h4>
              <div className="space-y-2">
                {selectedAppForModal.auditTrail.map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#f5f8ff] border border-[#dbe7f7] text-xs">
                    <div className="flex items-center justify-between text-[#64748b] text-[10px]">
                      <span className="font-semibold text-[#4F46E5]">{log.action}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-[#475569] text-xs mt-1">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
