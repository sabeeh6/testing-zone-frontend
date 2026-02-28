// pages/Features.jsx

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureCardGrid } from "../components/Card";
import { featureService } from "../api/featureService";
import toast from "react-hot-toast";
import { X, AlertTriangle, Loader2 } from "lucide-react";

// ─── Feature Modal: Create & Edit ───────────────────────────────────────────────
function FeatureModal({ feature, onClose, onSave, isSaving }) {
  const [formData, setFormData] = useState(
    feature || {
      name: "",
      description: "",
      status: "pending",
      type: "feature",
      priority: "medium",
    }
  );

  const isEdit = !!feature?._id;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Feature" : "Add New Feature"}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{isEdit ? "Update existing feature details" : "Create a new requirement for this project"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            {/* Feature Name */}
            <div>
              <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 block mb-1.5 ml-1">Feature Name</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Implement OAuth Login"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 block mb-1.5 ml-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe the feature requirements..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 block mb-1.5 ml-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-400 transition-all font-medium appearance-none cursor-pointer"
                >
                  {['feature', 'bug', 'improvement', 'task', 'research'].map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 block mb-1.5 ml-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-emerald-400 transition-all font-medium appearance-none cursor-pointer"
                >
                  {['low', 'medium', 'high'].map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 block mb-1.5 ml-1">Status</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['pending', 'inReview', 'active', 'completed', 'blocked'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${formData.status === s
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                      }`}
                  >
                    {s === 'inReview' ? 'In Review' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Update Feature" : "Create Feature"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Delete Confirmation Modal ──────────────────────────────────────────────────
function DeleteConfirmModal({ feature, onClose, onConfirm, isDeleting }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100 shadow-inner">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Feature?</h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed px-2">
          Are you sure you want to delete <span className="font-bold text-gray-800">"{feature.name}"</span>? This action will permanently remove it and all associated test cases.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(feature._id)}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            Delete Permanently
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN FEATURES PAGE ─────────────────────────────────────────────────────────
export const Features = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [deleteFeature, setDeleteFeature] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get project data from navigation state
  const projectId = location.state?.projectId;
  const projectName = location.state?.projectName || "Unknown Project";

  // Card Internal Enum Mapping (Backend -> UI)
  const mapBackendToCard = (f) => ({
    id: f._id,
    featureName: f.name,
    projectName: projectName,
    description: f.description,
    type: f.type, // Assuming FE and BE match or user handles it
    priority: f.priority,
    status: f.status === 'inReview' ? 'in_review' : f.status // Card expects in_review
  });

  const fetchFeatures = async () => {
    if (!projectId) {
      toast.error("No project selected! Wapis jaien");
      navigate("/dashboard");
      return;
    }

    try {
      setLoading(true);
      const response = await featureService.getFeaturesByProjectId(projectId);
      if (response.success) {
        const mappedData = response.data.Features.map(mapBackendToCard);
        setFeatures(mappedData);
        // Only toast if explicitly triggered, or use silent loading
      }
    } catch (error) {
      toast.error(error.message || "Failed to load features");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [projectId]);

  const handleSaveFeature = async (formData) => {
    try {
      setIsProcessing(true);
      const payload = { ...formData, projectId };

      let response;
      if (formData._id) {
        response = await featureService.updateFeature(formData._id, payload);
      } else {
        response = await featureService.createFeature(payload);
      }

      if (response.success) {
        toast.success(response.message || "Saved successfully");
        setShowModal(false);
        setSelectedFeature(null);
        fetchFeatures(); // Refresh list
      }
    } catch (error) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteFeature = async (id) => {
    try {
      setIsProcessing(true);
      const response = await featureService.deleteFeature(id);
      if (response.success) {
        toast.success(response.message || "Feature deleted");
        setDeleteFeature(null);
        fetchFeatures(); // Refresh list
      }
    } catch (error) {
      toast.error(error.message || "Delete failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-8 py-6 min-h-screen bg-gray-50/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Project Features</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span onClick={() => navigate("/dashboard")} className="hover:text-emerald-600 cursor-pointer transition-colors">Dashboard</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold">{projectName}</span>
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setSelectedFeature(null); setShowModal(true); }}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-black transition shadow-xl shadow-gray-200 flex items-center gap-2 border border-gray-800"
        >
          <span className="text-lg">+</span> Add New Feature
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-gray-400"
            >
              <Loader2 size={40} className="animate-spin text-emerald-500 mb-4 opacity-75" />
              <p className="text-sm font-bold tracking-wide uppercase opacity-60">Synchronizing Data...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <FeatureCardGrid
                features={features}
                onEdit={(id) => {
                  const feat = features.find(f => f.id === id);
                  // Find raw object for form (with _id)
                  featureService.getFeaturesByProjectId(projectId).then(res => {
                    const raw = res.data.Features.find(f => f._id === id);
                    setSelectedFeature(raw);
                    setShowModal(true);
                  });
                }}
                onDelete={(id) => {
                  const raw = features.find(f => f.id === id);
                  setDeleteFeature({ _id: id, name: raw.featureName });
                }}
                onCardClick={(id) => navigate(`/features/${id}`)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <FeatureModal
            key="feature-modal"
            feature={selectedFeature}
            isSaving={isProcessing}
            onClose={() => { setShowModal(false); setSelectedFeature(null); }}
            onSave={handleSaveFeature}
          />
        )}

        {deleteFeature && (
          <DeleteConfirmModal
            key="delete-modal"
            feature={deleteFeature}
            isDeleting={isProcessing}
            onClose={() => setDeleteFeature(null)}
            onConfirm={handleDeleteFeature}
          />
        )}
      </AnimatePresence>
    </div>
  );
};