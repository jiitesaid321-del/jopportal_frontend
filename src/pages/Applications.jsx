import React, { useContext, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/appContext";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns"; // Modern, lightweight date lib

// 💡 Pure CSS Spinner (fallback if needed)
const Spinner = ({ size = "16px" }) => (
  <div
    className="inline-block rounded-full animate-spin"
    style={{
      width: size,
      height: size,
      border: "2px solid #fff",
      borderTop: "2px solid transparent",
    }}
  ></div>
);

function Applications() {
  // const { user } = useUser();
  const { getToken } = useAuth();
  const [isEdit, setEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    backEndUrl,
    userData,
    userApplications = [],
    fetchUserData,
  } = useContext(AppContext);

  const updateResume = async () => {
    if (!resume) {
      toast.error("Please select a resume file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();
      const { data } = await axios.post(
        `${backEndUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("✅ Resume updated successfully!");
        await fetchUserData();
      } else {
        toast.error(data.message || "Failed to update resume");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
      setEdit(false);
      setResume(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    setResume(file);
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-8 p-4 sm:p-6">
        {/* Resume Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-6 mb-10 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-6 h-6 mr-2 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              Your Resume
            </h2>
            {!isEdit && userData?.resume && (
              <button
                onClick={() => setEdit(true)}
                className="bg-white hover:bg-gray-50 text-green-600 border border-green-300 px-4 py-2 rounded-xl font-medium text-sm shadow-sm transition-all duration-200 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Edit
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-inner">
            {isEdit || (userData && !userData.resume) ? (
              <div className="space-y-4">
                <label
                  htmlFor="resumeupload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:bg-green-50 transition-colors group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-3 text-green-500 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                    {resume && (
                      <p className="mt-2 text-green-600 font-medium text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-4 h-4 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {resume.name}
                      </p>
                    )}
                  </div>
                  <input
                    id="resumeupload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={updateResume}
                    disabled={uploading || !resume}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    {uploading ? (
                      <>
                        <Spinner size="18px" />
                        Uploading...
                      </>
                    ) : (
                      "💾 Save Resume"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEdit(false);
                      setResume(null);
                    }}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-green-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Current Resume</p>
                    <a
                      href={userData.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 underline text-sm font-medium flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      View File
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setEdit(true)}
                  className="bg-white hover:bg-gray-50 text-green-600 border border-green-300 px-4 py-2 rounded-xl font-medium text-sm shadow-sm transition-all duration-200 flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-6 h-6 mr-2 text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
            Jobs Applied
          </h2>

          {userApplications.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 12h4.5m0 0l1.963-1.963M12 18.75l-1.963-1.963m0 0H8.25m4.5 4.5V12"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500">
                Start applying to jobs to see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userApplications.map((app, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={app.companyId?.image || "/placeholder-logo.png"}
                        alt={app.companyId?.name || "Company"}
                        className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1"
                        onError={(e) => {
                          e.target.src = "/placeholder-logo.png";
                        }}
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {app.jobId.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {app.companyId.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            📍 {app.jobId.location}
                          </span>
                          <span className="inline-flex items-center bg-gray-50 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            📅 {format(new Date(app.date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span
                        className={`
                          inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold
                          ${
                            app.status === "Accepted"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          }
                        `}
                      >
                        {app.status === "Accepted" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        {app.status === "Rejected" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Applications;
