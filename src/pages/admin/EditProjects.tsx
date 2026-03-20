import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Save, Loader2, Plus, Trash2, ExternalLink, Github, Star, Edit2, X } from "lucide-react";
import { apiGetProjects, apiUpdateProject, apiDeleteProject, apiCreateProject } from "../../utils/api.ts";
import { useAdminAuth } from "../../hooks/useAdminAuth.ts";
import ImageUpload from "../../components/admin/ImageUpload.tsx";

const EditProjects = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await apiGetProjects();
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, navigate]);

  const handleOpenModal = (project: any = null) => {
    if (project) {
      setEditingProject({ ...project });
    } else {
      setEditingProject({
        title: "",
        description: "",
        image: "",
        githubLink: "",
        liveLink: "",
        tags: "",
        featured: false,
        order: projects.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveProject = async () => {
    setSaving(true);
    try {
      if (editingProject._id) {
        await apiUpdateProject(editingProject._id, editingProject);
        setProjects(prev => prev.map(p => p._id === editingProject._id ? editingProject : p));
      } else {
        const response = await apiCreateProject(editingProject);
        setProjects(prev => [...prev, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await apiDeleteProject(id);
      setProjects((prev) => prev.filter((project) => project._id !== id));
      alert("Project deleted successfully.");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="text-fuchsia-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-bold text-white">Manage Projects</h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Add New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              layout
              key={project._id}
              className="glass rounded-2xl border border-white/10 overflow-hidden flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden bg-white/5">
                <img
                  src={project.image || "https://picsum.photos/seed/project/800/450"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.featured && (
                  <div className="absolute top-4 right-4 p-2 bg-fuchsia-600 rounded-lg text-white shadow-lg">
                    <Star size={16} fill="white" />
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(typeof project.tags === 'string' ? project.tags.split(',') : project.tags).map((tag: string, i: number) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-fuchsia-400 bg-fuchsia-400/10 px-2 py-1 rounded-md">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-fuchsia-400 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex gap-3">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                        <Github size={18} />
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingProject?._id ? "Edit Project" : "Add New Project"}
                </h2>
                <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Project Title</label>
                  <input
                    type="text"
                    value={editingProject?.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={editingProject?.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors resize-none"
                  />
                </div>
                <ImageUpload
                  label="Project Image"
                  currentImage={editingProject?.image}
                  onUploadSuccess={(url) => setEditingProject({ ...editingProject, image: url })}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">GitHub Link</label>
                    <input
                      type="text"
                      value={editingProject?.githubLink || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, githubLink: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Live Demo Link</label>
                    <input
                      type="text"
                      value={editingProject?.liveLink || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, liveLink: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editingProject?.tags || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                    placeholder="React, Three.js, Tailwind"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                      editingProject?.featured ? "bg-fuchsia-600 border-fuchsia-600" : "border-white/10 bg-white/5 group-hover:border-fuchsia-500/50"
                    }`}>
                      {editingProject?.featured && <Star size={14} fill="white" className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={editingProject?.featured || false}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-slate-300">Featured Project</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-slate-950/50 flex justify-end gap-4">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProjects;
