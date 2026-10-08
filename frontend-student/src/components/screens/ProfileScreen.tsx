import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  User,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Target,
  MapPin,
  RefreshCw
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { student, refreshStudentData } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    bio: '',
    rollNumber: '',
    targetRole: 'Software Engineer',
    preferredLocations: [] as string[],
    avatarUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.full_name || '',
        mobile: student.mobile || '',
        bio: student.bio || '',
        rollNumber: student.roll_number || '',
        targetRole: student.target_role || 'Software Engineer',
        preferredLocations: student.preferred_locations || ['Bangalore', 'Hyderabad', 'Pune'],
        avatarUrl: student.avatar_url || '',
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.updateProfile({
        full_name: formData.fullName,
        mobile: formData.mobile,
        bio: formData.bio,
        roll_number: formData.rollNumber,
        target_role: formData.targetRole,
        preferred_locations: formData.preferredLocations,
        avatar_url: formData.avatarUrl,
      });
      await refreshStudentData();
      setMessage('Profile updated successfully! AI Readiness and Skill Gap scores have been recalculated.');
    } catch (err: any) {
      setMessage('Failed to update: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Student Profile & Placement Preferences</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Manage your personal data, roll numbers, and target career paths.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Ownership Verified
          </span>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
        {/* Avatar & Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-blue-100 dark:border-slate-800">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-blue-50 dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm"><input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setFormData(x=>({...x,avatarUrl:String(r.result)}));r.readAsDataURL(f)}} />
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            )}
          <button type="button" onClick={()=>avatarInput.current?.click()} className="absolute bottom-0 right-0 px-1.5 py-1 bg-blue-600 text-white text-[9px] font-bold rounded-tl-lg">Change</button></div>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{student?.full_name}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">{student?.college_name} • {student?.branch}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-800 dark:text-slate-300 font-mono border border-blue-200/80 dark:border-slate-700">
                Roll No: {student?.roll_number}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium">
                Graduation: {student?.graduation_year}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">Personal & Contact Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Contact</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">University Roll Number</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Profile Avatar Image URL / Uploaded Photo</label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Executive Summary / Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white resize-none focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Career Preferences */}
        <div className="space-y-4 pt-4 border-t border-blue-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">Placement Targeting</h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Engineering Role</label>
            <select
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            >
              <option value="Software Engineer">Software Engineer (General SDE)</option>
              <option value="Backend Developer">Backend Systems Developer</option>
              <option value="Frontend Developer">Frontend Web Developer</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="Cloud Engineer">Cloud & DevOps Engineer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Data Scientist">Data Scientist & ML Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Placement Locations</label>
            <div className="flex flex-wrap gap-2">
              {['Bangalore', 'Hyderabad', 'Pune', 'Gurugram', 'Mumbai', 'Noida', 'Remote'].map((city) => {
                const isSelected = formData.preferredLocations.includes(city);
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      const updated = isSelected
                        ? formData.preferredLocations.filter((c) => c !== city)
                        : [...formData.preferredLocations, city];
                      setFormData({ ...formData, preferredLocations: updated });
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-950 border-blue-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-blue-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Recalculating Scores...' : 'Save & Recalculate AI Scores'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
