"use client";

import { useId } from "react";

interface WaxSealProps {
  size?: "mark" | "sm" | "md" | "lg" | "hero";
  stamp?: boolean;
  className?: string;
}

const sizes = {
  mark: "h-4 w-4",
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-[4.75rem] w-[4.75rem]",
  hero: "h-20 w-20 sm:h-24 sm:w-24",
};

export default function WaxSeal({
  size = "md",
  stamp = false,
  className = "",
}: WaxSealProps) {
  const uid = useId().replace(/:/g, "");

  return (
    <span
      className={`inline-flex shrink-0 ${stamp ? "animate-wax-stamp" : ""} ${className}`}
    >
      <svg
        className={`wax-seal ${sizes[size]}`}
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`wax-body-${uid}`} cx="36%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#C4544E" />
            <stop offset="38%" stopColor="#7C2D2A" />
            <stop offset="100%" stopColor="#4A1816" />
          </radialGradient>
          <radialGradient id={`wax-rim-${uid}`} cx="52%" cy="54%" r="48%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="#3A1210" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id={`wax-gloss-${uid}`} x1="24%" y1="14%" x2="62%" y2="58%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id={`wax-shadow-${uid}`} x="-20%" y="-10%" width="140%" height="150%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="3"
              floodColor="#3A1210"
              floodOpacity="0.35"
            />
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="7"
              floodColor="#3A1210"
              floodOpacity="0.18"
            />
          </filter>
        </defs>

        <g filter={`url(#wax-shadow-${uid})`}>
          <path
            d="M40 5.5c11.2.8 20.8 7.2 24.6 17.4 1.2 3.2 1.9 6.6 1.9 10.2 0 2.8-.5 5.5-1.5 8 3.2 3.4 5.2 7.8 5.2 12.8 0 11.2-9.8 20.6-22.2 20.6S6.8 55.1 6.8 43.9c0-5 2-9.4 5.2-12.8-1-2.5-1.5-5.2-1.5-8 0-3.6.7-7 1.9-10.2C16.2 12.7 25.8 6.3 37 5.5c1-.1 2-.2 3-.2s2 .1 3 .2Z"
            fill={`url(#wax-body-${uid})`}
          />
          <path
            d="M40 5.5c11.2.8 20.8 7.2 24.6 17.4 1.2 3.2 1.9 6.6 1.9 10.2 0 2.8-.5 5.5-1.5 8 3.2 3.4 5.2 7.8 5.2 12.8 0 11.2-9.8 20.6-22.2 20.6S6.8 55.1 6.8 43.9c0-5 2-9.4 5.2-12.8-1-2.5-1.5-5.2-1.5-8 0-3.6.7-7 1.9-10.2C16.2 12.7 25.8 6.3 37 5.5c1-.1 2-.2 3-.2s2 .1 3 .2Z"
            fill={`url(#wax-rim-${uid})`}
          />
          <ellipse
            cx="31"
            cy="24"
            rx="14"
            ry="8.5"
            fill={`url(#wax-gloss-${uid})`}
            transform="rotate(-16 31 24)"
          />

          <path
            d="M30 56c-1.8 2.6-3.6 4.6-5.8 6 2.2 1 4.8 1.5 7.8 1.5h15.8c3 0 5.6-.5 7.8-1.5-2.2-1.4-4-3.4-5.8-6"
            fill="#4A1816"
            fillOpacity="0.62"
          />
          <path
            d="M32.5 54.5c-1.2 1.8-2.4 3.2-4 4.2 1.4.6 3.1 1 5 1h11c1.9 0 3.6-.4 5-1-1.6-1-2.8-2.4-4-4.2"
            fill="#6B2522"
            fillOpacity="0.75"
          />
          <path
            d="M22 62c2.5 2.2 5.8 3.5 9.5 3.8M58 62c-2.5 2.2-5.8 3.5-9.5 3.8"
            stroke="#4A1816"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          <circle
            cx="40"
            cy="36"
            r="16"
            stroke="#FFFFFF"
            strokeOpacity="0.1"
            strokeWidth="0.9"
          />
          <circle
            cx="40"
            cy="36"
            r="13"
            stroke="#FFFFFF"
            strokeOpacity="0.07"
            strokeWidth="0.6"
          />

          <text
            x="40"
            y="43"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="22"
            fontWeight="700"
            fill="#3A1210"
            fillOpacity="0.28"
            transform="translate(0.6, 1.2)"
          >
            K
          </text>
          <text
            x="40"
            y="43"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="22"
            fontWeight="700"
            fill="#FFFFFF"
            fillOpacity="0.34"
          >
            K
          </text>
        </g>
      </svg>
    </span>
  );
}
