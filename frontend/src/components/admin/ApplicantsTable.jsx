import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  MoreHorizontal,
  Check,
  X,
  FileText,
  Calendar,
  Briefcase,
  Building2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT, AI_API_END_POINT } from "@/utils/constant";
import { Badge } from "../ui/badge";

const shortlistingStatus = ["Accepted", "Rejected"];

// Color the score so recruiters can scan fit at a glance.
const scoreClasses = (score) =>
  score >= 70
    ? "bg-green-100 text-green-700"
    : score >= 40
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const [aiResults, setAiResults] = useState({}); // { [appId]: {score, feedback, missingSkills} | "error" }
  const [aiLoading, setAiLoading] = useState({}); // { [appId]: boolean }
  const startedRef = useRef(new Set()); // app ids we've already kicked off

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Score one applicant's skills against the job description via the AI endpoint.
  // Runs quietly (no toasts) since it fires automatically for every row.
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

  // Auto-run the match for each applicant once, sequentially, so we don't
  // blast the AI API / a cold-started server with parallel requests.
  useEffect(() => {
    if (!applicants || applicants.length === 0) return;
    let cancelled = false;

    (async () => {
      for (const item of applicants) {
        const id = item?._id;
        if (!id || startedRef.current.has(id)) continue;
        startedRef.current.add(id);
        if (cancelled) return;
        await runAiMatch(item);
      }
    })();

    return () => { cancelled = true; };
  }, [applicants]);

  // Renders a spinner, the score badge + popover, or a graceful fallback.
  const renderAiMatch = (item) => {
    const id = item?._id;
    const loading = aiLoading[id];
    const result = aiResults[id];

    if (loading || result === undefined) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium">
          <Loader2 size={14} className="animate-spin" /> Analyzing…
        </span>
      );
    }

    if (result === "na") {
      return <span className="text-gray-400 text-xs italic">No skills</span>;
    }

    if (result === "error") {
      return <span className="text-gray-400 text-xs italic">Unavailable</span>;
    }

    {
      return (
        <Popover>
          <PopoverTrigger className="cursor-pointer">
            <Badge
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-none ${scoreClasses(
                result.score,
              )}`}
            >
              {result.score}% match
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="end">
            <div className="flex items-center gap-1.5 mb-2 font-semibold text-purple-700">
              <Sparkles size={14} /> AI Assessment
            </div>
            <p className="text-xs text-gray-600 mb-2">{result.feedback}</p>
            {Array.isArray(result.missingSkills) &&
              result.missingSkills.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 mb-1">
                    Missing skills:
                  </p>
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
    }
  };

  return (
    <div className="mt-5">
      {/* --- MOBILE VIEW --- */}
      <div className="flex flex-col gap-4 md:hidden">
        {applicants && applicants.length > 0 ? (
          applicants.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative"
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
                <Popover>
                  <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal size={20} className="text-gray-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-1" align="end">
                    {shortlistingStatus.map((status, i) => (
                      <div
                        key={i}
                        onClick={() => statusHandler(status, item?._id)}
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
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Building2 size={14} /> <span>{item?.job?.company?.name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar size={14} />{" "}
                  <span>Applied: {item?.createdAt?.split("T")[0]}</span>
                </div>
              </div>

              {/* AI match helper for recruiters */}
              <div className="mb-4">{renderAiMatch(item)}</div>

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
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border-none capitalize
                    ${
                      item?.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : item?.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {item?.status || "pending"}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500">
            No applicants found.
          </div>
        )}
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="pl-6">Full Name</TableHead>
              {/* REPLACED Email and Contact with Company and Role */}
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>AI Match</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants && applicants.length > 0 ? (
              applicants.map((item) => (
                <TableRow
                  key={item._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="font-medium pl-6">
                    {item?.applicant?.fullname}
                  </TableCell>
                  {/* DATA MAPPING for Company and Role */}
                  <TableCell>{item?.job?.company?.name || "N/A"}</TableCell>
                  <TableCell>{item?.job?.title}</TableCell>
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
                        <FileText size={16} /> <span>View Resume</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">NA</span>
                    )}
                  </TableCell>
                  <TableCell>{renderAiMatch(item)}</TableCell>
                  <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-3">
                      <Badge
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-none capitalize
                          ${
                            item?.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : item?.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {item?.status || "pending"}
                      </Badge>
                      <Popover>
                        <PopoverTrigger className="cursor-pointer p-2 hover:bg-gray-100 rounded-full">
                          <MoreHorizontal size={18} />
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-1">
                          {shortlistingStatus.map((status, i) => (
                            <div
                              key={i}
                              onClick={() => statusHandler(status, item?._id)}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  No applicants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApplicantsTable;
