import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import {
  Mail,
  Phone,
  FileText,
  MoreHorizontal,
  Check,
  X,
  Briefcase,
  Building2,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { APPLICATION_API_END_POINT, AI_API_END_POINT } from "@/utils/constant";

const shortlistingStatus = ["Accepted", "Rejected"];

const statusBadge = (status) =>
  status === "accepted"
    ? "bg-green-100 text-green-700"
    : status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-600";

// Color the AI match score so fit is scannable at a glance.
const scoreClasses = (score) =>
  score >= 70
    ? "bg-green-100 text-green-700"
    : score >= 40
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiResults, setAiResults] = useState({}); // { [appId]: {score,...} | "na" | "error" }
  const [aiLoading, setAiLoading] = useState({});
  const startedRef = useRef(new Set());

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/recruiter/all`, {
        withCredentials: true,
      });
      if (res.data.success) setApplications(res.data.applications);
    } catch (error) {
      console.log("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Update locally instead of full reload.
        setApplications((prev) =>
          prev.map((a) =>
            a._id === id ? { ...a, status: status.toLowerCase() } : a,
          ),
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Score one applicant's skills vs the job description (quiet, no toasts).
  const runAiMatch = async (item) => {
    const id = item?._id;
    const skills = item?.applicant?.profile?.skills;
    if (!skills || skills.length === 0 || !item?.job?.description) {
      setAiResults((prev) => ({ ...prev, [id]: "na" }));
      return;
    }
    setAiLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await axios.post(
        `${AI_API_END_POINT}/match`,
        {
          resumeSkills: Array.isArray(skills) ? skills.join(", ") : skills,
          jobDescription: item?.job?.description,
        },
        { withCredentials: true, timeout: 60000 },
      );
      if (res.data.success) {
        setAiResults((prev) => ({ ...prev, [id]: res.data.data }));
      }
    } catch (error) {
      console.log("AI match error:", error);
      setAiResults((prev) => ({ ...prev, [id]: "error" }));
    } finally {
      setAiLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Auto-run the match for each application once, sequentially.
  useEffect(() => {
    if (!applications || applications.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const item of applications) {
        const id = item?._id;
        if (!id || startedRef.current.has(id)) continue;
        startedRef.current.add(id);
        if (cancelled) return;
        await runAiMatch(item);
      }
    })();
    return () => { cancelled = true; };
  }, [applications]);

  const renderAiMatch = (item) => {
    const id = item?._id;
    const result = aiResults[id];
    if (aiLoading[id] || result === undefined) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium">
          <Loader2 size={14} className="animate-spin" /> Analyzing…
        </span>
      );
    }
    if (result === "na")
      return <span className="text-gray-400 text-xs italic">No skills</span>;
    if (result === "error")
      return <span className="text-gray-400 text-xs italic">Unavailable</span>;
    return (
      <Popover>
        <PopoverTrigger className="cursor-pointer">
          <Badge
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-none ${scoreClasses(result.score)}`}
          >
            {result.score}% match
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="end">
          <div className="flex items-center gap-1.5 mb-2 font-semibold text-purple-700">
            <Sparkles size={14} /> AI Assessment
          </div>
          <p className="text-xs text-gray-600 mb-2">{result.feedback}</p>
          {Array.isArray(result.missingSkills) && result.missingSkills.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-500 mb-1">Missing skills:</p>
              <div className="flex flex-wrap gap-1">
                {result.missingSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  const filtered = applications.filter((item) => {
    const q = search.toLowerCase();
    return (
      item?.applicant?.fullname?.toLowerCase().includes(q) ||
      item?.applicant?.email?.toLowerCase().includes(q) ||
      item?.job?.title?.toLowerCase().includes(q) ||
      item?.job?.company?.name?.toLowerCase().includes(q)
    );
  });

  const ActionMenu = ({ id }) => (
    <Popover>
      <PopoverTrigger className="cursor-pointer p-2 hover:bg-gray-100 rounded-full">
        <MoreHorizontal size={18} />
      </PopoverTrigger>
      <PopoverContent className="w-32 p-1" align="end">
        {shortlistingStatus.map((status, i) => (
          <div
            key={i}
            onClick={() => statusHandler(status, id)}
            className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2 text-sm font-medium"
          >
            {status === "Accepted" ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <X size={14} className="text-red-600" />
            )}
            <span>{status}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Navbar />
      <div className="max-w-6xl mx-auto my-10 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-5">
          <div>
            <h1 className="font-bold text-2xl text-gray-800">
              All Applications ({filtered.length})
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Every candidate who applied to your jobs. Use the email or phone to reach out.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search name, email, role, company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading applications…</div>
        ) : (
          <>
            {/* --- MOBILE --- */}
            <div className="flex flex-col gap-4 md:hidden">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h2 className="font-bold text-gray-800 text-lg">
                          {item?.applicant?.fullname}
                        </h2>
                        <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                          <Briefcase size={14} /> <span>{item?.job?.title}</span>
                        </div>
                      </div>
                      <ActionMenu id={item._id} />
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <a
                        href={`mailto:${item?.applicant?.email}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-purple-700"
                      >
                        <Mail size={14} /> {item?.applicant?.email || "—"}
                      </a>
                      <a
                        href={`tel:${item?.applicant?.phoneNumber}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-purple-700"
                      >
                        <Phone size={14} /> {item?.applicant?.phoneNumber || "—"}
                      </a>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 size={14} /> {item?.job?.company?.name || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} /> Applied: {item?.createdAt?.split("T")[0]}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Sparkles size={14} className="text-purple-600" />
                        {renderAiMatch(item)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      {item?.applicant?.profile?.resume ? (
                        <a
                          href={item?.applicant?.profile?.resume?.replace(
                            "/upload/",
                            "/upload/f_auto,q_auto/",
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 font-semibold"
                        >
                          <FileText size={16} /> Resume
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm italic">No Resume</span>
                      )}
                      <Badge
                        className={`text-[10px] font-bold px-3 py-1 rounded-full border-none capitalize ${statusBadge(item?.status)}`}
                      >
                        {item?.status || "pending"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500">
                  No applications found.
                </div>
              )}
            </div>

            {/* --- DESKTOP --- */}
            <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="pl-6">Candidate</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>AI Match</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((item) => (
                      <TableRow key={item._id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium pl-6">
                          {item?.applicant?.fullname}
                        </TableCell>
                        <TableCell>
                          {item?.applicant?.email ? (
                            <a
                              href={`mailto:${item.applicant.email}`}
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <Mail size={14} /> {item.applicant.email}
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {item?.applicant?.phoneNumber ? (
                            <a
                              href={`tel:${item.applicant.phoneNumber}`}
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <Phone size={14} /> {item.applicant.phoneNumber}
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>{item?.job?.title}</TableCell>
                        <TableCell>{item?.job?.company?.name || "N/A"}</TableCell>
                        <TableCell>{renderAiMatch(item)}</TableCell>
                        <TableCell>
                          {item?.applicant?.profile?.resume ? (
                            <a
                              href={item?.applicant?.profile?.resume?.replace(
                                "/upload/",
                                "/upload/f_auto,q_auto/",
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                            >
                              <FileText size={16} /> View
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">NA</span>
                          )}
                        </TableCell>
                        <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-3">
                            <Badge
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-none capitalize ${statusBadge(item?.status)}`}
                            >
                              {item?.status || "pending"}
                            </Badge>
                            <ActionMenu id={item._id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-10 text-gray-500">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllApplications;
