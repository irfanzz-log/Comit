"use client";

import { Fragment } from "react";

/**
 * Dropdown filter sederhana (server-friendly: controlled by parent).
 */
export default function FilterDropdown({
    label,
    options = [],
    value,
    onChange,
    placeholder,
    align = "left",
}) {
    return (
        <div className="relative">
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none w-full px-3 py-2.5 pr-9 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
                aria-label={label}
            >
                {placeholder ? <option value="">{placeholder}</option> : null}
                {options.map((opt) => {
                    const val = typeof opt === "string" ? opt : opt.value;
                    const lbl = typeof opt === "string" ? opt : opt.label;
                    return (
                        <option key={val} value={val}>
                            {lbl}
                        </option>
                    );
                })}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </span>
        </div>
    );
}
