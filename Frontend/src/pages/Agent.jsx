import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import AgentFile from "../components/agent/agentFileUpload";
import axios from "axios";
import { apiUrl } from "../lib/api";

const initialFormData = {
  businessName: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  panNumber: "",
  citizenshipNumber: "",
  description: "",
  ctznShipFile: null,
  panFile: null,
};

export default function BecomeAgent() {
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [fileResetKey, setFileResetKey] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = (form) => {
    // Reset all React state
    setFormData(initialFormData);

    // Reset native form inputs
    form.reset();

    // Reset password visibility
    setShowPassword(false);

    // Tell AgentFile components to clear themselves
    setFileResetKey((prev) => prev + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!(formData.ctznShipFile && formData.panFile)) {
      return alert("Incomplete Photo Upload");
    }

    const data = new FormData();

    data.append("businessName", formData.businessName);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("panNumber", formData.panNumber);
    data.append("citizenshipNumber", formData.citizenshipNumber);
    data.append("description", formData.description);

    data.append("ctznShipFile", formData.ctznShipFile);
    data.append("panFile", formData.panFile);

    try {
      await axios.post(apiUrl("/api/agent/register"), data);

      console.log("Application submitted successfully");
      resetForm(event.target);
    } catch (e) {
      console.log(e);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#de873c] focus:ring-2 focus:ring-[#de873c]/20";

  const labelClass = "mb-2 block text-sm font-medium text-slate-300";

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(222,135,60,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_26%),linear-gradient(135deg,#08111f_0%,#0f1724_45%,#111827_100%)]" />

        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#de873c]/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />

        {/* Main Card */}
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl overflow-hidden rounded-4xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT */}
          <div className="relative flex flex-col overflow-hidden border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <div className="pointer-events-none absolute left-1/2 top-[38%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#de873c]/10 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#de873c]/20 bg-[#de873c]/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#de873c]">
                <Building2 className="h-3.5 w-3.5" />
                Agent Program
              </div>
            </div>

            <div className="relative z-10 flex flex-1 items-center justify-center py-10 sm:py-12 lg:py-8">
              <img
                src="/agent.svg"
                alt="Become an agent"
                className="h-auto w-full max-w-[420px] object-contain drop-shadow-2xl sm:max-w-[480px] lg:max-w-[500px]"
              />
            </div>

            <div className="relative z-10">
              <h1 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px] lg:leading-[1.1]">
                Grow your business
                <span className="block text-[#de873c]">as our agent.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Join our network of trusted agents and connect customers with
                our services. Submit your application and our team will review
                your details.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#de873c]/10 text-sm font-semibold text-[#de873c]">
                    ✓
                  </span>

                  <span className="text-sm text-slate-300">
                    Expand your business
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#de873c]/10 text-sm font-semibold text-[#de873c]">
                    ✓
                  </span>

                  <span className="text-sm text-slate-300">
                    Reach more customers
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#de873c]/10 text-sm font-semibold text-[#de873c]">
                    ✓
                  </span>

                  <span className="text-sm text-slate-300">
                    Access agent resources
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-6 sm:p-10 lg:p-12 xl:p-14">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#de873c]">
                  <FileText className="h-4 w-4" />
                  Registration
                </div>

                <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  Agent Application
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Provide your details below to submit your agent application.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Business Information */}
                <section>
                  <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                    <Building2 className="h-4 w-4 text-[#de873c]" />

                    <h3 className="text-sm font-semibold text-slate-200">
                      Business Information
                    </h3>
                  </div>

                  <label className="block">
                    <span className={labelClass}>
                      Business Name <span className="text-[#de873c]">*</span>
                    </span>

                    <input
                      name="businessName"
                      type="text"
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </label>
                </section>

                {/* Personal Information */}
                <section>
                  <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                    <User className="h-4 w-4 text-[#de873c]" />

                    <h3 className="text-sm font-semibold text-slate-200">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>
                        First Name <span className="text-[#de873c]">*</span>
                      </span>

                      <input
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className={labelClass}>
                        Last Name <span className="text-[#de873c]">*</span>
                      </span>

                      <input
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <label className="mt-5 block">
                    <span className={labelClass}>
                      Email Address <span className="text-[#de873c]">*</span>
                    </span>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </label>

                  {/* Password */}
                  <label className="mt-5 block">
                    <span className={labelClass}>
                      Password <span className="text-[#de873c]">*</span>
                    </span>

                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={8}
                        required
                        autoComplete="new-password"
                        className={`${inputClass} pl-11 pr-12`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-[#de873c]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <span className="mt-1.5 block text-xs text-slate-500">
                      Password must be at least 8 characters.
                    </span>
                  </label>
                </section>

                {/* Identification */}
                <section>
                  <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                    <FileText className="h-4 w-4 text-[#de873c]" />

                    <h3 className="text-sm font-semibold text-slate-200">
                      Identification Details
                    </h3>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>
                        PAN Number <span className="text-[#de873c]">*</span>
                      </span>

                      <input
                        name="panNumber"
                        type="text"
                        placeholder="Enter PAN number"
                        value={formData.panNumber}
                        onChange={handleChange}
                        required
                        className={`${inputClass} uppercase`}
                      />
                    </label>

                    <label className="block">
                      <span className={labelClass}>
                        Citizenship Number{" "}
                        <span className="text-[#de873c]">*</span>
                      </span>

                      <input
                        name="citizenshipNumber"
                        type="text"
                        placeholder="Enter citizenship number"
                        value={formData.citizenshipNumber}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <AgentFile
                    label="Citizenship photo"
                    setFormData={setFormData}
                    name="ctznShipFile"
                    resetKey={fileResetKey}
                  />

                  <AgentFile
                    label="Pan Document"
                    setFormData={setFormData}
                    name="panFile"
                    resetKey={fileResetKey}
                  />
                </section>

                {/* Description */}
                <section>
                  <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                    <FileText className="h-4 w-4 text-[#de873c]" />

                    <h3 className="text-sm font-semibold text-slate-200">
                      About Your Business
                    </h3>
                  </div>

                  <label className="block">
                    <span className={labelClass}>
                      Business Description{" "}
                      <span className="text-[#de873c]">*</span>
                    </span>

                    <textarea
                      name="description"
                      rows={5}
                      placeholder="Tell us about your business, experience, and why you want to become an agent..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className={`${inputClass} resize-y`}
                    />
                  </label>
                </section>

                {/* Submit */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#de873c] px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-[#de873c]/10 transition hover:bg-[#c97532] focus:outline-none focus:ring-3 focus:ring-[#de873c]/50 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.99]"
                  >
                    Submit Application
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="mt-3 text-center text-xs text-slate-500">
                    <span className="text-[#de873c]">*</span> Required fields
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
