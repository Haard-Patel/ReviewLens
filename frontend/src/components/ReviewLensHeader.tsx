"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Moon,
  Search,
  Star,
  Sun,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "Reviews",
    href: "/reviews",
  },
  {
    label: "Sentiment",
    href: "/sentiment",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Ratings",
    href: "/ratings",
  },
];

function ReviewLensMark() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="reviewLensGradient"
          x1="7"
          y1="8"
          x2="35"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5FE3FF" />
          <stop offset="1" stopColor="#8B7CF6" />
        </linearGradient>

        <filter
          id="reviewLensGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            stdDeviation="2.5"
            result="blur"
          />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="21"
        cy="21"
        r="14"
        stroke="url(#reviewLensGradient)"
        strokeWidth="2.4"
        opacity="0.95"
        filter="url(#reviewLensGlow)"
      />

      <path
        d="M13.5 20.5C13.5 16.91 16.41 14 20 14H22.5C26.09 14 29 16.91 29 20.5V21.5C29 25.09 26.09 28 22.5 28H20C16.41 28 13.5 25.09 13.5 21.5V20.5Z"
        stroke="#5FE3FF"
        strokeWidth="1.6"
        opacity="0.9"
      />

      <circle
        cx="21"
        cy="21"
        r="4.2"
        fill="url(#reviewLensGradient)"
      />

      <path
        d="M30.5 30.5L35 35"
        stroke="#8B7CF6"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx="35.5"
        cy="35.5"
        r="2"
        fill="#32C997"
      />
    </svg>
  );
}

function ThemeToggle() {
  const savedTheme =
    typeof window !== "undefined" &&
    window.localStorage.getItem("reviewlens-theme");
  
  const [isLight, setIsLight] = useState(savedTheme === "light");
  
  useEffect(() => {
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    }
  }, [savedTheme]);

  function toggleTheme() {
    const nextIsLight = !isLight;

    document.documentElement.classList.toggle(
      "light",
      nextIsLight,
    );

    window.localStorage.setItem(
      "reviewlens-theme",
      nextIsLight ? "light" : "dark",
    );

    setIsLight(nextIsLight);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isLight
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
    >
      {isLight ? (
        <Moon
          size={17}
          strokeWidth={1.8}
          className="transition-transform duration-200 group-hover:rotate-12"
        />
      ) : (
        <Sun
          size={17}
          strokeWidth={1.8}
          className="transition-transform duration-200 group-hover:rotate-45"
        />
      )}
    </button>
  );
}

export default function ReviewLensHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="ReviewLens home"
            className="flex items-center"
          >
            <ReviewLensMark />
          </Link>

          <div className="leading-none">
            <Link
              href="/"
              className="block text-[17px] font-semibold tracking-[-0.025em]"
            >
              <span className="text-cyan-300">
                Review
              </span>
              <span className="text-indigo-300">
                Lens
              </span>
            </Link>

            <p className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)] sm:block">
              Customer insights
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search reviews"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] sm:flex"
          >
            <Search
              size={17}
              strokeWidth={1.8}
            />
          </button>

          <div className="hidden h-7 w-px bg-[var(--border)] sm:block" />

          <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 sm:flex">
            <BarChart3
              size={15}
              strokeWidth={1.8}
              className="text-cyan-400"
            />

            <span className="text-[11px] font-medium text-[var(--text-secondary)]">
              Analytics
            </span>
          </div>

          <div className="hidden h-7 w-px bg-[var(--border)] sm:block" />

          <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 sm:flex">
            <Star
              size={14}
              fill="currentColor"
              className="text-amber-400"
            />

            <span className="text-[11px] font-medium text-[var(--text-secondary)]">
              Customer voice
            </span>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}