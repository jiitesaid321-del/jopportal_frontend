import React from "react";
import { useNavigate } from "react-router-dom";

function JobCards({ job }) {
  const navigate = useNavigate();

  // Format expiry date
  const expireDate = job.expireDate
    ? new Date(job.expireDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No expiration";

  const isExpired = job.expireDate && new Date(job.expireDate) < new Date();
  const isExpiringSoon =
    job.expireDate &&
    new Date(job.expireDate) > new Date() &&
    new Date(job.expireDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  // Safe truncate
  const truncateDescription = (html, maxLength = 220) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };

  const handleViewDetails = () => {
    navigate(`/applied-jobs/${job._id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* HEADER — Logo + Title */}
      <div className="p-5 pb-4 flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200 overflow-hidden">
          <img
            src={job.companyId?.image || "/placeholder-logo.png"}
            alt={job.companyId?.name || "Company"}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              e.target.src =
                'image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"%3E%3Cpath fill="%239ca3af" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/%3E%3C/svg%3E';
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 leading-tight">
            {job.title}
          </h3>
          <p className="text-gray-600 text-sm mt-0.5">
            {job.companyId?.name || "Unknown Company"}
          </p>
        </div>
      </div>

      {/* JOB DETAILS — CLEARLY LABELED */}
      <div className="px-5 py-3 bg-gray-50/50 border-t border-b border-gray-100">
        {/* Location */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-emerald-600 font-medium text-xs">
            📍 LOCATION
          </span>
          <span className="text-gray-800 text-sm font-medium">
            {job.location}
          </span>
        </div>

        {/* Level */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-blue-600 font-medium text-xs">💼 LEVEL</span>
          <span className="text-gray-800 text-sm font-medium">
            {job.level.replace(" level", "")}
          </span>
        </div>

        {/* Expiry */}
        <div className="flex items-center gap-2">
          <span className="text-orange-600 font-medium text-xs">
            ⏳ EXPIRES
          </span>
          <span
            className={`text-sm font-medium ${
              isExpired
                ? "text-red-600"
                : isExpiringSoon
                ? "text-orange-600"
                : "text-gray-800"
            }`}
          >
            {expireDate}
          </span>
        </div>
      </div>

      {/* DESCRIPTION — LABELED */}
      <div className="px-5 py-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          📄 JOB DESCRIPTION
        </p>
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {truncateDescription(job.description, 220)}
        </p>
      </div>

      {/* BUTTONS — MEDIUM SIZE */}
      <div className="px-5 pb-5 pt-2">
        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            Apply Now
          </button>

          <button
            onClick={handleViewDetails}
            className="flex-1 border border-lime-500 text-lime-600 font-semibold py-2.5 px-4 rounded-xl hover:bg-lime-50 transition-all duration-200 flex items-center justify-center gap-1.5 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCards;
