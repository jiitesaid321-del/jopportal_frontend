import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import crossicon from "../assets/cross_icon.svg";
import { JobCategories, JobLocations } from "../assets/assets";
import JobCards from "./JobCards";
import left_arrow_icon from "../assets/left_arrow_icon.svg";
import right_arrow_icon from "../assets/right_arrow_icon.svg";

function JobListing() {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);
  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
  };

  useEffect(() => {
    const matchCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.category);
    const matchLocation = (job) =>
      selectedLocations.length === 0 ||
      selectedLocations.includes(job.location);
    const matchTitle = (job) =>
      searchFilter.title === "" ||
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
    const matchSearchLocation = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchCategory(job) &&
          matchLocation(job) &&
          matchTitle(job) &&
          matchSearchLocation(job)
      );

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);

  const totalPages = Math.ceil(filteredJobs.length / 6);

  return (
    <div className="flex flex-col md:flex-row gap-8 px-4 md:px-10 py-6">
      {/* Sidebar Filters — BEAUTIFIED HORIZONTALLY */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl">
        {/* Toggle Button — Styled */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="mb-5 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-200 flex items-center justify-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform duration-300 ${
              showFilter ? "rotate-180" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Current Search Filters — BEAUTIFIED */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>🎯</span> Current Search
              </h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {searchFilter.title && (
                  <span className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-100 transition-colors">
                    <span>{searchFilter.title}</span>
                    <button
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                      className="hover:bg-blue-200 p-0.5 rounded-full"
                    >
                      <img
                        src={crossicon}
                        alt="clear"
                        className="w-3.5 h-3.5"
                      />
                    </button>
                  </span>
                )}
                {searchFilter.location && (
                  <span className="bg-green-50 border border-green-200 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-green-100 transition-colors">
                    <span>{searchFilter.location}</span>
                    <button
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                      className="hover:bg-green-200 p-0.5 rounded-full"
                    >
                      <img
                        src={crossicon}
                        alt="clear"
                        className="w-3.5 h-3.5"
                      />
                    </button>
                  </span>
                )}
              </div>
            </>
          )}

        {/* Job Categories — BEAUTIFIED */}
        <div className={showFilter ? "block" : "hidden md:block"}>
          <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
            <span>📂</span> Search by Categories
          </h4>
          <ul className="space-y-2">
            {JobCategories.map((category, index) => (
              <li key={index} className="flex items-center gap-3 group">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-lime-500 cursor-pointer focus:ring-lime-300 rounded transition-transform group-hover:scale-110"
                  onChange={() => handleCategory(category)}
                  checked={selectedCategories.includes(category)}
                />
                <label className="text-gray-700 cursor-pointer group-hover:text-lime-600 transition-colors">
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Job Locations — BEAUTIFIED */}
        <div className={showFilter ? "block mt-6" : "hidden md:block mt-6"}>
          <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
            <span>📍</span> Search by Locations
          </h4>
          <ul className="space-y-2">
            {JobLocations.map((loc, index) => (
              <li key={index} className="flex items-center gap-3 group">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-teal-500 cursor-pointer focus:ring-teal-300 rounded transition-transform group-hover:scale-110"
                  onChange={() => handleLocation(loc)}
                  checked={selectedLocations.includes(loc)}
                />
                <label className="text-gray-700 cursor-pointer group-hover:text-teal-600 transition-colors">
                  {loc}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listings — BEAUTIFIED HORIZONTALLY */}
      <section className="w-full" id="joblist">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Shaqooyinkii Ugu Dambeeyay
        </h3>
        <p className="text-gray-500 mb-6">
          Ka hel shaqooyinka jeceshahay oo meesha rabo ah iyo shirkadaha ugu
          sareeyo
        </p>

        {/* Job Grid — Cards already beautified in JobCards.js */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((job, index) => (
              <JobCards key={index} job={job} />
            ))}
        </div>

        {/* Pagination — BEAUTIFIED */}
        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {/* Left Arrow */}
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <img src={left_arrow_icon} alt="Previous" className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`
                  w-10 h-10 rounded-lg text-sm font-medium transition-all
                  ${
                    currentPage === index + 1
                      ? "bg-lime-500 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-lime-50 hover:border-lime-300"
                  }
                `}
              >
                {index + 1}
              </button>
            ))}

            {/* Right Arrow */}
            <button
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <img src={right_arrow_icon} alt="Next" className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default JobListing;
