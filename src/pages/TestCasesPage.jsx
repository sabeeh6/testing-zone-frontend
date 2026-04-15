// pages/TestCasesPage.jsx

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    ArrowLeft,
    MoreVertical,
    Pencil,
    Trash2,
    FlaskConical,
    ChevronDown,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    Ban,
    AlertCircle,
    RotateCcw,
    ChevronRight,
    UserCircle2
} from "lucide-react";
import { testCaseService } from "../api/testCaseService";
import { featureService } from "../api/featureService";
import toast from "react-hot-toast";

// ─── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    passed: { label: 'Passed', color: '#10b981', bg: '#f0fdf8', icon: CheckCircle2 },
    failed: { label: 'Failed', color: '#ef4444', bg: '#fef2f2', icon: XCircle },
    blocked: { label: 'Blocked', color: '#f59e0b', bg: '#fffbeb', icon: Ban },
    notRun: { label: 'Not Run', color: '#6b7280', bg: '#f9fafb', icon: Clock },
};

export const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.notRun;
    const Icon = cfg.icon;
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
            style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: `${cfg.color}20` }}
        >
            <Icon size={12} />
            {cfg.label}
        </span>
    );
};

// ─── Priority Tag ──────────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
    high: { label: 'High', color: '#ef4444', bg: '#fef2f2' },
    medium: { label: 'Medium', color: '#f59e0b', bg: '#fffbeb' },
    low: { label: 'Low', color: '#10b981', bg: '#f0fdf8' },
};

export const PriorityTag = ({ priority }) => {
    const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
    return (
        <span
            className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide border"
            style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: `${cfg.color}15` }}
        >
            {cfg.label}
        </span>
    );
};

