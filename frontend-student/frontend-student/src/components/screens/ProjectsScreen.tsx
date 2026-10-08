import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Project } from '../../types/student';
import {
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const ProjectsScreen: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveDemoUrl: '',
    highlightMetric: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await api.getProjects();
      setProjects(res);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    try {
      const res = await api.addProject({
        title: newProject.title,
        description: newProject.description,
        tech_stack: newProject.techStack.split(',').map((x) => x.trim()),
        github_url: newProject.githubUrl,
        live_demo_url: newProject.liveDemoUrl,
        highlight_metric: newProject.highlightMetric,
      });
      setProjects([...projects, res.project]);
      setShowAddForm(false);
      setNewProject({ title: '', description: '', techStack: '', githubUrl: '', liveDemoUrl: '', highlightMetric: '' });
      setMessage('Project added successfully! Project Factor has been updated.');
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      setMessage('Project deleted.');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 dark:text-slate-400 p-8 text-center">Loading project portfolio...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Project Portfolio & Production Proof of Work</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Production projects demonstrating quantifiable throughput, latency metrics, and architecture.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Add New Project'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Add Project Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6 shadow-2xl space-y-4 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">New Production Project</div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Event-Driven Message Broker"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tech Stack (comma-separated)</label>
            <input
              type="text"
              required
              placeholder="e.g. Node.js, Redis, Docker, PostgreSQL, AWS"
              value={newProject.techStack}
              onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Architecture Description</label>
            <textarea
              rows={3}
              required
              placeholder="Describe system design, concurrency handling, and trade-offs..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white resize-none focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Highlight Metric</label>
              <input
                type="text"
                placeholder="e.g. 12,000 req/sec (<45ms p99)"
                value={newProject.highlightMetric}
                onChange={(e) => setNewProject({ ...newProject, highlightMetric: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">GitHub Repo URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={newProject.githubUrl}
                onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Live Demo / URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={newProject.liveDemoUrl}
                onChange={(e) => setNewProject({ ...newProject, liveDemoUrl: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-blue-200/90 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 cursor-pointer"
            >
              Save Project & Recalculate Score
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-white/85 dark:bg-[#070e22]/75 border border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all shadow-xl space-y-3 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.title}</h3>
                {p.highlight_metric && (
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                    <Zap className="w-3 h-3" />
                    <span>{p.highlight_metric}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{p.description}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {(p.tech_stack || []).map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-slate-950 border border-blue-200/80 dark:border-slate-800 text-blue-700 dark:text-indigo-300 font-mono text-[10px] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-blue-100 dark:border-slate-800/80 flex items-center gap-4 text-xs">
              {p.github_url && (
                <a
                  href={p.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-blue-700 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 font-medium"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              )}
              {p.live_demo_url && (
                <a
                  href={p.live_demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1.5 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Production Demo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
