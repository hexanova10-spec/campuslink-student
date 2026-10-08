import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Search,
  Command,
  ChevronDown,
  Layers,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  ArrowRightLeft,
  Check,
  ExternalLink
} from 'lucide-react';
import { repo } from '../services/storage';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  currentScreen: number;
  onSelectScreen: (screenId: number) => void;
  openPalette: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSelectScreen, openPalette }) => {
  const { theme, toggleTheme, isSidebarOpen, toggleSidebar } = useTheme();
  const currentUser = repo.getCurrentUser();
  const institutions = repo.getInstitutions();
  const effectiveInstitution = repo.getEffectiveInstitution();
  const selectedFilter = repo.getSelectedCollegeFilter();
  const notifications = repo.getNotifications();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCollegeMenu, setShowCollegeMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const collegeMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
      if (collegeMenuRef.current && !collegeMenuRef.current.contains(e.target as Node)) {
        setShowCollegeMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchUser = (userId: string) => {
    repo.setCurrentUser(userId);
    setShowRoleMenu(false);
  };

  const handleSelectCollegeFilter = (collegeId?: string) => {
    repo.setSelectedCollegeFilter(collegeId);
    setShowCollegeMenu(false);
  };

  const unreadCount = notifications.filter(n => !readNotifIds.has(n.id)).length;

  const markAllAsRead = () => {
    setReadNotifIds(new Set(notifications.map(n => n.id)));
  };

  const isDark = theme === 'dark';
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try { await repo.updateTpoProfile({ avatarUrl: String(reader.result) }); } catch (error) { console.error('TPO avatar upload failed', error); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <header
      className={`h-16 sticky top-0 z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between transition-colors duration-200 border-b backdrop-blur-xl ${
        isDark
          ? 'bg-slate-950/70 border-white/10 text-white shadow-md'
          : 'bg-white/80 border-slate-200/80 text-slate-900 shadow-sm shadow-blue-900/5'
      }`}
    >
      {/* =====================================================================
          LEFT: Menu Toggle, Logo, CampusLink Title, Subtitle, Institution
          ===================================================================== */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
        {/* Menu Toggle */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
          className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 font-semibold text-xs border cursor-pointer ${
            isDark
              ? 'bg-[#101C3A] hover:bg-[#15244A] text-blue-300 border-[#1E3A6B]'
              : 'bg-[#F8FAFF] hover:bg-[#EFF6FF] text-[#3155E7] border-[#D9E2F2]'
          }`}
          title={isSidebarOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isSidebarOpen ? (
            <>
              <X className="w-4 h-4 text-[#3155E7]" />
              <span className="hidden sm:inline text-xs font-semibold">Close</span>
            </>
          ) : (
            <>
              <Menu className="w-4 h-4 text-[#3155E7]" />
              <span className="hidden sm:inline text-xs font-semibold">Menu</span>
            </>
          )}
        </button>

        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-600/30 text-white shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="hidden xs:block">
            <div className="flex items-center gap-1.5 leading-none">
              <span className={`font-black text-xs sm:text-sm tracking-tight ${isDark ? 'text-white' : 'text-[#101A3A]'}`}>
                CAMPUSLINK
              </span>
            </div>
            <p className={`text-[10px] font-medium leading-none mt-1 hidden sm:block ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              Placement Operations & Intelligence
            </p>
          </div>
        </div>

        {/* Institution Selector */}
        <div className={`hidden md:flex items-center pl-3 border-l ${isDark ? 'border-[#1E3A6B]' : 'border-[#D9E2F2]'}`} ref={collegeMenuRef}>
          <div className="relative">
            {currentUser.role === 'SYSTEM_ADMIN' ? (
              <button
                onClick={() => setShowCollegeMenu(!showCollegeMenu)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  isDark
                    ? 'bg-[#101C3A] hover:bg-[#15244A] border-[#1E3A6B] text-slate-200'
                    : 'bg-[#F8FAFF] hover:bg-[#EFF6FF] border-[#D9E2F2] text-[#101A3A]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#3155E7] shrink-0" />
                <span className="truncate max-w-[150px] lg:max-w-[200px]">
                  {selectedFilter
                    ? institutions.find(i => i.id === selectedFilter)?.name
                    : 'All Colleges (Global)'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            ) : (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  isDark
                    ? 'bg-[#101C3A] border-[#1E3A6B] text-slate-200'
                    : 'bg-[#F8FAFF] border-[#D9E2F2] text-[#101A3A]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#3155E7] shrink-0" />
                <span className="truncate max-w-[140px] lg:max-w-[190px]">{effectiveInstitution.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#3155E7] text-white font-bold shrink-0 text-white-force">
                  {effectiveInstitution.code}
                </span>
              </div>
            )}

            {/* Admin College Dropdown */}
            {showCollegeMenu && currentUser.role === 'SYSTEM_ADMIN' && (
              <div
                className={`absolute left-0 mt-2 w-72 rounded-2xl p-2 z-50 backdrop-blur-2xl shadow-2xl border animate-in fade-in zoom-in-95 ${
                  isDark
                    ? 'bg-[#0B1530] border-[#1E3A6B] text-[#F8FAFC]'
                    : 'bg-white border-[#D9E2F2] text-[#101A3A]'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-[#3155E7] px-2 py-1">
                  Institutional Scope
                </div>
                <button
                  onClick={() => handleSelectCollegeFilter(undefined)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition ${
                    !selectedFilter
                      ? 'bg-[#3155E7] text-white shadow-md text-white-force'
                      : isDark ? 'text-slate-200 hover:bg-[#101C3A]' : 'text-slate-800 hover:bg-[#F8FAFF]'
                  }`}
                >
                  <span>All Institutions (Global Admin)</span>
                  <Layers className="w-3.5 h-3.5" />
                </button>
                {institutions.map(inst => (
                  <button
                    key={inst.id}
                    onClick={() => handleSelectCollegeFilter(inst.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between mt-1 cursor-pointer transition ${
                      selectedFilter === inst.id
                        ? 'bg-[#3155E7] text-white shadow-md text-white-force'
                        : isDark ? 'text-slate-200 hover:bg-[#101C3A]' : 'text-slate-800 hover:bg-[#F8FAFF]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{inst.name}</div>
                      <div className="text-[10px] opacity-75">{inst.city}, {inst.state}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 font-mono font-bold">
                      {inst.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          CENTER: Global Search Bar (Clean structural positioning, No overlaps)
          ===================================================================== */}
      <div className="flex-1 max-w-md mx-3 hidden md:block">
        <div
          onClick={openPalette}
          className="relative w-full cursor-pointer group"
          role="search"
          aria-label="Global search trigger"
        >
          {/* Search Icon strictly on LEFT: position: absolute; left: 16px; top: 50%; transform: translateY(-50%) */}
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            <Search className="w-4 h-4 text-[#3155E7] group-hover:scale-105 transition-transform" />
          </span>

          {/* Search Input Simulation with exact padding: padding-left: 44px; padding-right: 60px; */}
          <div
            style={{
              paddingLeft: '44px',
              paddingRight: '60px'
            }}
            className={`w-full h-9 rounded-xl border text-xs flex items-center transition select-none truncate ${
              isDark
                ? 'bg-[#060E22] border-[#1E3A6B] text-slate-300 group-hover:border-[#3155E7]'
                : 'bg-[#FFFFFF] border-[#D9E2F2] text-[#64748B] group-hover:border-[#3155E7]'
            }`}
          >
            <span className="hidden lg:inline truncate">Search students, companies, jobs...</span>
            <span className="inline lg:hidden truncate">Search students, companies...</span>
          </div>

          {/* Keyboard Shortcut strictly on RIGHT: position: absolute; right: 12px; top: 50%; transform: translateY(-50%) */}
          <span
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 2
            }}
          >
            <kbd
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono border font-medium ${
                isDark
                  ? 'bg-[#101C3A] border-[#1E3A6B] text-slate-300'
                  : 'bg-[#F8FAFF] border-[#D9E2F2] text-[#64748B]'
              }`}
            >
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </span>
        </div>
      </div>

      {/* =====================================================================
          RIGHT: Theme Toggle, Notifications, Profile (No large op buttons)
          ===================================================================== */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Search Button (Responsive Section 8) */}
        <button
          onClick={openPalette}
          aria-label="Open search"
          className={`md:hidden p-2 rounded-xl transition border cursor-pointer ${
            isDark
              ? 'bg-[#101C3A] hover:bg-[#15244A] border-[#1E3A6B] text-slate-200'
              : 'bg-[#F8FAFF] hover:bg-[#EFF6FF] border-[#D9E2F2] text-[#101A3A]'
          }`}
          title="Search"
        >
          <Search className="w-4 h-4 text-[#3155E7]" />
        </button>

        {/* Theme Toggle (Section 28: Clearly indicates active theme ☀ Light / 🌙 Dark) */}
        <button
          onClick={toggleTheme}
          aria-label={`Current theme is ${isDark ? 'dark' : 'light'}. Click to switch theme`}
          className={`px-2.5 py-1.5 rounded-xl transition border flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
            isDark
              ? 'bg-[#101C3A] hover:bg-[#15244A] border-[#1E3A6B] text-amber-300'
              : 'bg-[#F8FAFF] hover:bg-[#EFF6FF] border-[#D9E2F2] text-[#3155E7]'
          }`}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline text-xs font-semibold text-amber-200">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#3155E7]" />
              <span className="hidden sm:inline text-xs font-semibold text-[#101A3A]">Dark</span>
            </>
          )}
        </button>

        {/* Notifications Button & Dropdown Panel (Section 27) */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            aria-label="Notifications"
            className={`p-2 rounded-xl transition border relative cursor-pointer ${
              isDark
                ? 'bg-[#101C3A] hover:bg-[#15244A] border-[#1E3A6B] text-slate-200'
                : 'bg-[#F8FAFF] hover:bg-[#EFF6FF] border-[#D9E2F2] text-[#101A3A]'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#3155E7]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF476F] text-white text-[9px] font-bold flex items-center justify-center shadow-xs text-white-force">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifPanel && (
            <div
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl p-3 z-50 backdrop-blur-2xl shadow-2xl border animate-in fade-in zoom-in-95 ${
                isDark
                  ? 'bg-[#0B1530] border-[#1E3A6B] text-[#F8FAFC]'
                  : 'bg-white border-[#D9E2F2] text-[#101A3A]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D9E2F2] dark:border-[#1E3A6B]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#3155E7]" />
                  <span className="font-bold text-xs uppercase tracking-wider">Notifications & Alerts</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#3155E7] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#64748B]">
                    No notifications at this time
                  </div>
                ) : (
                  notifications.slice(0, 5).map(notif => {
                    const isRead = readNotifIds.has(notif.id);
                    return (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                          isRead
                            ? isDark ? 'bg-[#060E22]/60 border-[#1E3A6B]/50 opacity-75' : 'bg-[#F8FAFF] border-[#D9E2F2] opacity-75'
                            : isDark ? 'bg-[#101C3A] border-[#1E3A6B]' : 'bg-[#FFFFFF] border-[#D9E2F2] shadow-xs'
                        }`}
                        onClick={() => {
                          setReadNotifIds(prev => new Set([...prev, notif.id]));
                          onSelectScreen(21); // Screen 21: Notification Center
                          setShowNotifPanel(false);
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs leading-snug">{notif.title}</span>
                          {!isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#3155E7] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className={`text-[11px] mt-1 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                          {notif.content}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50 text-[10px] text-[#64748B]">
                          <span>{notif.channels.join(' · ')}</span>
                          <span className="font-mono">{new Date(notif.sentAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-[#D9E2F2] dark:border-[#1E3A6B] text-center">
                <button
                  onClick={() => {
                    onSelectScreen(21);
                    setShowNotifPanel(false);
                  }}
                  className="text-xs text-[#3155E7] font-bold hover:underline flex items-center justify-center gap-1 w-full py-1 cursor-pointer"
                >
                  <span>Open Full Notification Center</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TPO / Admin Profile & Identity Switcher */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            aria-label="User profile and role menu"
            className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border text-xs transition cursor-pointer ${
              isDark
                ? 'bg-[#101C3A] hover:bg-[#15244A] border-[#1E3A6B] text-[#F8FAFC]'
                : 'bg-[#FFFFFF] hover:bg-[#F8FAFF] border-[#D9E2F2] text-[#101A3A]'
            }`}
          >
            <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <button type="button" onClick={(e) => { e.stopPropagation(); avatarInput.current?.click(); }} className="w-7 h-7 rounded-lg overflow-hidden bg-[#3155E7] text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 text-white-force">
              {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
            </button>
            <div className="text-left hidden lg:block">
              <div className="font-bold text-[11px] leading-tight truncate max-w-[110px]">
                {currentUser.name}
              </div>
              <div className="text-[9px] font-mono font-bold text-[#3155E7] uppercase leading-none mt-0.5">
                {currentUser.role === 'SYSTEM_ADMIN' ? 'SYS ADMIN' : 'COLLEGE TPO'}
              </div>
            </div>
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#3155E7] ml-0.5 opacity-80 shrink-0" />
          </button>

          {/* Profile & Role Switcher Dropdown */}
          {showRoleMenu && (
            <div
              className={`absolute right-0 mt-2 w-72 rounded-2xl p-2 z-50 backdrop-blur-2xl shadow-2xl border animate-in fade-in zoom-in-95 ${
                isDark
                  ? 'bg-[#0B1530] border-[#1E3A6B] text-[#F8FAFC]'
                  : 'bg-white border-[#D9E2F2] text-[#101A3A]'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-[#3155E7] px-2 py-1">
                Switch Role / Identity
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleSwitchUser('user-tpo-apex')}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2.5 cursor-pointer transition ${
                    currentUser.id === 'user-tpo-apex'
                      ? 'bg-[#3155E7] text-white shadow-md text-white-force'
                      : isDark ? 'hover:bg-[#101C3A]' : 'hover:bg-[#F8FAFF]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center font-bold text-xs text-[#3155E7]">
                    MD
                  </div>
                  <div>
                    <div className="font-bold">Mrutyunjya Dash</div>
                    <div className="text-[10px] opacity-80">COLLEGE TPO • Apex Inst of Tech</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSwitchUser('user-tpo-metro')}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2.5 cursor-pointer transition ${
                    currentUser.id === 'user-tpo-metro'
                      ? 'bg-[#3155E7] text-white shadow-md text-white-force'
                      : isDark ? 'hover:bg-[#101C3A]' : 'hover:bg-[#F8FAFF]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center font-bold text-xs text-[#3155E7]">
                    SP
                  </div>
                  <div>
                    <div className="font-bold">Sisira Kanta Padhi</div>
                    <div className="text-[10px] opacity-80">COLLEGE TPO • Metro Univ BLR</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSwitchUser('user-sysadmin')}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2.5 cursor-pointer transition ${
                    currentUser.id === 'user-sysadmin'
                      ? 'bg-[#10B981] text-white shadow-md text-white-force'
                      : isDark ? 'hover:bg-[#101C3A]' : 'hover:bg-[#F8FAFF]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center font-bold text-xs text-[#10B981]">
                    RM
                  </div>
                  <div>
                    <div className="font-bold">Ronali Mohanty</div>
                    <div className="text-[10px] opacity-80">SYSTEM ADMIN • Multi-Tenant Global</div>
                  </div>
                </button>
              </div>

              <div className="border-t border-[#D9E2F2] dark:border-[#1E3A6B] mt-2 pt-2">
                <button
                  onClick={() => {
                    onSelectScreen(1);
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-center py-1 text-[11px] font-bold text-[#3155E7] hover:underline cursor-pointer"
                >
                  Go to Screen 1: Auth & Role Switcher
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
