"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    Building2,
    FileText,
    Calendar,
    Briefcase,
    DollarSign,
    Plus,
    X,
    CreditCard,
    Tag,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import CustomLoading from "../../components/CustomLoading";

interface Income {
    id: number;
    detail_invoice: string;
    project_name: string;
    client_name: string;
    project_type: string;
    start_date: string;
    deadline: string;
    status_project: string;
    payment: string;
    jenis: string;
    biaya: number;
    created_at?: string;
}

interface Expense {
    id: number;
    jenis: string;
    detail: string;
    biaya: number;
    created_at?: string;
}

export default function CashflowPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"income" | "expense">("income");

    // ---------- INCOME STATE ----------
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [loadingIncome, setLoadingIncome] = useState(true);
    const [errorIncome, setErrorIncome] = useState("");
    const [showIncomeForm, setShowIncomeForm] = useState(false);

    // Income form state
    const [detailInvoice, setDetailInvoice] = useState("");
    const [projectName, setProjectName] = useState("");
    const [clientName, setClientName] = useState("");
    const [projectType, setProjectType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [deadline, setDeadline] = useState("");
    const [statusProject, setStatusProject] = useState("On Progress");
    const [payment, setPayment] = useState("");
    const [jenisIncome, setJenisIncome] = useState("Income");
    const [biayaIncome, setBiayaIncome] = useState("");
    const [submittingIncome, setSubmittingIncome] = useState(false);

    // ---------- EXPENSE STATE ----------
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loadingExpense, setLoadingExpense] = useState(true);
    const [errorExpense, setErrorExpense] = useState("");
    const [showExpenseForm, setShowExpenseForm] = useState(false);

    // Expense form state
    const [expJenis, setExpJenis] = useState("expense");
    const [expDetail, setExpDetail] = useState("");
    const [expBiaya, setExpBiaya] = useState("");
    const [submittingExpense, setSubmittingExpense] = useState(false);

    // ---------- FETCH INCOMES ----------
    const fetchIncomes = async () => {
        const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));
        const token = localStorage.getItem("token");
        setLoadingIncome(true);
        try {
            const res = await fetch(
                "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/incomes/",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            if (res.ok) {
                let list: any[] = [];
                if (Array.isArray(data)) {
                    list = data;
                } else if (data && Array.isArray(data.data)) {
                    list = data.data;
                } else if (data && Array.isArray(data.results)) {
                    list = data.results;
                } else if (data && typeof data === "object" && data.id) {
                    list = [data];
                }
                setIncomes(list);
            } else {
                setErrorIncome(data.message || "Failed to fetch incomes data");
            }
        } catch (err) {
            setErrorIncome("Failed to connect to server");
        } finally {
            await minimumDelay;
            setLoadingIncome(false);
        }
    };

    // ---------- FETCH EXPENSES ----------
    const fetchExpenses = async () => {
        const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));
        const token = localStorage.getItem("token");
        setLoadingExpense(true);
        try {
            const res = await fetch(
                "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/expenses/",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            if (res.ok) {
                let list: any[] = [];
                if (Array.isArray(data)) {
                    list = data;
                } else if (data && Array.isArray(data.data)) {
                    list = data.data;
                } else if (data && Array.isArray(data.results)) {
                    list = data.results;
                } else if (data && typeof data === "object" && data.id) {
                    list = [data];
                }
                setExpenses(list);
            } else {
                setErrorExpense(data.message || "Failed to fetch expenses data");
            }
        } catch (err) {
            setErrorExpense("Failed to connect to server");
        } finally {
            await minimumDelay;
            setLoadingExpense(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
        fetchExpenses();
    }, []);

    // ---------- SUBMIT INCOME ----------
    const handleSubmitIncome = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setSubmittingIncome(true);

        const payload = {
            detail_invoice: detailInvoice,
            project_name: projectName,
            client_name: clientName,
            project_type: projectType,
            start_date: startDate,
            deadline: deadline,
            status_project: statusProject,
            payment: payment,
            jenis: jenisIncome,
            biaya: Number(biayaIncome),
        };

        try {
            const res = await fetch(
                "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/incomes/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );
            const data = await res.json();
            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Income berhasil ditambahkan!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                setDetailInvoice("");
                setProjectName("");
                setClientName("");
                setProjectType("");
                setStartDate("");
                setDeadline("");
                setStatusProject("On Progress");
                setPayment("");
                setJenisIncome("Income");
                setBiayaIncome("");
                setShowIncomeForm(false);
                fetchIncomes();
            } else {
                const errMsg = data.message || data.error || JSON.stringify(data);
                Swal.fire({
                    icon: "error",
                    title: `Gagal (${res.status})`,
                    text: errMsg,
                });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: "Terjadi error jaringan" });
        } finally {
            setSubmittingIncome(false);
        }
    };

    // ---------- SUBMIT EXPENSE ----------
    const handleSubmitExpense = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setSubmittingExpense(true);

        const payload = {
            jenis: expJenis,
            detail: expDetail,
            biaya: Number(expBiaya),
        };

        try {
            const res = await fetch(
                "https://quad-easily-allowed-facts.trycloudflare.com/hexagon/api/expenses/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );
            const data = await res.json();
            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Expense berhasil ditambahkan!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                setExpJenis("expense");
                setExpDetail("");
                setExpBiaya("");
                setShowExpenseForm(false);
                fetchExpenses();
            } else {
                const errMsg = data.message || data.error || JSON.stringify(data);
                Swal.fire({
                    icon: "error",
                    title: `Gagal (${res.status})`,
                    text: errMsg,
                });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: "Terjadi error jaringan" });
        } finally {
            setSubmittingExpense(false);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 px-10 py-12">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Cashflow</h1>
                    <p className="text-gray-500 mt-2">Manage and track company income &amp; expenses</p>
                </div>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-2 mb-8">
                <button
                    onClick={() => setActiveTab("income")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === "income"
                            ? "bg-gradient-to-r from-lime-400 to-lime-600 text-white shadow"
                            : "bg-white border text-gray-500 hover:bg-gray-50"
                    }`}
                >
                    <TrendingUp size={16} />
                    Incomes ({incomes.length})
                </button>
                <button
                    onClick={() => setActiveTab("expense")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === "expense"
                            ? "bg-gradient-to-r from-red-400 to-red-600 text-white shadow"
                            : "bg-white border text-gray-500 hover:bg-gray-50"
                    }`}
                >
                    <TrendingDown size={16} />
                    Expenses ({expenses.length})
                </button>
            </div>

            {/* ===================== INCOME TAB ===================== */}
            {activeTab === "income" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="income-tab">
                    {/* ADD BUTTON */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setShowIncomeForm(!showIncomeForm)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium
                                bg-gradient-to-r from-lime-400 to-lime-600
                                shadow hover:shadow-lg transition hover:scale-105 active:scale-95"
                        >
                            {showIncomeForm ? <X size={16} /> : <Plus size={16} />}
                            {showIncomeForm ? "Cancel" : "Add Income"}
                        </button>
                    </div>

                    {/* INCOME FORM MODAL */}
                    <AnimatePresence>
                    {showIncomeForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                            onClick={(e) => { if (e.target === e.currentTarget) setShowIncomeForm(false); }}
                        >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50/60 shrink-0">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Wallet size={22} className="text-lime-600" />
                                    Add New Income Record
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowIncomeForm(false)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitIncome} className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 overflow-y-auto">
                                {/* DETAIL INVOICE */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Detail Invoice</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
                                        <FileText size={18} className="text-gray-400 mr-2" />
                                        <input type="text" placeholder="INV-001"
                                            className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                                            value={detailInvoice} onChange={(e) => setDetailInvoice(e.target.value)} required />
                                    </div>
                                </div>

                                {/* PROJECT NAME */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Project Name</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
                                        <Briefcase size={18} className="text-gray-400 mr-2" />
                                        <input type="text" placeholder="Website Company Profile"
                                            className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                                            value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                                    </div>
                                </div>

                                {/* CLIENT NAME */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Client Name</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
                                        <Building2 size={18} className="text-gray-400 mr-2" />
                                        <input type="text" placeholder="PT Muara Angkak"
                                            className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                                            value={clientName} onChange={(e) => setClientName(e.target.value)} required />
                                    </div>
                                </div>

                                {/* PROJECT TYPE */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Project Type</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
                                        <Tag size={18} className="text-gray-400 mr-2" />
                                        <input type="text" placeholder="Website"
                                            className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                                            value={projectType} onChange={(e) => setProjectType(e.target.value)} required />
                                    </div>
                                </div>

                                {/* START DATE */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Start Date</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
                                        <Calendar size={18} className="text-gray-400 mr-2" />
                                        <input type="date"
                                            className="w-full bg-transparent outline-none text-sm text-black"
                                            value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                                    </div>
                                </div>

                                {/* DEADLINE */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Deadline</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
                                        <Calendar size={18} className="text-gray-400 mr-2" />
                                        <input type="date"
                                            className="w-full bg-transparent outline-none text-sm text-black"
                                            value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                                    </div>
                                </div>

                                {/* STATUS PROJECT */}
                                <div className="space-y-3">
                                    <label className="text-sm text-gray-600 flex items-center gap-2">
                                        <Tag size={16} className="text-gray-400" /> Project Status
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {[
                                            { value: "On Progress", label: "On Progress", active: "bg-blue-50 text-blue-700 border-blue-500" },
                                            { value: "Completed", label: "Completed", active: "bg-green-50 text-green-700 border-green-500" },
                                            { value: "Pending", label: "Pending", active: "bg-gray-100 text-gray-700 border-gray-400" },
                                            { value: "Canceled", label: "Canceled", active: "bg-red-50 text-red-700 border-red-500" },
                                        ].map((s) => (
                                            <button
                                                key={s.value}
                                                type="button"
                                                onClick={() => setStatusProject(s.value)}
                                                className={`py-2 px-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                                                    statusProject === s.value
                                                        ? s.active + " shadow-sm"
                                                        : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
                                                }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* PAYMENT */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Payment</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
                                        <CreditCard size={18} className="text-gray-400 mr-2" />
                                        <input type="text" placeholder="DP / Pelunasan"
                                            className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                                            value={payment} onChange={(e) => setPayment(e.target.value)} required />
                                    </div>
                                </div>

                                {/* JENIS */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Jenis</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 opacity-70">
                                        <Wallet size={18} className="text-gray-400 mr-2" />
                                        <input type="text"
                                            className="w-full bg-transparent outline-none text-sm text-gray-600 cursor-not-allowed"
                                            value={jenisIncome} readOnly />
                                    </div>
                                </div>

                                {/* BIAYA */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Biaya (Amount)</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-lime-400 transition">
                                        <DollarSign size={18} className="text-gray-400 mr-2" />
                                        <input type="number" placeholder="5000000"
                                            className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                                            value={biayaIncome} onChange={(e) => setBiayaIncome(e.target.value)} required />
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className="md:col-span-2 pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowIncomeForm(false)}
                                        className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                        type="submit" disabled={submittingIncome}
                                        className="flex-1 py-3 rounded-lg text-white font-medium
                                            bg-gradient-to-r from-lime-400 to-lime-600
                                            shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                                        {submittingIncome ? "Submitting..." : "Save Income"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    {/* LOADING / ERROR */}
                    {loadingIncome && <CustomLoading variant="inline" />}
                    {!loadingIncome && errorIncome && <div className="text-center py-20 text-red-500">{errorIncome}</div>}

                    {/* INCOME TABLE */}
                    {!loadingIncome && !errorIncome && incomes.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b bg-gray-50/80">
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Invoice Det.</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Project</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Type</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Client</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Payment</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomes.map((inc) => (
                                            <tr key={inc.id || Math.random()}
                                                className="border-b last:border-b-0 hover:bg-lime-50/50 transition-colors group cursor-pointer"
                                                onClick={() => router.push(`/cashflow/income/${inc.id}`)}>
                                                <td className="px-6 py-4 font-mono text-xs text-gray-600">{inc.detail_invoice || "-"}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-800">{inc.project_name || "-"}</div>
                                                    <div className="text-xs text-gray-400">{inc.start_date} s/d {inc.deadline}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{inc.project_type || "-"}</td>
                                                <td className="px-6 py-4 text-gray-600">{inc.client_name || "-"}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs px-3 py-1 rounded-full capitalize ${
                                                        inc.status_project === "On Progress" ? "bg-blue-100 text-blue-700" :
                                                        inc.status_project === "Completed" ? "bg-green-100 text-green-700" :
                                                        inc.status_project === "Canceled" ? "bg-red-100 text-red-700" :
                                                        "bg-gray-100 text-gray-600"
                                                    }`}>
                                                        {inc.status_project || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{inc.payment || "-"}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    Rp {Number(inc.biaya || 0).toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* EMPTY STATE */}
                    {!loadingIncome && !errorIncome && incomes.length === 0 && (
                        <div className="bg-white rounded-2xl border shadow-sm p-16 text-center">
                            <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wallet size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Incomes Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                You don&apos;t have any income records yet. Click the &quot;Add Income&quot; button above to get started.
                            </p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ===================== EXPENSE TAB ===================== */}
            {activeTab === "expense" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="expense-tab">
                    {/* ADD BUTTON */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setShowExpenseForm(!showExpenseForm)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium
                                bg-gradient-to-r from-red-400 to-red-600
                                shadow hover:shadow-lg transition hover:scale-105 active:scale-95"
                        >
                            {showExpenseForm ? <X size={16} /> : <Plus size={16} />}
                            {showExpenseForm ? "Cancel" : "Add Expense"}
                        </button>
                    </div>

                    {/* EXPENSE FORM MODAL */}
                    <AnimatePresence>
                    {showExpenseForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                            onClick={(e) => { if (e.target === e.currentTarget) setShowExpenseForm(false); }}
                        >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50/60 shrink-0">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <TrendingDown size={22} className="text-red-500" />
                                    Add New Expense Record
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowExpenseForm(false)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitExpense} className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 overflow-y-auto">
                                {/* JENIS */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Jenis</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 opacity-70">
                                        <Tag size={18} className="text-gray-400 mr-2" />
                                        <input type="text"
                                            className="w-full bg-transparent outline-none text-sm text-gray-600 cursor-not-allowed"
                                            value={expJenis} readOnly />
                                    </div>
                                </div>

                                {/* DETAIL */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Detail</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-red-400 transition">
                                        <FileText size={18} className="text-gray-400 mr-2" />
                                        <input type="text" placeholder="exp-001 / Operasional Server"
                                            className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                                            value={expDetail} onChange={(e) => setExpDetail(e.target.value)} required />
                                    </div>
                                </div>

                                {/* BIAYA */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">Biaya (Amount)</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-red-400 transition">
                                        <DollarSign size={18} className="text-gray-400 mr-2" />
                                        <input type="number" placeholder="3000"
                                            className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-400"
                                            value={expBiaya} onChange={(e) => setExpBiaya(e.target.value)} required />
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className="md:col-span-3 pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowExpenseForm(false)}
                                        className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                        type="submit" disabled={submittingExpense}
                                        className="flex-1 py-3 rounded-lg text-white font-medium
                                            bg-gradient-to-r from-red-400 to-red-600
                                            shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                                        {submittingExpense ? "Submitting..." : "Save Expense"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    {/* LOADING / ERROR */}
                    {loadingExpense && <CustomLoading variant="inline" />}
                    {!loadingExpense && errorExpense && <div className="text-center py-20 text-red-500">{errorExpense}</div>}

                    {/* EXPENSE TABLE */}
                    {!loadingExpense && !errorExpense && expenses.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b bg-gray-50/80">
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">ID</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Jenis</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Detail</th>
                                            <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((exp) => (
                                            <tr key={exp.id || Math.random()}
                                                className="border-b last:border-b-0 hover:bg-red-50/50 transition-colors group cursor-pointer"
                                                onClick={() => router.push(`/cashflow/expense/${exp.id}`)}>
                                                <td className="px-6 py-4 font-mono text-xs text-gray-600">#{exp.id}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                        {exp.jenis || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-800 font-medium">{exp.detail || "-"}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    Rp {Number(exp.biaya || 0).toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* EMPTY STATE */}
                    {!loadingExpense && !errorExpense && expenses.length === 0 && (
                        <div className="bg-white rounded-2xl border shadow-sm p-16 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingDown size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Expenses Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                You don&apos;t have any expense records yet. Click the &quot;Add Expense&quot; button above to get started.
                            </p>
                        </div>
                    )}
                </motion.div>
            )}
        </section>
    );
}
