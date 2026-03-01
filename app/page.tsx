"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <Hero />
      <UploadSection />
      <HowItWorks />
      <FinalCTA />
    </main>
  );
}

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
      <div className="text-lg font-semibold tracking-tight">
        Portfolio Review Board
      </div>
      <div className="flex gap-6 text-sm text-white/70">
        <a href="#how" className="hover:text-white transition">How it works</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden"
    >
      <div className="absolute top-[-200px] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
        AI-powered design feedback
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          that helps you grow
        </span>
      </h1>

      <p className="relative mt-6 text-lg text-white/60 max-w-2xl leading-relaxed">
        Upload your design screenshot and get structured UX feedback
        across 5 key dimensions — with a score and actionable recommendations.
      </p>

      <motion.a
        href="#upload"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative mt-10 px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition"
      >
        Try it now →
      </motion.a>
    </motion.section>
  );
}

function UploadSection() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Please upload an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setAnalysis(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Please upload an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setAnalysis(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the actual base64 image
        body: JSON.stringify({ imageBase64: image }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <section
      id="upload"
      className="px-6 py-24 border-t border-white/10 bg-neutral-950"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Upload your design
        </h2>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className="cursor-pointer block p-10 border-2 border-dashed border-white/20 rounded-2xl hover:border-purple-500 transition text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {!image ? (
              <div className="space-y-3">
                <div className="text-4xl">↑</div>
                <p className="text-white/50">
                  Drag & drop or <span className="text-purple-400 underline">click to upload</span>
                </p>
                <p className="text-white/30 text-sm">PNG, JPG, WebP — max 10MB</p>
              </div>
            ) : (
              <img
                src={image}
                alt="Preview"
                className="max-h-96 mx-auto rounded-xl"
              />
            )}
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Action buttons */}
        {image && !analysis && (
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Design →"
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-white/20 hover:border-white/40 rounded-xl text-white/60 hover:text-white transition"
            >
              Clear
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="mt-10 text-center">
            <p className="text-white/40 text-sm">
              AI is reviewing your design across 5 dimensions…
            </p>
          </div>
        )}

        {/* Analysis results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 space-y-10"
          >
            {/* Score */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-7xl font-bold"
              >
                {analysis.score}
                <span className="text-3xl text-white/30">/100</span>
              </motion.div>
              <div className="text-white/50 mt-2 text-sm tracking-widest uppercase">
                Overall Design Score
              </div>
              {/* Score bar */}
              <div className="mt-4 max-w-xs mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.score}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>

            {/* Sections grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.sections?.map((section: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-sm">{section.title}</h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        section.status === "Good"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {section.status}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {section.feedback}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-3 text-sm tracking-widest uppercase text-white/40">
                Summary
              </h3>
              <p className="text-white/80 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Analyze again */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-white/20 hover:border-purple-500 rounded-xl text-white/60 hover:text-white transition text-sm"
              >
                Analyze another design →
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload a screenshot",
      desc: "Any design — app, website, landing page, or UI component.",
    },
    {
      num: "02",
      title: "AI analyzes 5 dimensions",
      desc: "Visual Hierarchy, Layout, Typography, Color & Contrast, UX Clarity.",
    },
    {
      num: "03",
      title: "Get your score + feedback",
      desc: "Specific, actionable recommendations — not generic advice.",
    },
  ];

  return (
    <section id="how" className="px-6 py-24 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          How it works
        </h2>
        <p className="mt-4 text-white/50 max-w-xl mx-auto">
          Structured AI evaluation across key UX dimensions.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          {steps.map((step) => (
            <div key={step.num} className="space-y-3">
              <div className="text-5xl font-bold text-white/10">{step.num}</div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-6 py-28 border-t border-white/10 bg-gradient-to-b from-black to-neutral-950 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Start improving your design today
        </h2>
        <p className="mt-6 text-white/60 text-lg">
          Structured feedback. Measurable growth.
        </p>
        <a
          href="#upload"
          className="inline-block mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition"
        >
          Upload your design →
        </a>
      </div>
    </section>
  );
}
