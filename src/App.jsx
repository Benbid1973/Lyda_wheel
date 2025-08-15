import React, { useMemo, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

const OPTIONS = [
  "Skatebord",
  "Gå i seng",
  "Se fjernsyn",
  "Symaskine",
  "Læse bog",
  "Tegne",
];

const LYDA_IMG = "/lyda.png";

const rand = (n) => Math.floor(Math.random() * n);

export default function App() {
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [history, setHistory] = useState([]);
  const controls = useAnimation();
  const wheelRef = useRef(null);

  const size = 280;
  const slices = useMemo(() => OPTIONS.length, []);
  const sliceAngle = 360 / slices;

  const launchConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const onSpin = async () => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
    setThinking(true);

    const winnerIndex = rand(slices);
    const fullTurns = 4 + rand(3);
    // Adjusted calculation so the pointer at top (0 degrees) matches the winner's center
    const target = fullTurns * 360 + (360 - (winnerIndex * sliceAngle + sliceAngle / 2));

    await controls.start({
      rotate: target,
      transition: { duration: 3.2, ease: [0.22, 1, 0.36, 1] },
    });

    await new Promise((r) => setTimeout(r, 800));

    const choice = OPTIONS[winnerIndex];
    setResult(choice);
    setHistory((h) => [choice, ...h].slice(0, 6));
    setSpinning(false);
    setThinking(false);
    launchConfetti();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 via-white to-pink-100 flex flex-col items-center">
      <div className="w-full max-w-[430px]">
        <div className="relative">
          <img
            src={LYDA_IMG}
            alt="Lyda"
            className="w-full object-cover h-64 rounded-b-3xl shadow-md"
          />
          <h1 className="absolute bottom-4 left-4 text-white text-3xl font-bold drop-shadow-lg">
            Hvad skal Lyda lave
          </h1>
        </div>

        <div className="mt-6 bg-white rounded-3xl shadow-lg p-6 mx-4">
          <div className="relative flex flex-col items-center">
            <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 z-10">
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-[14px] border-l-transparent border-r-transparent border-b-pink-600" />
            </div>

            <motion.div
              ref={wheelRef}
              animate={controls}
              initial={{ rotate: 0 }}
              className="rounded-full shadow-lg bg-white border border-zinc-200"
              style={{ width: size, height: size }}
            >
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-full">
                <g transform={`translate(${size / 2}, ${size / 2})`}>
                  {OPTIONS.map((label, i) => {
                    const start = (i * sliceAngle * Math.PI) / 180;
                    const end = ((i + 1) * sliceAngle * Math.PI) / 180;
                    const r = size / 2;
                    const x1 = Math.cos(start) * r;
                    const y1 = Math.sin(start) * r;
                    const x2 = Math.cos(end) * r;
                    const y2 = Math.sin(end) * r;
                    const largeArc = sliceAngle > 180 ? 1 : 0;
                    const fill = i % 2 === 0 ? "#ffe4e6" : "#fecdd3";

                    return (
                      <g key={i}>
                        <path
                          d={`M0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={fill}
                          stroke="#fda4af"
                        />
                        <text
                          x={(Math.cos((start + end) / 2) * r * 0.65).toFixed(2)}
                          y={(Math.sin((start + end) / 2) * r * 0.65).toFixed(2)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={13}
                          fill="#831843"
                          style={{ userSelect: "none" }}
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                  <circle r={32} fill="#db2777" />
                  <text x={0} y={-2} textAnchor="middle" fontSize={12} fill="#fff">LYDA</text>
                  <text x={0} y={12} textAnchor="middle" fontSize={10} fill="#fff">HJULET</text>
                </g>
              </svg>
            </motion.div>

            <button
              onClick={onSpin}
              disabled={spinning}
              className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 shadow-md border text-base font-medium bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {spinning ? "Spinner..." : "Spin the wheel"}
            </button>

            {thinking && (
              <div className="mt-4 flex items-center gap-2 text-pink-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Lyda tænker...</span>
              </div>
            )}

            {result && !thinking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="mt-6 w-full"
              >
                <div className="mx-auto w-full text-center bg-pink-50 border border-pink-200 rounded-2xl p-4 shadow-sm">
                  <p className="text-sm text-pink-600">Nu skal Lyda:</p>
                  <p className="text-2xl font-semibold mt-1 text-pink-800">{result}</p>
                </div>
              </motion.div>
            )}

            {history.length > 0 && (
              <div className="mt-6 w-full">
                <p className="text-xs uppercase tracking-wide text-pink-500 mb-2">Seneste valg</p>
                <ul className="grid grid-cols-2 gap-2">
                  {history.map((h, i) => (
                    <li key={i} className="text-sm bg-pink-50 border border-pink-200 rounded-xl px-3 py-2 text-center text-pink-800">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-pink-400 mt-8 text-center">© {new Date().getFullYear()} Hvad skal Lyda lave</p>
      </div>
    </div>
  );
}
