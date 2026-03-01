// pages/TestCaseDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    Trash2,
    Save,
    FlaskConical,
    ShieldCheck,
    FileText,
    User,
    Calendar,
    AlertOctagon,
    CheckCircle2,
    XCircle,
    Clock,
    Ban
} from "lucide-react";
import { testCaseService } from "../api/testCaseService";
import { evidenceService } from "../api/evidenceService";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000";

// ─── Evidence Thumbnail Component ─────────────────────────────────────────────
const EvidenceThumbnail = ({ item, onDelete }) => (
    <div className="relative group w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <img
            src={item.fileUrl && item.fileUrl[0]}
            alt="Evidence"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
                onClick={() => onDelete(item._id)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors"
                title="Delete Evidence"
            >
                <Trash2 size={16} />
            </button>
            <a
                href={item.fileUrl && item.fileUrl[0]}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-emerald-500 transition-colors"
                title="View Full Size"
            >
                <Upload size={16} className="rotate-180" />
            </a>
        </div>
    </div>
);

// ─── Status Toggle Component ───────────────────────────────────────────────────
const Switch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
        <div className="space-y-0.5">
            <p className="text-sm font-bold text-gray-900">{label}</p>
            {description && <p className="text-[10px] text-gray-400 font-medium leading-tight">{description}</p>}
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? "bg-emerald-500" : "bg-gray-200"
                }`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? "translate-x-5" : "translate-x-0"
                    }`}
            />
        </button>
    </div>
);

