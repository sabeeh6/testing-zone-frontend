import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  SlidersHorizontal,
  UserCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "In Review": "bg-amber-50  text-amber-700  border border-amber-200",
  Pending: "bg-sky-50    text-sky-700    border border-sky-200",
  Blocked: "bg-red-50    text-red-600    border border-red-200",
  Completed: "bg-violet-50 text-violet-700 border border-violet-200",
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
      <span className={`mr-1.5 w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" :
        status === "In Review" ? "bg-amber-500" :
          status === "Pending" ? "bg-sky-500" :
            status === "Blocked" ? "bg-red-500" :
              status === "Completed" ? "bg-violet-500" : "bg-gray-400"
        }`} />
      {status}
    </span>
  );
}

// ─── Avatar Stack ──────────────────────────────────────────────────────────────
function AvatarStack({ people = [], max = 3 }) {
  const shown = people.slice(0, max);
  const extra = people.length - max;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p, i) => {
        const name = typeof p === 'string' ? p : p.name;
        return (
          <div
            key={i}
            title={name}
            className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-gray-100 z-10"
            style={{ zIndex: shown.length - i }}
          >
            {name?.charAt(0)?.toUpperCase()}
          </div>
        );
      })}
      {extra > 0 && (
        <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-500 shadow-sm ring-1 ring-gray-100">
          +{extra}
        </div>
      )}
      {people.length === 0 && (
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <UserCircle2 size={14} /> —
        </span>
      )}
    </div>
  );
}