export const TestCasesPage = () => {
    const { id } = useParams(); // featureId
    const navigate = useNavigate();
    const [feature, setFeature] = useState(null);
    const [testCases, setTestCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestCase, setEditingTestCase] = useState(null);
    const [isAgainTest, setIsAgainTest] = useState(false);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [executionsMap, setExecutionsMap] = useState({});
    const [fetchingExecutions, setFetchingExecutions] = useState({});

    // Modal State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        status: "notRun",
        expectedResult: "",
        steps: [""]
    });

    const fetchFeatureAndTestCases = async () => {
        try {
            setLoading(true);
            const [fRes, tRes] = await Promise.all([
                featureService.getFeatureById(id),
                testCaseService.getTestCasesByFeatureId(id)
            ]);

            if (fRes.success) setFeature(fRes.data);
            if (tRes.success) setTestCases(tRes.data.testCases);
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatureAndTestCases();
    }, [id]);

    const filteredData = useMemo(() => {
        return testCases.filter(t =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [testCases, searchQuery]);

    const handleOpenModal = (tc = null, isAgain = false) => {
        setIsAgainTest(isAgain);
        if (tc) {
            setEditingTestCase(tc);
            setFormData({
                title: tc.title,
                description: tc.description || "",
                priority: tc.priority,
                status: isAgain ? "passed" : tc.status,
                expectedResult: tc.expectedResult || "",
                steps: tc.steps.length > 0 ? tc.steps : [""]
            });
        } else {
            setEditingTestCase(null);
            setIsAgainTest(false);
            setFormData({
                title: "",
                description: "",
                priority: "medium",
                status: "notRun",
                expectedResult: "",
                steps: [""]
            });
        }
        setIsModalOpen(true);
    };

    const toggleRow = async (tcId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(tcId)) {
            newExpanded.delete(tcId);
        } else {
            newExpanded.add(tcId);
            // Fetch executions if not already present
            if (!executionsMap[tcId]) {
                try {
                    setFetchingExecutions(prev => ({ ...prev, [tcId]: true }));
                    const res = await testCaseService.getExecutions(tcId);
                    if (res.success) {
                        setExecutionsMap(prev => ({ ...prev, [tcId]: res.data }));
                    }
                } catch (err) {
                    console.error("Failed to fetch executions:", err);
                } finally {
                    setFetchingExecutions(prev => ({ ...prev, [tcId]: false }));
                }
            }
        }
        setExpandedRows(newExpanded);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, featureId: id };
            let res;
            if (isAgainTest) {
                // Remove readonly fields from payload if backend doesn't want them or just send status/result
                res = await testCaseService.againTest(editingTestCase._id, {
                    status: formData.status,
                    actualResult: formData.actualResult || "" // Assuming we add this or just use status
                });
            } else if (editingTestCase) {
                res = await testCaseService.updateTestCase(editingTestCase._id, payload);
            } else {
                res = await testCaseService.createTestCase(payload);
            }

            if (res.success) {
                toast.success(isAgainTest ? "Execution recorded" : editingTestCase ? "Test case updated" : "Test case created");
                setIsModalOpen(false);
                fetchFeatureAndTestCases();
                // Clear executions cache if it was an "again test" to force refresh
                if (isAgainTest) {
                    setExecutionsMap(prev => {
                        const next = { ...prev };
                        delete next[editingTestCase._id];
                        return next;
                    });
                }
            }
        } catch (error) {
            toast.error(error.message || "Operation failed");
        }
    };

    const handleDelete = async (tcId) => {
        if (!window.confirm("Are you sure you want to delete this test case?")) return;
        try {
            const res = await testCaseService.deleteTestCase(tcId);
            if (res.success) {
                toast.success("Test case deleted");
                fetchFeatureAndTestCases();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleDeleteExecution = async (e, tcId, execId) => {
        e.stopPropagation(); // Don't trigger navigation
        if (!window.confirm("Delete this execution record?")) return;
        try {
            const res = await testCaseService.deleteExecution(execId);
            if (res.success) {
                toast.success("Execution deleted");
                // Refresh history list
                setExecutionsMap(prev => ({
                    ...prev,
                    [tcId]: prev[tcId].filter(ex => ex._id !== execId)
                }));
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleStepChange = (index, val) => {
        const newSteps = [...formData.steps];
        newSteps[index] = val;
        setFormData({ ...formData, steps: newSteps });
    };

    const addStep = () => setFormData({ ...formData, steps: [...formData.steps, ""] });
    const removeStep = (index) => {
        const newSteps = formData.steps.filter((_, i) => i !== index);
        setFormData({ ...formData, steps: newSteps.length ? newSteps : [""] });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">Back to Details</span>
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
                            Test Scenarios
                            <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-2xl text-sm font-bold border border-emerald-100 italic">
                                {feature?.name}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-2xl font-medium leading-relaxed">
                            Define the verification steps and expected outcomes to ensure feature quality standards.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2.5 bg-emerald-900 text-white px-8 py-3.5 rounded-2xl font-bold shadow-2xl shadow-emerald-100 hover:bg-emerald-950 transition-all hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={20} />
                    <span>New Test Scenario</span>
                </button>
            </div>

            {/* Stats & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="px-6 py-2.5 flex flex-col items-center justify-center">
                        <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Total</span>
                        <span className="text-lg font-bold text-gray-900">{testCases.length}</span>
                    </div>
                    <div className="w-[1px] bg-gray-200 my-2"></div>
                    <div className="px-6 py-2.5 flex flex-col items-center justify-center">
                        <span className="text-xs uppercase font-bold text-emerald-500 tracking-wider">Passed</span>
                        <span className="text-lg font-bold text-emerald-600">{testCases.filter(t => t.status === 'passed').length}</span>
                    </div>
                </div>

                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search scenarios by title or logic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50 text-xs font-bold tracking-wider uppercase text-gray-400">
                                <th className="px-10 py-6">Title</th>
                                <th className="px-6 py-6 text-center">Status</th>
                                <th className="px-6 py-6 text-center">Priority</th>
                                <th className="px-6 py-6 text-center">Created By</th>
                                <th className="px-6 py-6">Description</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredData.map((tc, idx) => (
                                <AnimatePresence key={tc._id}>
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`group hover:bg-gray-50/50 transition-colors ${expandedRows.has(tc._id) ? 'bg-emerald-50/30' : ''}`}
                                    >
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleRow(tc._id)}
                                                    className={`p-1 rounded-md hover:bg-emerald-100/50 transition-colors ${expandedRows.has(tc._id) ? 'text-emerald-600' : 'text-gray-300'}`}
                                                >
                                                    {expandedRows.has(tc._id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                                <h4
                                                    onClick={() => navigate(`/projects/${feature?.projectId?._id || feature?.projectId}/features/${id}/testcases/${tc._id}`)}
                                                    className="font-bold text-gray-900 group-hover:text-emerald-900 transition-colors line-clamp-1 cursor-pointer hover:underline"
                                                >
                                                    {tc.title}
                                                </h4>
                                            </div>
                                        </td>
                                        <td className="px-6 py-7 text-center">
                                            <StatusBadge status={tc.status} />
                                        </td>
                                        <td className="px-6 py-7 text-center">
                                            <PriorityTag priority={tc.priority} />
                                        </td>
                                        <td className="px-6 py-7 text-center">
                                            <span className="text-xs font-bold text-gray-600">{tc.createdBy?.name || "System"}</span>
                                        </td>
                                        <td className="px-6 py-7 max-w-xs">
                                            <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{tc.description || "—"}</p>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleOpenModal(tc, true)}
                                                    className="p-2.5 rounded-xl bg-gray-50 text-emerald-600 hover:bg-emerald-100 transition-all active:scale-95 flex items-center gap-2"
                                                    title="Again Test"
                                                >
                                                    <RotateCcw size={15} />
                                                    <span className="text-[10px] uppercase font-bold tracking-wider hidden sm:inline">Again</span>
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(tc)}
                                                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tc._id)}
                                                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>

                                    {/* Expanded History Row */}
                                    {expandedRows.has(tc._id) && (
                                        <motion.tr
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-gray-50/50"
                                        >
                                            <td colSpan="7" className="px-10 py-6 border-l-4 border-emerald-500">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Testing History (Latest First)</h5>
                                                    </div>

                                                    {fetchingExecutions[tc._id] ? (
                                                        <div className="py-8 flex items-center justify-center gap-2 text-gray-400">
                                                            <div className="w-4 h-4 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">Loading history...</span>
                                                        </div>
                                                    ) : executionsMap[tc._id]?.length > 0 ? (
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {executionsMap[tc._id].map((exec, eidx) => (
                                                                <div 
                                                                    key={exec._id} 
                                                                    onClick={() => navigate(`/projects/${feature?.projectId?._id || feature?.projectId}/features/${id}/testcases/${tc._id}/executions/${exec._id}`)}
                                                                    className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group/item hover:border-emerald-200 transition-all cursor-pointer hover:shadow-lg hover:bg-emerald-50/10"
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-[10px] font-bold">
                                                                            {executionsMap[tc._id].length - eidx}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(exec.createdAt).toLocaleString()}</p>
                                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                                <UserCircle2 size={12} className="text-gray-300" />
                                                                                <span className="text-xs font-bold text-gray-700">{exec.userId?.name || "Tester"}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-6">
                                                                        <div className="max-w-[200px]">
                                                                            <p className="text-[10px] italic text-gray-400 line-clamp-1">{exec.actualResult || "No observations recorded"}</p>
                                                                        </div>
                                                                        <StatusBadge status={exec.status} />
                                                                        <button 
                                                                            onClick={(e) => handleDeleteExecution(e, tc._id, exec._id)}
                                                                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="py-8 text-center text-gray-300 italic text-xs font-medium">
                                                            No historical executions found for this scenario.
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <FlaskConical size={64} className="text-gray-400" />
                                            <p className="text-sm font-bold uppercase tracking-wider text-gray-900">No verification found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-emerald-950/20 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-medium"
                        >
                            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isAgainTest ? 'Record New Execution' : editingTestCase ? 'Refine Scenario' : 'Draft New Scenario'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <ArrowLeft className="rotate-90" size={20} />
                                </button>
                            </div>

                            <div className="p-10 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
                                {/* Title & Description */}
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 italic">Scenario Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            readOnly={isAgainTest}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className={`w-full px-6 py-4 rounded-2xl text-sm transition-all font-medium placeholder:text-gray-300 ${isAgainTest ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-none' : 'bg-gray-50 border-none focus:ring-4 focus:ring-emerald-100'}`}
                                            placeholder="e.g. Verify multi-factor auth flow"
                                        />
                                    </div>
                                    {!isAgainTest && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 italic">Logic Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm min-h-[100px] focus:ring-4 focus:ring-emerald-100 transition-all font-medium placeholder:text-gray-300"
                                                placeholder="The technical logic behind this verification..."
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Priority & Status */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Criticality</label>
                                        <select
                                            value={formData.priority}
                                            disabled={isAgainTest}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            className={`w-full px-6 py-4 rounded-2xl text-sm font-medium outline-none ${isAgainTest ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-none' : 'bg-gray-50 border-none focus:ring-4 focus:ring-emerald-100'}`}
                                        >
                                            <option value="low">Low Impact</option>
                                            <option value="medium">Medium Impact</option>
                                            <option value="high">High Impact</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Current State</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-100 outline-none"
                                        >
                                            <option value="notRun">Not Run</option>
                                            <option value="passed">Passed</option>
                                            <option value="failed">Failed</option>
                                            <option value="blocked">Blocked</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Expected Result */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 italic">Success Outcome</label>
                                    <input
                                        type="text"
                                        value={formData.expectedResult}
                                        readOnly={isAgainTest}
                                        onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                                        className={`w-full px-6 py-4 rounded-2xl text-sm font-medium ${isAgainTest ? 'bg-emerald-50/20 text-emerald-900 opacity-60 cursor-not-allowed border border-emerald-100' : 'bg-emerald-50/50 border border-emerald-50 text-emerald-900 placeholder:text-emerald-100'}`}
                                        placeholder="What is the definitive success criteria?"
                                    />
                                </div>

                                {isAgainTest && (
                                    <div className="space-y-4 pt-4 border-t border-gray-50">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 ml-1 italic font-bold">Actual Observations</label>
                                            <textarea
                                                value={formData.actualResult || ""}
                                                onChange={(e) => setFormData({ ...formData, actualResult: e.target.value })}
                                                className="w-full px-6 py-4 bg-emerald-50/20 border border-emerald-100 rounded-2xl text-sm min-h-[100px] focus:ring-4 focus:ring-emerald-100 transition-all font-medium placeholder:text-emerald-400"
                                                placeholder="What did you observe during this specific execution?"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Execution Steps */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 italic">Execution Protocol</label>
                                        {!isAgainTest && <button onClick={addStep} className="text-xs font-bold uppercase text-emerald-600 hover:text-emerald-700 underline tracking-wider transition-all">Add Step</button>}
                                    </div>
                                    <div className="space-y-3">
                                        {formData.steps.map((step, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className="w-10 h-10 shrink-0 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {idx + 1}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={step}
                                                    readOnly={isAgainTest}
                                                    onChange={(e) => handleStepChange(idx, e.target.value)}
                                                    className={`flex-1 px-5 rounded-xl text-sm font-medium ${isAgainTest ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-none' : 'bg-gray-50/50 border-none focus:ring-2 focus:ring-emerald-50'}`}
                                                    placeholder={`Phase ${idx + 1} instructions...`}
                                                />
                                                {!isAgainTest && (
                                                    <button onClick={() => removeStep(idx)} className="p-2.5 text-red-300 hover:text-red-500 transition-colors">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-3.5 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-10 py-3.5 rounded-2xl bg-emerald-900 text-white font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-950 transition-all"
                                >
                                    {isAgainTest ? 'Record Result' : editingTestCase ? 'Update Scenario' : 'Save Protocol'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
        </div>
    );
};