// ─── Execution Status Toggle ──────────────────────────────────────────────────
const ExecutionToggle = ({ status, onChange }) => {
    const options = [
        { value: 'passed', label: 'Pass', color: 'emerald', icon: CheckCircle2 },
        { value: 'failed', label: 'Fail', color: 'red', icon: XCircle },
        { value: 'blocked', label: 'Blocked', color: 'amber', icon: Ban },
        { value: 'notRun', label: 'Not Run', color: 'gray', icon: Clock },
    ];

    return (
        <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => {
                const isActive = status === opt.value;
                const colorClass = {
                    emerald: isActive ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-emerald-50 hover:text-emerald-500',
                    red: isActive ? 'bg-red-500 text-white border-red-500' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-red-50 hover:text-red-500',
                    amber: isActive ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-amber-50 hover:text-amber-500',
                    gray: isActive ? 'bg-gray-600 text-white border-gray-600' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-600',
                }[opt.color];

                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all ${colorClass}`}
                    >
                        <opt.icon size={14} />
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
};

export const TestCaseDetail = () => {
    const { projectId, featureId, testCaseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [testCase, setTestCase] = useState(null);
    const [evidences, setEvidences] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        status: "notRun",
        severity: "medium",
        preconditions: "",
        steps: [""],
        expectedResult: "",
        actualResult: "",
        assignedTo: "",
        isActive: true
    });

    useEffect(() => {
        const fetchEverything = async () => {
            try {
                setLoading(true);
                const [tcRes, evRes] = await Promise.all([
                    testCaseService.getTestCaseById(testCaseId),
                    evidenceService.getEvidenceByTestCaseId(testCaseId)
                ]);

                if (tcRes.success) {
                    const tc = tcRes.data;
                    setTestCase(tc);
                    setFormData({
                        title: tc.title || "",
                        description: tc.description || "",
                        priority: tc.priority || "medium",
                        status: tc.status || "notRun",
                        severity: tc.severity || "medium",
                        preconditions: tc.preconditions || "",
                        steps: tc.steps && tc.steps.length > 0 ? tc.steps : [""],
                        expectedResult: tc.expectedResult || "",
                        actualResult: tc.actualResult || "",
                        assignedTo: tc.assignedTo?._id || "",
                        isActive: true
                    });
                }

                if (evRes.success) {
                    setEvidences(evRes.data);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Failed to load scenario details");
            } finally {
                setLoading(false);
            }
        };
        fetchEverything();
    }, [testCaseId]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const res = await evidenceService.uploadEvidence(testCaseId, file);
            if (res.success) {
                toast.success("Evidence uploaded");
                setEvidences(prev => [res.data, ...prev]);
            }
        } catch (error) {
            toast.error(error.message || "Upload failed");
        } finally {
            setIsUploading(false);
            e.target.value = null; // reset input
        }
    };

    const handleDeleteEvidence = async (evId) => {
        if (!window.confirm("Delete this evidence?")) return;
        try {
            const res = await evidenceService.deleteEvidence(evId);
            if (res.success) {
                toast.success("Evidence removed");
                setEvidences(prev => prev.filter(item => item._id !== evId));
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleInputChange = (field, val) => {
        setFormData(prev => ({ ...prev, [field]: val }));
    };

    const handleStepChange = (index, val) => {
        const newSteps = [...formData.steps];
        newSteps[index] = val;
        handleInputChange('steps', newSteps);
    };

    const addStep = () => handleInputChange('steps', [...formData.steps, ""]);
    const removeStep = (index) => {
        const newSteps = formData.steps.filter((_, i) => i !== index);
        handleInputChange('steps', newSteps.length ? newSteps : [""]);
    };

    const handleUpdate = async () => {
        try {
            setIsUpdating(true);
            const res = await testCaseService.updateTestCase(testCaseId, formData);
            if (res.success) {
                toast.success("Scenario updated successfully");
            }
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Confirm deletion of this test scenario?")) return;
        try {
            const res = await testCaseService.deleteTestCase(testCaseId);
            if (res.success) {
                toast.success("Scenario deleted");
                navigate(-1);
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* Hidden File Input */}
            <input
                type="file"
                id="evidence-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
            />

            {/* Header breadcrumbs */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black text-gray-900">Scenario Configuration</h1>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span>Dashboard</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{testCase?.featureId?.projectId?.name || "Project"}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-emerald-500 underline underline-offset-4 decoration-2">Scenario Details</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Section: Image/Status Toggles */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-8 flex flex-col items-center gap-8">

                        {/* Evidence Upload Trigger */}
                        <div
                            onClick={() => document.getElementById('evidence-upload').click()}
                            className="w-full aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all overflow-hidden relative"
                        >
                            {isUploading && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                                    <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
                                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Uploading...</p>
                                </div>
                            )}

                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                                <Upload size={24} />
                            </div>
                            <div className="text-center px-6">
                                <p className="text-sm font-bold text-gray-900">Reference Evidence</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">allowed .jpg, .png, .gif (max 10mb)</p>
                            </div>
                        </div>

                        {/* Evidence Gallery */}
                        {evidences.length > 0 && (
                            <div className="w-full space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Evidence Gallery ({evidences.length})</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {evidences.map((ev) => (
                                        <EvidenceThumbnail
                                            key={ev._id}
                                            item={ev}
                                            onDelete={handleDeleteEvidence}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="w-full space-y-4">
                            <Switch
                                enabled={formData.isActive}
                                onChange={(val) => handleInputChange('isActive', val)}
                                label="Case Active"
                                description="Disabling this will bypass the scenario in automated syncs"
                            />

                            <div className="space-y-3 pt-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Execution Status</label>
                                <ExecutionToggle
                                    status={formData.status}
                                    onChange={(val) => handleInputChange('status', val)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Form Fields */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* Field: Title */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Scenario Title</label>
                            <div className="relative group">
                                <FlaskConical className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-transparent rounded-[1.25rem] text-sm font-bold focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50/50 outline-none transition-all"
                                    placeholder="Scenario title..."
                                />
                            </div>
                        </div>

                        {/* Read-only: Feature & Project */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Feature Scope</label>
                            <div className="px-6 py-4 bg-gray-50 rounded-[1.25rem] text-sm font-bold text-gray-400 flex items-center gap-3">
                                <ShieldCheck size={18} className="opacity-40" />
                                {testCase?.featureId?.name || "N/A"}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Project Context</label>
                            <div className="px-6 py-4 bg-gray-50 rounded-[1.25rem] text-sm font-bold text-gray-400 flex items-center gap-3">
                                <FileText size={18} className="opacity-40" />
                                {testCase?.featureId?.projectId?.name || "N/A"}
                            </div>
                        </div>

                        {/* Selects: Priority & Severity */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Test Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.25rem] text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none appearance-none cursor-pointer"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                                <option value="critical">Critical Path</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Test Severity</label>
                            <select
                                value={formData.severity}
                                onChange={(e) => handleInputChange('severity', e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-[1.25rem] text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none appearance-none cursor-pointer"
                            >
                                <option value="low">Low Severity</option>
                                <option value="medium">Medium Severity</option>
                                <option value="high">High Severity</option>
                                <option value="critical">Critical Severity</option>
                            </select>
                        </div>

                        {/* Textarea: Preconditions */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Prerequisites & Environment</label>
                            <textarea
                                value={formData.preconditions}
                                onChange={(e) => handleInputChange('preconditions', e.target.value)}
                                rows={3}
                                className="w-full px-6 py-4 bg-gray-50/50 border border-transparent rounded-[1.25rem] text-sm font-bold focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 outline-none transition-all resize-none"
                                placeholder="Database state, login status, or specific data setup required..."
                            />
                        </div>

                        {/* Step list */}
                        <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-50 mt-4">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Execution Protocol</label>
                                <button onClick={addStep} className="text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 underline underline-offset-4 tracking-tighter">Extend Steps</button>
                            </div>
                            <div className="space-y-3">
                                {formData.steps?.map((step, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="w-12 h-12 shrink-0 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-[11px] font-black text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <input
                                            type="text"
                                            value={step}
                                            onChange={(e) => handleStepChange(idx, e.target.value)}
                                            className="flex-1 px-6 bg-gray-50/50 border border-transparent rounded-2xl text-[13px] font-bold focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                                            placeholder={`Test step phase ${idx + 1}...`}
                                        />
                                        {formData.steps?.length > 1 && (
                                            <button onClick={() => removeStep(idx)} className="p-3 text-red-200 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Results sections */}
                        <div className="space-y-2 pt-4">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Expected Outcome</label>
                            <textarea
                                value={formData.expectedResult}
                                onChange={(e) => handleInputChange('expectedResult', e.target.value)}
                                rows={4}
                                className="w-full px-6 py-4 bg-emerald-50/30 border border-transparent rounded-[1.25rem] text-sm font-bold text-emerald-900 focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 outline-none transition-all resize-none italic"
                                placeholder="The ideal success criteria..."
                            />
                        </div>

                        <div className="space-y-2 pt-4">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Actual Observation</label>
                            <textarea
                                value={formData.actualResult}
                                onChange={(e) => handleInputChange('actualResult', e.target.value)}
                                rows={4}
                                className="w-full px-6 py-4 bg-gray-50/50 border border-transparent rounded-[1.25rem] text-sm font-bold focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-50 outline-none transition-all resize-none"
                                placeholder="Observations from the latest execution..."
                            />
                        </div>

                        {/* Footer Metadata Fields */}
                        <div className="space-y-2 pt-6 border-t border-gray-50 mt-6">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Assigned Ownership</label>
                            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-[1.25rem]">
                                <User size={18} className="text-gray-300" />
                                <span className="text-sm font-bold text-gray-900">{testCase?.assignedTo?.name || "Unassigned"}</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-6 border-t border-gray-50 mt-6">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Created By</label>
                            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-[1.25rem]">
                                <User size={18} className="text-gray-300" />
                                <span className="text-sm font-bold text-gray-900">{testCase?.createdBy?.name || "N/A"}</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-6 border-t border-gray-50 mt-6 lg:border-l lg:border-t-0 lg:pl-8">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Date Created</label>
                            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-[1.25rem]">
                                <Calendar size={18} className="text-gray-300" />
                                <span className="text-sm font-bold text-gray-900">{testCase?.createdAt ? new Date(testCase.createdAt).toLocaleDateString() : "N/A"}</span>
                            </div>
                        </div>

                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-4 mt-12 pt-8 border-t-2 border-dashed border-gray-50">
                        <button
                            onClick={handleDelete}
                            className="px-8 py-4 rounded-2xl bg-red-50 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Remove Case
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className="px-12 py-4 rounded-2xl bg-emerald-900 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:bg-emerald-950 transition-all active:scale-95 flex items-center gap-3"
                        >
                            {isUpdating ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Sync Scenario
                        </button>
                    </div>
                </div>

            </div>

            <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        ::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
        </div>
    );
};
