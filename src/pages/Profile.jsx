import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";
import { api, getApiError } from "../lib/api";
import { useAuthStore } from "../stores/authStore";

const statusStyles = {
  active: "bg-blue-50 text-blue-700 border-blue-200",
  verified: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  resubmitted: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
};

const Profile = () => {
  const storedUser = useAuthStore((state) => state.user);
  const saveSession = useAuthStore((state) => state.saveSession);
  const token = useAuthStore((state) => state.token);
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStatus = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/client/account-status");
      setUser(data.user);
      saveSession({ token, user: data.user });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const details = [
    ["Representative", user?.name, FiUser],
    ["Email", user?.email, FiMail],
    ["Phone", user?.phoneNumber, FiPhone],
    ["Company address", user?.companyAddress, FiMapPin],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Company profile</h1>
          <p className="mt-1 text-sm text-slate-500">Review your registration and account approval status.</p>
        </div>
        <button onClick={loadStatus} disabled={loading} className="rounded-lg border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50 disabled:opacity-60">
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-indigo-100">Registered company</p>
              <h2 className="mt-1 text-3xl font-bold">{user?.companyName || "Company"}</h2>
              <p className="mt-2 text-indigo-100 capitalize">{user?.companyType?.replaceAll("_", " ") || "Client account"}</p>
            </div>
            <span className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold capitalize ${statusStyles[user?.status] || "border-white/30 bg-white/10 text-white"}`}>
              {user?.status || "pending"}
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          {details.map(([label, value, Icon]) => (
            <div key={label} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <div className="rounded-lg bg-white p-2 text-indigo-600 shadow-sm"><Icon /></div>
              <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-medium text-slate-700">{value || "Not provided"}</p></div>
            </div>
          ))}
        </div>
      </section>

      {user?.status === "rejected" && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex gap-3"><FiAlertCircle className="mt-0.5 h-5 w-5 text-red-600" /><div><h3 className="font-semibold text-red-800">Registration needs attention</h3><p className="mt-1 text-sm text-red-700">{user?.rejectionReason || "Please contact the administrator for the rejection details."}</p></div></div>
        </section>
      )}

      {["active", "verified"].includes(user?.status) && (
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex gap-3"><FiCheckCircle className="mt-0.5 h-5 w-5 text-blue-600" /><div><h3 className="font-semibold text-blue-800">Account verified</h3><p className="mt-1 text-sm text-blue-700">You can now submit bookings, pre-advice records, payments, and gate-out requests.</p></div></div>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold text-slate-800"><FiFileText className="text-indigo-600" /> Submitted documents</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(user?.documents || []).map((document) => (
            <a key={`${document.type}-${document.url}`} href={document.secureUrl || document.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 p-4 hover:border-indigo-300 hover:bg-indigo-50/40">
              <p className="font-medium text-slate-700">{document.label}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{document.fileName}</p>
            </a>
          ))}
          {(user?.documents || []).length === 0 && <p className="text-sm text-slate-500">No documents available.</p>}
        </div>
      </section>
    </div>
  );
};

export default Profile;
