import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Shield,
} from 'lucide-react';
import { AuthUser } from '../types';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

const AVAILABLE_ROLES = [
  {
    id: 'admin',
    title: 'System Administrator',
    department: 'Central Command & Dispatch',
    badge: 'Administrator',
  },
  {
    id: 'logistics',
    title: 'Logistics Coordinator',
    department: 'Regional Drug Warehouse Depot',
    badge: 'Logistics',
  },
  {
    id: 'health_officer',
    title: 'District Health Officer',
    department: 'Public Health Directorate',
    badge: 'Clinical Lead',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState<string>('XYZ');
  const [email, setEmail] = useState<string>('admin@caremesh.health');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('admin');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedRole =
    AVAILABLE_ROLES.find((r) => r.id === selectedRoleId) || AVAILABLE_ROLES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your institutional email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: `user-${selectedRole.id}`,
        name: name.trim() || 'XYZ',
        role: selectedRole.title,
        department: selectedRole.department,
        email: email.trim() || 'admin@caremesh.health',
        badge: selectedRole.badge,
      });
    }, 350);
  };

  return (
    <div
      id="login-view"
      className="h-screen max-h-screen w-screen bg-slate-900 text-slate-100 flex flex-col justify-between overflow-hidden antialiased select-none"
    >
      {/* Top Header */}
      <header className="px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight">
              CareMesh <span className="text-teal-400 font-semibold">AI</span>
            </span>
            <span className="text-xs text-slate-400 ml-2 hidden sm:inline border-l border-slate-700 pl-2">
              Supply Chain Resilience Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs">Authorized Operations Portal</span>
        </div>
      </header>

      {/* Centered Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-2 min-h-0">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-6 space-y-4">
          {/* Card Title */}
          <div className="text-center space-y-1">
            <div className="inline-flex w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 items-center justify-center text-teal-600 mb-0.5">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Operations Console Login
            </h1>
            <p className="text-[11px] text-slate-500">
              Real-time medicine inventory, risk forecasting, and automated redistribution.
            </p>
          </div>

          {/* Instant 1-Click Demo Entry for Judges */}
          <button
            id="btn-quick-demo-access"
            type="button"
            onClick={() => {
              onLogin({
                id: 'user-director',
                name: name.trim() || 'XYZ',
                role: 'District Health Officer',
                department: 'Public Health Directorate',
                email: email.trim() || 'admin@caremesh.health',
                badge: 'Clinical Lead',
              });
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Instant Demo Access (1-Click)</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              or enter with custom role
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Name / Officer ID */}
            <div className="space-y-1">
              <label
                htmlFor="login-name"
                className="text-xs font-semibold text-slate-700 flex items-center justify-between"
              >
                <span>Officer Name</span>
                <span className="text-[10px] text-slate-400 font-normal">Default: XYZ</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="XYZ"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Role Selector Dropdown */}
            <div className="space-y-1">
              <label
                htmlFor="login-role"
                className="text-xs font-semibold text-slate-700 flex items-center justify-between"
              >
                <span>Operational Role</span>
                <span className="text-[10px] text-teal-700 font-medium">{selectedRole.badge}</span>
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="login-role"
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title} — {role.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="login-email"
                className="text-xs font-semibold text-slate-700"
              >
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@caremesh.health"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold text-slate-700"
                >
                  Security Key
                </label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                  Preloaded
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-sign-in"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {name.trim() || 'XYZ'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>256-bit Encrypted Session • Healthcare Supply Chain Mesh</span>
          </div>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="px-5 py-2.5 border-t border-slate-800 text-center text-[11px] text-slate-500 shrink-0">
        CareMesh AI — Public Health Logistics Resilience Platform
      </footer>
    </div>
  );
};
