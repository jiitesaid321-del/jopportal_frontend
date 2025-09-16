import { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/appContext";
import { toast } from "react-toastify";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaListUl,
  FaUserGraduate,
} from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

// 💡 Pure CSS Spinner (No external dependency — always works!)
const Spinner = ({ color = "#fff", size = "16px" }) => (
  <div
    className="inline-block rounded-full animate-spin"
    style={{
      width: size,
      height: size,
      border: `2px solid ${color}`,
      borderTop: `2px solid transparent`,
    }}
  ></div>
);

function AddJob() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Mogadishu");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner level");
  const [salary, setSalary] = useState("");
  const [expireDays, setExpireDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backEndUrl, companyToken } = useContext(AppContext);

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Job title is required";
    if (!salary || isNaN(salary) || Number(salary) < 0)
      newErrors.salary = "Enter a valid salary (0 or more)";
    if (!quillRef.current || !quillRef.current.root.innerHTML.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      const description = quillRef.current.root.innerHTML;
      const expireDate = new Date(
        Date.now() + expireDays * 24 * 60 * 60 * 1000
      );

      const { data } = await axios.post(
        `${backEndUrl}/api/company/post-job`,
        { title, description, location, salary, category, level, expireDate },
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("🎉 Job posted successfully!");
        setTitle("");
        setSalary("");
        setExpireDays(30);
        if (quillRef.current) quillRef.current.root.innerHTML = "";
        setErrors({});
      } else {
        toast.error(data.message || "Failed to post job");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder:
          "Describe responsibilities, requirements, qualifications, etc...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  // Clear error when user types
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
  };

  const handleSalaryChange = (e) => {
    setSalary(e.target.value);
    if (errors.salary) setErrors((prev) => ({ ...prev, salary: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-lime-500 via-lime-600 to-green-600 px-8 py-7 text-center">
          <div className="flex items-center justify-center mb-3">
            <FaBriefcase className="text-white text-3xl mr-3" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Post a New Job
            </h1>
          </div>
          <p className="text-white/90 text-sm md:text-base font-medium max-w-md mx-auto">
            Fill in the details below to attract top talent and grow your team
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="p-6 sm:p-8 space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaBriefcase className="mr-2 text-lime-600" />
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Senior React Developer"
              value={title}
              onChange={handleTitleChange}
              required
              className={`w-full px-5 py-4 border rounded-xl focus:ring-2 transition duration-200 outline-none text-sm placeholder-gray-400 ${
                errors.title
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-lime-500 focus:border-lime-500"
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.title}
              </p>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <IoDocumentTextOutline className="mr-2 text-lime-600" />
              Job Description
            </label>
            <div
              ref={editorRef}
              className={`border rounded-xl h-52 bg-white transition focus-within:ring-2 ${
                errors.description
                  ? "border-red-400 focus-within:ring-red-300"
                  : "border-gray-300 focus-within:ring-lime-500"
              }`}
            ></div>
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.description}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaListUl className="mr-2 text-lime-600" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition duration-200 outline-none text-sm bg-white appearance-none"
            >
              {JobCategories.map((item, index) => (
                <option value={item} key={index} className="py-2">
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-lime-600" />
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition duration-200 outline-none text-sm bg-white appearance-none"
            >
              {JobLocations.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaUserGraduate className="mr-2 text-lime-600" />
              Experience Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition duration-200 outline-none text-sm bg-white appearance-none"
            >
              <option value="Beginner level">Beginner</option>
              <option value="Intermediate level">Intermediate</option>
              <option value="Senior level">Senior</option>
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaDollarSign className="mr-2 text-lime-600" />
              Salary (USD)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={salary}
              onChange={handleSalaryChange}
              className={`w-full px-5 py-4 border rounded-xl focus:ring-2 transition duration-200 outline-none text-sm placeholder-gray-400 ${
                errors.salary
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-lime-500 focus:border-lime-500"
              }`}
            />
            {errors.salary && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.salary}
              </p>
            )}
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaClock className="mr-2 text-lime-600" />
              Listing Expires In
            </label>
            <select
              value={expireDays}
              onChange={(e) => setExpireDays(parseInt(e.target.value))}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-500 focus:border-transparent transition duration-200 outline-none text-sm bg-white appearance-none"
            >
              <option value={1}>1 Day</option>
              <option value={7}>1 Week</option>
              <option value={14}>2 Weeks</option>
              <option value={30}>1 Month</option>
              <option value={60}>2 Months</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 text-sm md:text-base"
            >
              {loading ? (
                <>
                  <Spinner color="#fff" size="18px" />
                  <span>Posting Job…</span>
                </>
              ) : (
                <>
                  <span>🚀 Post This Job</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJob;
