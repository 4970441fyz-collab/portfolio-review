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
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden"
    >
      {/* Glow background */}
      <div className="absolute top-[-200px] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />

      <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
        AI-powered design feedback
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          that helps you grow
        </span>
      </h1>

      <p className="relative mt-6 text-lg text-white/60 max-w-2xl leading-relaxed">
        Upload your design screenshot and get structured feedback on
        composition, typography, color, accessibility and UX patterns.
      </p>

      <div className="relative mt-10 flex gap-4">
        <button className="px-8 py-4 bg-white text-black rounded-xl font-medium hover:opacity-90 transition">
          Try it now
        </button>

        <button className="px-8 py-4 border border-white/20 rounded-xl text-white/80 hover:bg-white/5 transition">
          See example
        </button>
      </div>
    </motion.section>
  );
}

function UploadSection() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
  
    setIsLoading(true);
    setResult(null);
  
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });
  
      const data = await response.json();
  
      setResult(data.result);
    } catch (error) {
      setResult("Analysis failed.");
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

          {result && (
            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 text-left text-white/80">
              {result}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="px-6 py-24 border-t border-white/10 bg-neutral-950">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          How it works
        </h2>

        <p className="mt-4 text-white/60 max-w-2xl mx-auto">
          Simple workflow. Powerful AI analysis. Structured feedback.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-10 text-left">

          <Step
            number="01"
            title="Upload your design"
            description="Drop a screenshot of your interface and add context about stage, goals and focus."
          />

          <Step
            number="02"
            title="AI analyzes everything"
            description="OpenAI Vision evaluates composition, typography, color, accessibility and UX patterns."
          />

          <Step
            number="03"
            title="Get structured feedback"
            description="Receive scores, radar charts and detailed recommendations to improve your design."
          />

        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="p-8 rounded-2xl bg-white/5 border border-white/10"
    >
      <div className="text-sm text-purple-400 font-medium">
        {number}
      </div>

      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-4 text-white/60 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function ExampleReview() {
  return (
    <section className="px-6 py-28 border-t border-white/10 bg-black">
      <div className="max-w-6xl mx-auto">

        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Example AI Review
          </h2>
          <p className="mt-4 text-white/60">
            Structured feedback with scores and actionable recommendations.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">

          {/* Screenshot preview */}
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
            <span className="text-white/40">
              Design Screenshot Preview
            </span>
          </div>

          {/* Score cards */} 
          
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
  className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-8"
>

  <div className="grid grid-cols-2 gap-6">
    <ScoreCard title="Composition" score={8} />
    <ScoreCard title="Typography" score={7} />
    <ScoreCard title="Color System" score={9} />
    <ScoreCard title="Accessibility" score={6} />
    <ScoreCard title="UX Patterns" score={8} />
  </div>

  <div className="border-t border-white/10 pt-6 text-sm text-white/70 leading-relaxed">
    <strong className="text-white">Main issue:</strong>  
    Spacing between sections is inconsistent. Consider increasing vertical rhythm 
    and improving hierarchy in secondary text styles.
  </div>

</motion.div>

        </div>
      </div>
    </section>
  );
}

function ScoreCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {

  const getColor = () => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">

      <div className="text-white/70">
        {title}
      </div>

      <div className={`text-2xl font-bold ${getColor()}`}>
        {score}/10
      </div>

    </div>
  );
}

function FinalCTA() {
  return (
    <section className="px-6 py-28 border-t border-white/10 bg-gradient-to-b from-black to-neutral-950">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Start improving your design today
        </h2>

        <p className="mt-6 text-white/60 text-lg">
          Upload your work. Get structured AI feedback. Track your growth.
        </p>

        <div className="mt-10">
          <button className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-semibold">
            Try Portfolio Review Board
          </button>
        </div>

      </div>
    </section>
  );
}
