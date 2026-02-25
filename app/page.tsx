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
      <ExampleReview />
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
        <a href="#" className="hover:text-white transition">How it works</a>
        <a href="#" className="hover:text-white transition">Dashboard</a>
        <a href="#" className="hover:text-white transition">Login</a>
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
      className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden"
    >
      <div className="absolute top-[-200px] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />

      <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
        AI-powered design feedback
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          that helps you grow
        </span>
      </h1>

      <p className="relative mt-6 text-lg text-white/60 max-w-2xl leading-relaxed">
        Upload your design screenshot and get structured UX feedback
        with actionable insights.
      </p>
    </motion.section>
  );
}

function UploadSection() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
      });

      const data = await response.json();
      setAnalysis(data);
    } catch {
      alert("Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-6 py-24 border-t border-white/10 bg-neutral-950">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-3xl font-bold">
          Upload your design
        </h2>

        <div className="mt-10">

          <label className="cursor-pointer block p-10 border-2 border-dashed border-white/20 rounded-2xl hover:border-purple-500 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {!image ? (
              <span className="text-white/50">
                Click to upload screenshot
              </span>
            ) : (
              <img
                src={image}
                alt="Preview"
                className="max-h-96 mx-auto rounded-xl"
              />
            )}
          </label>

          {image && (
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl font-medium transition"
            >
              {isLoading ? "Analyzing..." : "Analyze Design"}
            </button>
          )}

          {analysis && (
            <div className="mt-16 space-y-10 text-left">

              {/* Score */}
              <div className="text-center">
                <div className="text-6xl font-bold">
                  {analysis.score}/100
                </div>
                <div className="text-white/50 mt-2">
                  Overall Portfolio Score
                </div>
              </div>

              {/* Sections */}
              <div className="grid md:grid-cols-2 gap-6">
                {analysis.sections.map((section: any, index: number) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">
                        {section.title}
                      </h3>

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

                    <p className="text-white/70 text-sm leading-relaxed">
                      {section.feedback}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-4">
                  Summary
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="px-6 py-24 border-t border-white/10 bg-neutral-950 text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          How it works
        </h2>

        <p className="mt-4 text-white/60 max-w-2xl mx-auto">
          Structured AI evaluation across key UX dimensions.
        </p>
      </div>
    </section>
  );
}

function ExampleReview() {
  return null;
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

      </div>
    </section>
  );
}