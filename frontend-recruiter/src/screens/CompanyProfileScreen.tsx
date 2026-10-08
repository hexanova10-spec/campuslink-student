import React, { useState } from 'react';
import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Users,
  Award,
  Calendar,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  GraduationCap
} from 'lucide-react';
import { useRecruiter } from '../context/RecruiterContext.tsx';
import { api } from '../services/api.ts';

export const CompanyProfileScreen: React.FC = () => {
  const { company, recruiter, jobs, applications, drives, refreshData } = useRecruiter();

  const [name, setName] = useState(company?.name || '');
  const [industry, setIndustry] = useState(company?.industry || '');
  const [website, setWebsite] = useState(company?.website || '');
  const [description, setDescription] = useState(company?.description || '');
  const [locations, setLocations] = useState(company?.locations.join(', ') || '');
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl || '');
  const [tier, setTier] = useState(company?.tier || 'Tier-1 Dream');

  // Contact Directory
  const [contacts, setContacts] = useState(
    company?.recruiterContacts || [
      {
        name: 'Siddharth Rao',
        email: 'siddharth.r@apextech.io',
        phone: '+91 98201 54321',
        designation: 'Director of University Talent'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.s@apextech.io',
        phone: '+91 98450 11223',
        designation: 'Lead Campus Recruiter'
      }
    ]
  );

  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRole, setNewContactRole] = useState('Campus Recruiter');
  const [showAddContact, setShowAddContact] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactEmail.trim()) return;
    setContacts([
      ...contacts,
      {
        name: newContactName.trim(),
        email: newContactEmail.trim(),
        phone: newContactPhone.trim() || '+91 98000 00000',
        designation: newContactRole
      }
    ]);
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.updateCompanyProfile({
        name,
        industry,
        website,
        description,
        locations: locations.split(',').map((l) => l.trim()),
        logoUrl,
        tier,
        recruiterContacts: contacts
      });
      await refreshData();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to update company:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Preset logo alternatives if needed
  const logoPresets = [
    { label: 'FinTech', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200' },
    { label: 'Cloud SaaS', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200' },
    { label: 'AI Labs', url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=200' },
    { label: 'Engineering', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200' }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Page Header with Full Width Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-blue-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/25">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Company Profile & Recruitment Headquarters
              </h1>
              <p className="text-xs text-slate-500">
                Full-width workspace to manage enterprise identity, institutional credentials, and authorized campus recruiter liaisons.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {savedSuccess && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Changes Saved Successfully!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>

      {/* Full-Width Hero Brand Banner Card */}
      <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl border border-blue-100 p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <img
                src={logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200'}
                alt={`${name} Logo`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-200 shadow-md bg-white shrink-0"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-sm" title="Verified Campus Employer">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {name || 'Enterprise Employer'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                  {tier}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified TPO Partner
                </span>
              </div>

              <p className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800">{industry || 'Technology & Software'}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {locations || 'Bengaluru, Hyderabad'}
                </span>
                {website && (
                  <>
                    <span>•</span>
                    <a
                      href={website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar across right side of hero banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Active Requisitions
              </span>
              <span className="text-xl font-black text-blue-700 font-mono mt-0.5 block">
                {jobs.filter((j) => j.status === 'ACTIVE').length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Applicants
              </span>
              <span className="text-xl font-black text-blue-700 font-mono mt-0.5 block">
                {applications.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Campus Drives
              </span>
              <span className="text-xl font-black text-blue-700 font-mono mt-0.5 block">
                {drives.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Recruiters
              </span>
              <span className="text-xl font-black text-blue-700 font-mono mt-0.5 block">
                {contacts.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Full-Width Form & Workspace Grid */}
      <form onSubmit={handleSave} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          {/* LEFT / MAIN COLUMN (8 of 12 columns on large screens) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Card 1: Enterprise Profile & Campus Identity */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-blue-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Enterprise Profile & Registration
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-400">
                  ID: {company?.id}
                </span>
              </div>

              {/* Multi-column grid for inputs so fields are nicely structured without over-stretching */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Company Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Apex Global Technologies"
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Industry & Domain <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                    placeholder="e.g. Cloud Infrastructure, AI & Distributed Systems"
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Official Corporate Website
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-blue-600 absolute left-3.5 top-2.5" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.io"
                      className="w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-medium border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Campus Recruitment Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Tier-1 Dream">Tier-1 Dream Company (CTC &gt; 18 LPA)</option>
                    <option value="Tier-1 Core">Tier-1 Core Engineering (CTC 12-18 LPA)</option>
                    <option value="Tier-2 Premier">Tier-2 Premier Recruiter (CTC 8-12 LPA)</option>
                    <option value="High-Growth Startup">High-Growth Tech Startup</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Campus Hiring Locations & Hubs
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-blue-600 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      value={locations}
                      onChange={(e) => setLocations(e.target.value)}
                      placeholder="Bengaluru (HQ), Hyderabad, Pune, Gurgaon, Remote"
                      className="w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-medium border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Locations displayed to campus placement offices for interview room allocations and logistics.
                  </p>
                </div>

                {/* Logo URL Input with quick presets */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Brand Logo URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 rounded-xl px-3.5 py-2.5 text-xs font-mono border border-blue-100 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[11px] text-slate-400 mr-1">Sample Logos:</span>
                      {logoPresets.map((lp) => (
                        <button
                          key={lp.label}
                          type="button"
                          onClick={() => setLogoUrl(lp.url)}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                        >
                          {lp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Student-Facing Pitch & Company Overview */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-blue-100 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Campus Pitch & Student Proposition
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Visible to authorized students on job postings
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Company Overview & Pitch to Graduating Candidates
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe your organization culture, engineering challenges, high-impact mentorship, and reasons why top graduates should join..."
                  className="w-full rounded-2xl p-4 text-xs font-normal border border-blue-100 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                    Engineering Culture
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Production code ownership from Day 30 with dedicated senior mentors.
                  </p>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                    Fast-Track Career
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Bi-annual appraisal cycles and structured lead transition tracks.
                  </p>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                    Comprehensive Benefits
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Health insurance, wellness allowances, equipment budget & ESOP grants.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 of 12 columns on large screens) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Card 3: Authorized Recruiter Contact Directory (Clearly Visible) */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-blue-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Recruiter Contact Directory
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  {contacts.length} Contacts
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Designated recruiter points of contact shared with University Training & Placement Officers (TPO) for coordination.
              </p>

              {/* Contact list */}
              <div className="space-y-3">
                {contacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-blue-100/80 bg-blue-50/40 hover:bg-blue-50/70 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{contact.name}</p>
                          <span className="text-[10px] font-semibold text-blue-700 block">
                            {contact.designation}
                          </span>
                        </div>
                      </div>

                      {contacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(idx)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity cursor-pointer"
                          title="Remove contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-blue-100 text-[11px] text-slate-600 space-y-1 font-mono">
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1.5 hover:text-blue-700 truncate transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </a>
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1.5 hover:text-blue-700 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{contact.phone}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Contact Form / Button */}
              {!showAddContact ? (
                <button
                  type="button"
                  onClick={() => setShowAddContact(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-blue-300 hover:border-blue-500 bg-white hover:bg-blue-50/60 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Add Recruiter Contact</span>
                </button>
              ) : (
                <div className="p-4 bg-white rounded-2xl border border-blue-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">New Recruiter Liaison</span>
                    <button
                      type="button"
                      onClick={() => setShowAddContact(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs border border-blue-100 bg-slate-50 text-slate-900"
                  />
                  <input
                    type="email"
                    placeholder="Work Email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs border border-blue-100 bg-slate-50 text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number (+91 ...)"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs border border-blue-100 bg-slate-50 text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Designation (e.g. Campus Lead)"
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs border border-blue-100 bg-slate-50 text-slate-900"
                  />

                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Confirm & Add Contact
                  </button>
                </div>
              )}
            </div>

            {/* Card 4: TPO Institutional Verification & Security Badge */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-blue-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Institutional Compliance & Governance
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">AICTE / UGC TPO Accredited</span>
                    <span>Approved for national on-campus recruitment and joint placement drives.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Zero-Leak Privacy Protocol</span>
                    <span>Candidate data is cryptographically isolated by college tenant boundary.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Audit-Compliant Records</span>
                    <span>All rejection reasons, shortlisting steps, and offers are recorded for placement committee review.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Sticky Bar on Mobile / Wide screens for quick saving */}
        <div className="mt-8 pt-4 border-t border-blue-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Active Recruiter Session: <strong className="text-slate-900">{recruiter?.name}</strong> ({recruiter?.role})
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Company profile saved!
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Company Profile'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