// ─── Row Actions Dropdown ──────────────────────────────────────────────────────
function RowActions({ onEdit, onDelete, onView }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    { label: "View details", icon: Eye, fn: onView, color: "text-gray-700" },
    { label: "Edit project", icon: Pencil, fn: onEdit, color: "text-gray-700" },
    { label: "Delete", icon: Trash2, fn: onDelete, color: "text-red-500" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
      >
        <MoreVertical size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-8 z-50 w-44 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/60 py-1 overflow-hidden"
          >
            {actions.map(({ label, icon: Icon, fn, color }) => (
              <button
                key={label}
                onClick={() => { fn?.(); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors ${color}`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sort Icon ─────────────────────────────────────────────────────────────────
function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <ArrowUpDown size={13} className="text-gray-300" />;
  return sortDir === "asc"
    ? <ArrowUp size={13} className="text-emerald-600" />
    : <ArrowDown size={13} className="text-emerald-600" />;
}

// ─── COLUMNS CONFIG ────────────────────────────────────────────────────────────
const COLUMNS = [
  { key: "name", label: "Project Name", sortable: true },
  { key: "developers", label: "Developers", sortable: false },
  { key: "testers", label: "Testers", sortable: false },
  { key: "description", label: "Description", sortable: false },
  { key: "status", label: "Status", sortable: true },
];

const STATUS_TABS = ["All", "Active", "In Review", "Pending", "Blocked", "Completed"];

const TAB_COUNT_COLOR = {
  All: "bg-gray-900 text-white",
  Active: "bg-emerald-100 text-emerald-700",
  "In Review": "bg-amber-100 text-amber-700",
  Pending: "bg-sky-100 text-sky-700",
  Blocked: "bg-red-100 text-red-600",
  Completed: "bg-violet-100 text-violet-700",
};

export default function ProjectsTable({
  projects = [],
  onEdit,
  onDelete,
  // onView,
  onAddProject,
  loading = false,
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(new Set());
  const [roleFilter, setRoleFilter] = useState("All");
  const [roleOpen, setRoleOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const roleRef = useRef(null);

  const navigate = useNavigate()
  const detailPage = () => {
    navigate('/project-features')
  }
// /' + (selected.values().next().value || projects[0]?._id || projects[0]?.id) 
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, roleFilter]);

  useEffect(() => {
    const handler = (e) => { if (roleRef.current && !roleRef.current.contains(e.target)) setRoleOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filtering
  const filtered = projects.filter((p) => {
    const matchTab = activeTab === "All" || p.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch =
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.developers?.some((d) => (typeof d === 'string' ? d : d.name).toLowerCase().includes(q)) ||
      p.testers?.some((t) => (typeof t === 'string' ? t : t.name).toLowerCase().includes(q));
    return matchTab && matchSearch;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    const v = sortDir === "asc" ? 1 : -1;
    if (sortCol === "name") return a.name.localeCompare(b.name) * v;
    if (sortCol === "status") return a.status.localeCompare(b.status) * v;
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Tab counts
  const counts = STATUS_TABS.reduce((acc, tab) => {
    acc[tab] = tab === "All" ? projects.length : projects.filter((p) => p.status === tab).length;
    return acc;
  }, {});

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const toggleAll = () => {
    if (selected.size === paginatedData.length) setSelected(new Set());
    else setSelected(new Set(paginatedData.map((p) => p._id || p.id)));
  };

  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = paginatedData.length > 0 && selected.size === paginatedData.length;

  return (
    <div className="flex flex-col gap-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── Header row ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">Dashboard · Projects · <span className="text-gray-700 font-medium">List</span></p>
        </div>
        <motion.button
          onClick={onAddProject}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Add Project
        </motion.button>
      </div>

      {/* ── Status Tabs ── */}
      <div className="flex items-center gap-1 mb-5 border-b border-gray-100 pb-0">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors rounded-t-lg ${activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${activeTab === tab ? TAB_COUNT_COLOR[tab] : "bg-gray-100 text-gray-500"
                }`}>
                {counts[tab]}
              </span>
            )}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Filters row ── */}
      <div className="flex items-center gap-3 mb-4">
        {/* Role dropdown */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleOpen((v) => !v)}
            className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 bg-white px-3.5 py-2 rounded-lg hover:border-gray-300 transition-colors min-w-[120px] justify-between"
          >
            <span>{roleFilter === "All" ? "Role" : roleFilter}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          <AnimatePresence>
            {roleOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-10 left-0 z-40 bg-white border border-gray-100 rounded-xl shadow-xl w-44 py-1"
              >
                {["All", "Developer", "Tester", "Manager"].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRoleFilter(r); setRoleOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-gray-50 transition-colors ${roleFilter === r ? "font-semibold text-gray-900" : "text-gray-600"}`}
                  >
                    {r}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, developers, testers..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 text-gray-900 placeholder:text-gray-400 transition-all"
          />
        </div>

        {/* Filter icon */}
        <button className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-700 transition-colors">
          <SlidersHorizontal size={15} />
        </button>
      </div>

      {/* ── Bulk action bar ── */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg mb-3"
          >
            <span className="font-medium">{selected.size} selected</span>
            <div className="flex-1" />
            <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors font-medium">
              <Trash2 size={13} /> Delete selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table ── */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-10">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Head */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-10 pl-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 accent-emerald-600 cursor-pointer"
                  />
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && toggleSort(col.key)}
                    className={`text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3.5 select-none whitespace-nowrap ${col.sortable ? "cursor-pointer hover:text-gray-800 transition-colors" : ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />}
                    </div>
                  </th>
                ))}
                <th className="w-16 px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence initial={false}>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="pl-4 py-4"><div className="w-4 h-4 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                          <div className="space-y-2">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-2 w-16 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><div className="h-4 w-20 bg-gray-100 rounded-full" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-20 bg-gray-100 rounded-full" /></td>
                      <td className="px-4 py-4"><div className="h-3 w-32 bg-gray-100 rounded" /></td>
                      <td className="px-4 py-4"><div className="h-6 w-16 bg-gray-100 rounded-md" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-10 bg-gray-100 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((project, idx) => (
                    <motion.tr
                      key={project._id || project.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      className={`group hover:bg-gray-50/80 transition-colors ${selected.has(project._id || project.id) ? "bg-emerald-50/40" : "bg-white"}`}
                    >
                      {/* Checkbox */}
                      <td className="pl-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selected.has(project._id || project.id)}
                          onChange={() => toggleRow(project._id || project.id)}
                          className="w-4 h-4 rounded border-gray-300 accent-emerald-600 cursor-pointer"
                        />
                      </td>

                      {/* Project Name */}
                      <td className="px-4 py-3.5 min-w-[180px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                            {project.name?.charAt(0)}
                          </div>
                          <div>
                            <p><a onClick={detailPage}  className="text-sm font-semibold text-gray-900 leading-tight cursor-pointer">{project.name}</a></p>
                            {/* <p className="text-xs text-gray-400 mt-0.5">ID #{String(project._id || project.id).slice(-4).toUpperCase()}</p> */}
                          </div>
                        </div>
                      </td>

                      {/* Developers */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <AvatarStack people={project.developers ?? []} />
                          {project.developers?.length > 0 && (
                            <span className="text-xs text-gray-500">{project.developers.length} dev{project.developers.length !== 1 ? "s" : ""}</span>
                          )}
                        </div>
                      </td>

                      {/* Testers */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <AvatarStack people={project.testers ?? []} max={2} />
                          {project.testers?.length > 0 && (
                            <span className="text-xs text-gray-500">{project.testers.length} tester{project.testers.length !== 1 ? "s" : ""}</span>
                          )}
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <p className="text-sm text-gray-600 truncate">{project.description}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={project.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEdit?.(project)}
                            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <RowActions
                            onEdit={() => onEdit?.(project)}
                            onDelete={() => onDelete?.(project)}
                            // onView={() => onView?.(project)}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{Math.min(startIndex + 1, sorted.length)}</span> to{" "}
            <span className="font-semibold text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, sorted.length)}</span> of{" "}
            <span className="font-semibold text-gray-700">{sorted.length}</span> results
          </p>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${currentPage === i + 1 ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}