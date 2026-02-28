// pages/FeatureDetail.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { featureService } from "../api/featureService";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Layers,
    CheckCircle2,
    Edit3,
    Trash2,
    FlaskConical,
    ChevronRight
} from "lucide-react";

export const FeatureDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feature, setFeature] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchFeature = async () => {
        try {
            setLoading(true);
            const response = await featureService.getFeatureById(id);
            if (response.success) {
                setFeature(response.data);
            }
        } catch (error) {
            toast.error(error.message || "Failed to load feature details");
            navigate("/project-features");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeature();
    }, [id]);

    const getStatusStyles = (status) => {
        const map = {
            active: { dot: '#10b981', bg: '#f0fdf8', text: '#065f46', label: 'Active' },
            completed: { dot: '#8b5cf6', bg: '#f5f3ff', text: '#4c1d95', label: 'Completed' },
            inReview: { dot: '#f59e0b', bg: '#fffbeb', text: '#78350f', label: 'In Review' },
            pending: { dot: '#3b82f6', bg: '#eff6ff', text: '#1e3a8a', label: 'Pending' },
            blocked: { dot: '#ef4444', bg: '#fef2f2', text: '#7f1d1d', label: 'Blocked' },
        };
        return map[status] || map.pending;
    };

    const getPriorityStyles = (priority) => {
        const map = {
            high: { color: '#ef4444', bg: '#fef2f2', label: 'High' },
            medium: { color: '#f59e0b', bg: '#fffbeb', label: 'Medium' },
            low: { color: '#10b981', bg: '#f0fdf8', label: 'Low' },
        };
        return map[priority] || map.low;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold tracking-widest uppercase opacity-50">Loading Metadata...</p>
            </div>
        );
    }

    const statusStyle = getStatusStyles(feature?.status);
    const priorityStyle = getPriorityStyles(feature?.priority);

    return (
        <div className="px-8 py-8 max-w-5xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* Navigation */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold tracking-tight">Back to Features</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm shadow-gray-100/50">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span
                                className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.1em] border"
                                style={{ background: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.dot + '20' }}
                            >
                                {statusStyle.label}
                            </span>
                            <span
                                className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.1em] border"
                                style={{ background: priorityStyle.bg, color: priorityStyle.color, borderColor: priorityStyle.color + '20' }}
                            >
                                {priorityStyle.label} Priority
                            </span>
                        </div>

                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                            {feature?.name}
                        </h1>

                        <p className="text-lg text-gray-500 leading-relaxed mb-10">
                            {feature?.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-gray-50">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Layers size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1">Feature Type</p>
                                    <p className="text-sm font-bold text-gray-900">{feature?.type?.charAt(0).toUpperCase() + feature?.type?.slice(1)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                    <Calendar size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1">Created Date</p>
                                    <p className="text-sm font-bold text-gray-900">{new Date(feature?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Test Cases Quick Access */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        onClick={() => navigate(`/features/${id}/testcases`)}
                        className="group cursor-pointer bg-emerald-900 rounded-[2.5rem] p-8 flex items-center justify-between text-white shadow-2xl shadow-emerald-200"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <FlaskConical size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Test Cases</h3>
                                <p className="text-emerald-100/60 text-sm mt-1">Manage and execute verification steps for this feature</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Sidebar Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {/* Actions Card */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 mb-6">Management</h4>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold transition-all group">
                                <div className="flex items-center gap-3">
                                    <Edit3 size={18} />
                                    <span className="text-sm">Edit Feature</span>
                                </div>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold transition-all group">
                                <div className="flex items-center gap-3">
                                    <Trash2 size={18} />
                                    <span className="text-sm">Delete Feature</span>
                                </div>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 mb-6">Timeline</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Last Updated</p>
                                    <p className="text-xs font-bold text-gray-900">{new Date(feature?.updatedAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Project</p>
                                    <p className="text-xs font-bold text-gray-900">{feature?.projectId?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};
