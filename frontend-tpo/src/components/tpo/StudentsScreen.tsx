import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  UserCheck,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { repo } from '../../services/storage';
import { Student } from '../../types';

interface StudentsScreenProps {
  onSelectStudent: (studentId: string) => void;
  onSelectScreen: (screenId: number) => void;
}

export const StudentsScreen: React.FC<StudentsScreenProps> = ({ onSelectStudent, onSelectScreen }) => {
  const students = repo.getStudents();
  const mentors = repo.getMentors();
  const institution = repo.getEffectiveInstitution();

  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedReadiness, setSelectedReadiness] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [minCgpa, setMinCgpa] = useState<number>(0);

  // Filter students
  const filtered = students.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.primarySkills.some(sk => sk.toLowerCase().includes(search.toLowerCase()));
    const matchesBranch = selectedBranch === 'ALL' || s.branch === selectedBranch;
    const matchesReadiness = selectedReadiness === 'ALL' || s.readinessLevel === selectedReadiness;
    const matchesStatus = selectedStatus === 'ALL' || s.placementStatus === selectedStatus;
    const matchesCgpa = s.cgpa >= minCgpa;

    return matchesSearch && matchesBranch && matchesReadiness && matchesStatus && matchesCgpa;
  });

  const handleExportCSV = () => {
    const headers = ['Roll Number', 'Full Name', 'Branch', 'CGPA', 'Active Backlogs', 'Readiness', 'Placement Status', 'Placed Company', 'Package (LPA)'];
    const rows = filtered.map(s => [
      s.rollNumber,
      s.fullName,
      s.branch,
      s.cgpa,
      s.activeBacklogs,
      s.readinessLevel,
      s.placementStatus,
      s.placedCompany || 'N/A',
      s.placedPackageLPA || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${institution.code}_Students_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleRisk = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    repo.flagStudentAtRisk(student.id, !student.isFlaggedAtRisk, student.isFlaggedAtRisk ? 15 : 75);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              Institutional Students Roster
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {students.length} Total Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Displaying institutional placement credentials for {institution.name}. Private personal details remain shielded.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectScreen(6)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>At-Risk Engine ({students.filter(s => s.isFlaggedAtRisk).length})</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Verified CSV</span>
          </button>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, roll no, or skill (e.g. Distributed Systems)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="IT">Information Tech (IT)</option>
              <option value="MECH">Mechanical (MECH)</option>
              <option value="EEE">Electrical (EEE)</option>
            </select>
          </div>

          {/* Readiness Filter */}
          <div>
            <select
              value={selectedReadiness}
              onChange={e => setSelectedReadiness(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Readiness Levels</option>
              <option value="HIGHLY_EMPLOYABLE">Highly Employable</option>
              <option value="PLACEMENT_READY">Placement Ready</option>
              <option value="DEVELOPING">Developing</option>
              <option value="AT_RISK">At Risk</option>
            </select>
          </div>

          {/* Min CGPA */}
          <div>
            <select
              value={minCgpa}
              onChange={e => setMinCgpa(parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={0}>Any CGPA Cutoff</option>
              <option value={7.0}>CGPA ≥ 7.0 (Core Filter)</option>
              <option value={7.5}>CGPA ≥ 7.5 (Dream Filter)</option>
              <option value={8.0}>CGPA ≥ 8.0 (Super Dream)</option>
              <option value={8.5}>CGPA ≥ 8.5 (Tier 1 Preferred)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Showing <strong className="text-white">{filtered.length}</strong> matching students out of {students.length}</span>
          {(search || selectedBranch !== 'ALL' || selectedReadiness !== 'ALL' || minCgpa > 0) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedBranch('ALL');
                setSelectedReadiness('ALL');
                setSelectedStatus('ALL');
                setMinCgpa(0);
              }}
              className="text-indigo-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Data Dense Students Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-3">Branch & Campus</th>
                <th className="py-3 px-3">CGPA / Backlogs</th>
                <th className="py-3 px-3">Readiness Tier</th>
                <th className="py-3 px-3">Core Technical Skills</th>
                <th className="py-3 px-3">Status / Offer</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(student => {
                  const mentor = mentors.find(m => m.id === student.mentorId);
                  return (
                    <tr
                      key={student.id}
                      onClick={() => onSelectStudent(student.id)}
                      className="hover:bg-slate-800/50 cursor-pointer transition group"
                    >
                      {/* Name & Roll */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition">
                          {student.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {student.rollNumber} • {student.graduationYear} Batch
                        </div>
                      </td>

                      {/* Branch & Campus */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-300">{student.branch}</span>
                        <div className="text-[11px] text-slate-500">{student.campusId}</div>
                      </td>

                      {/* CGPA & Backlogs */}
                      <td className="py-3 px-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${student.cgpa >= 8.0 ? 'text-emerald-400' : student.cgpa >= 7.0 ? 'text-sky-300' : 'text-amber-400'}`}>
                            {student.cgpa.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500">CGPA</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {student.activeBacklogs > 0 ? (
                            <span className="text-rose-400 font-bold">{student.activeBacklogs} Backlogs</span>
                          ) : (
                            <span className="text-emerald-500">0 Backlogs</span>
                          )}
                        </div>
                      </td>

                      {/* Readiness */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            student.readinessLevel === 'HIGHLY_EMPLOYABLE'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : student.readinessLevel === 'PLACEMENT_READY'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : student.readinessLevel === 'DEVELOPING'
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                          }`}
                        >
                          {student.readinessLevel.replace('_', ' ')}
                        </span>
                        {student.isFlaggedAtRisk && (
                          <div className="text-[10px] text-rose-400 font-bold mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Risk: {student.riskScore}%</span>
                          </div>
                        )}
                      </td>

                      {/* Skills */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {student.primarySkills.slice(0, 3).map((sk, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700/60"
                            >
                              {sk}
                            </span>
                          ))}
                          {student.primarySkills.length > 3 && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              +{student.primarySkills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Placement Status */}
                      <td className="py-3 px-3">
                        {student.placementStatus === 'PLACED' ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              PLACED ({student.placedPackageLPA} LPA)
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                              {student.placedCompany}
                            </div>
                          </div>
                        ) : student.placementStatus === 'OFFERED' ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                              OFFERED ({student.placedPackageLPA} LPA)
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">{student.placedCompany}</div>
                          </div>
                        ) : student.placementStatus === 'INTERVIEWING' ? (
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                            INTERVIEWING
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                            {student.placementStatus}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={e => handleToggleRisk(student, e)}
                            className={`p-1.5 rounded-lg border text-xs transition ${
                              student.isFlaggedAtRisk
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-slate-700'
                            }`}
                            title={student.isFlaggedAtRisk ? 'Remove At-Risk Flag' : 'Flag Student At-Risk'}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectStudent(student.id)}
                            className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition"
                            title="Open Full Student Record"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
