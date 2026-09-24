'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  User,
  Database,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react';

export default function ProfilePage() {
  const {
    profile,
    updateProfile,
    savedAnswers,
    addSavedAnswer,
    updateSavedAnswer,
    deleteSavedAnswer,
    addToast
  } = useApp();

  // Profile Form state
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [targetRole, setTargetRole] = useState(profile.targetRoles[0] || 'Java Developer');
  const [expectedSalary, setExpectedSalary] = useState(profile.expectedSalary);
  const [noticePeriod, setNoticePeriod] = useState(profile.noticePeriod);
  const [relocation, setRelocation] = useState(profile.relocationPreference);
  const [workAuth, setWorkAuth] = useState(profile.workAuthorization);

  // New Saved Answer state
  const [newQuestionPattern, setNewQuestionPattern] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [showAddAnswer, setShowAddAnswer] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({
      name,
      email,
      phone,
      location,
      targetRoles: [targetRole, 'Backend Developer'],
      expectedSalary,
      noticePeriod,
      relocationPreference: relocation,
      workAuthorization: workAuth
    });
  };

  const handleAddNewAnswer = () => {
    if (!newQuestionPattern.trim() || !newAnswerText.trim()) return;
    addSavedAnswer(newQuestionPattern.trim(), newAnswerText.trim(), 'Custom');
    setNewQuestionPattern('');
    setNewAnswerText('');
    setShowAddAnswer(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#172554] flex items-center gap-2.5">
            <User className="w-6 h-6 text-[#4F46E5]" />
            <span>Candidate Profile & Answer Memory</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Configure your core application details and reusable personal answers for Application Copilot
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-br from-[#4F46E5] to-[#2563EB] shadow-md hover:-translate-y-[1px] rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Preferences</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#dbe7f7]">
            <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#4F46E5]" />
              <span>Core Application Attributes</span>
            </h2>
            <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Truth Guard Sync: Active</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#64748b] font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[#64748b] font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[#64748b] font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[#64748b] font-semibold mb-1">Primary Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-2.5 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[#64748b] font-semibold mb-1">Primary Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full p-2.5 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[#64748b] font-semibold mb-1">Expected Salary / CTC</label>
              <input
                type="text"
                value={expectedSalary}
                onChange={e => setExpectedSalary(e.target.value)}
                className="w-full p-2.5 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[#64748b] font-semibold mb-1">Notice Period</label>
              <input
                type="text"
                value={noticePeriod}
                onChange={e => setNoticePeriod(e.target.value)}
                className="w-full p-2.5 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[#64748b] font-semibold mb-1">Work Authorization</label>
              <input
                type="text"
                value={workAuth}
                onChange={e => setWorkAuth(e.target.value)}
                className="w-full p-2.5 bg-[#f5f8ff] border border-[#dbe7f7] rounded-xl text-[#172554] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#475569]">
              <input
                type="checkbox"
                checked={relocation}
                onChange={e => setRelocation(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500"
              />
              <span>Willing to relocate for the right role (Hyderabad, Bengaluru, Pune, etc.)</span>
            </label>
          </div>
        </div>

        {/* Right 1 Col: Saved Answer Memory Bank */}
        <div className="p-6 rounded-3xl bg-white border border-[#dbe7f7] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172554] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#06B6D4]" />
              <span>Personal Answer Memory</span>
            </h2>
            <button
              onClick={() => setShowAddAnswer(!showAddAnswer)}
              className="p-1.5 rounded-lg bg-[#f8faff] hover:bg-white text-[#172554]"
              title="Add Answer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#64748b] leading-relaxed">
            The Copilot looks up these saved responses whenever a matching question pattern is encountered in application forms.
          </p>

          {/* Add Answer Box */}
          {showAddAnswer && (
            <div className="p-4 rounded-2xl bg-[#f5f8ff] border border-[#dbe7f7] space-y-2 text-xs">
              <input
                type="text"
                placeholder="Question keywords (e.g. notice period)..."
                value={newQuestionPattern}
                onChange={e => setNewQuestionPattern(e.target.value)}
                className="w-full p-2 bg-white border border-[#dbe7f7] rounded-lg text-[#172554]"
              />
              <textarea
                rows={2}
                placeholder="Your standard response..."
                value={newAnswerText}
                onChange={e => setNewAnswerText(e.target.value)}
                className="w-full p-2 bg-white border border-[#dbe7f7] rounded-lg text-[#172554]"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddAnswer(false)}
                  className="px-3 py-1 bg-[#f8faff] rounded-lg text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewAnswer}
                  className="px-3 py-1 bg-indigo-600 rounded-lg text-white font-semibold"
                >
                  Save Answer
                </button>
              </div>
            </div>
          )}

          {/* List of Saved Answers */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {savedAnswers.map(ans => (
              <div key={ans.id} className="p-3 rounded-2xl bg-[#f5f8ff]/70 border border-[#dbe7f7] space-y-1 text-xs">
                <div className="flex items-center justify-between text-[#64748b] text-[10px]">
                  <span className="font-bold text-[#4F46E5] uppercase tracking-wider">{ans.questionPattern}</span>
                  <button
                    onClick={() => deleteSavedAnswer(ans.id)}
                    className="hover:text-[#EF4444] transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[#172554] mt-1 text-[11px] leading-relaxed">{ans.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
