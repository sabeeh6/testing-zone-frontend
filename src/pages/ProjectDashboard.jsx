import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FolderKanban,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react";
import ProjectsTable, { StatusBadge } from "../components/ProjectTable";
import { projectService } from "../api/projectService";

// ─── Project Modal (Create/Edit) ────────────────────────────────────────────────
function ProjectModal({ project, onClose, onSave }) {
  const [formData, setFormData] = useState(
    project || {
      name: "",
      description: "",
      developers: "",
      testers: "",
      status: "pending",
    }
  );

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        developers: Array.isArray(project.developers) ? project.developers.join(", ") : project.developers,
        testers: Array.isArray(project.testers) ? project.testers.join(", ") : project.testers,
      });
    }
  }, [project]);

  const isEdit = !!project?._id || !!project?.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      developers: typeof formData.developers === 'string' ? formData.developers.split(",").map(s => s.trim()).filter(Boolean) : formData.developers,
      testers: typeof formData.testers === 'string' ? formData.testers.split(",").map(s => s.trim()).filter(Boolean) : formData.testers,
    };
    onSave(dataToSend);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Edit Project" : "Create Project"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Project Name</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Developers (comma separated)</label>
              <input
                value={formData.developers}
                onChange={(e) => setFormData({ ...formData, developers: e.target.value })}
                placeholder="Alice, Bob"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Testers (comma separated)</label>
              <input
                value={formData.testers}
                onChange={(e) => setFormData({ ...formData, testers: e.target.value })}
                placeholder="Diana, Evan"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white"
            >
              {["Pending", "Active", "In Review", "Blocked", "Completed"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-medium text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-gray-900 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
              {isEdit ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ project, onClose, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Project</h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-800">"{project.name}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-medium text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onDelete(project._id || project.id)} className="flex-1 bg-red-500 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── View Drawer (Right Sidebar) ────────────────────────────────────────────────
function ViewDrawer({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex"
    >
      <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Project Details</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-5 overflow-y-auto flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-lg font-bold shadow">
              {project.name?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{project.name}</p>
              <p className="text-xs text-gray-400">ID #{String(project._id || project.id).slice(-4)}</p>
            </div>
          </div>

          <StatusBadge status={project.status} />

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Developers</p>
            <div className="flex flex-wrap gap-2">
              {project.developers?.map((d, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {typeof d === 'string' ? d : d.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Testers</p>
            <div className="flex flex-wrap gap-2">
              {project.testers?.map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {typeof t === 'string' ? t : t.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);

  const fetchProjects = async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      const response = await projectService.getAllProjects();
      if (response.success) {
        setProjects(response.data);
        if (isManual) toast.success(response.message || "Projects fetched successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(true);
  }, []);

  const handleSaveProject = async (data) => {
    try {
      let response;
      if (data._id) {
        response = await projectService.updateProject(data);
      } else {
        response = await projectService.createProject(data);
      }

      if (response.success) {
        toast.success(response.message || "Project saved successfully");
        setShowCreateModal(false);
        setEditProject(null);
        fetchProjects();
      }
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const response = await projectService.deleteProject(id);
      if (response.success) {
        toast.success(response.message || "Project deleted");
        setDeleteProject(null);
        fetchProjects();
      }
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderKanban, color: "bg-gray-900", textColor: "text-white", sub: "All time" },
    { label: "Active", value: projects.filter(p => p.status === 'Active').length, icon: TrendingUp, color: "bg-emerald-500", textColor: "text-white", sub: "Currently running" },
    { label: "In Review", value: projects.filter(p => p.status === 'In Review').length, icon: Clock, color: "bg-amber-400", textColor: "text-white", sub: "Awaiting feedback" },
    { label: "Completed", value: projects.filter(p => p.status === 'Completed').length, icon: CheckCircle2, color: "bg-violet-500", textColor: "text-white", sub: "Finalized" },
    { label: "Blocked", value: projects.filter(p => p.status === 'Blocked').length, icon: AlertTriangle, color: "bg-red-500", textColor: "text-white", sub: "Needs action" },
  ];

  return (
    <div className="px-8 py-6">
      <div className="grid grid-cols-5 gap-4 mb-7">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
              <s.icon size={16} className={s.textColor} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
        <ProjectsTable
          projects={projects}
          onEdit={(p) => setEditProject(p)}
          onDelete={(p) => setDeleteProject(p)}
          onView={(p) => setViewProject(p)}
          onAddProject={() => setShowCreateModal(true)}
          loading={loading}
        />
      </motion.div>

      <AnimatePresence>
        {(showCreateModal || editProject) && (
          <ProjectModal
            key="modal"
            project={editProject}
            onClose={() => { setShowCreateModal(false); setEditProject(null); }}
            onSave={handleSaveProject}
          />
        )}
        {deleteProject && (
          <DeleteModal
            key="delete"
            project={deleteProject}
            onClose={() => setDeleteProject(null)}
            onDelete={handleDeleteProject}
          />
        )}
        {viewProject && (
          <ViewDrawer
            key="view"
            project={viewProject}
            onClose={() => setViewProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}