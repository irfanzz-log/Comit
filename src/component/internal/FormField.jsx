const BASE_INPUT =
    "w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed";

export function TextField({ label, hint, error, id, className = "", containerClassName = "", ...props }) {
    const inputId = id || props.name;

    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label ? (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            ) : null}
            <input id={inputId} className={`${BASE_INPUT} ${error ? "border-red-400" : ""} ${className}`} {...props} />
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            {hint && !error ? <p className="text-xs text-gray-500">{hint}</p> : null}
        </div>
    );
}

export function TextArea({ label, hint, error, id, className = "", containerClassName = "", rows = 4, ...props }) {
    const inputId = id || props.name;

    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label ? (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            ) : null}
            <textarea
                id={inputId}
                rows={rows}
                className={`${BASE_INPUT} resize-y ${error ? "border-red-400" : ""} ${className}`}
                {...props}
            />
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            {hint && !error ? <p className="text-xs text-gray-500">{hint}</p> : null}
        </div>
    );
}

export function SelectField({ label, hint, error, id, options = [], containerClassName = "", className = "", ...props }) {
    const inputId = id || props.name;

    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label ? (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            ) : null}
            <select id={inputId} className={`${BASE_INPUT} ${error ? "border-red-400" : ""} ${className}`} {...props}>
                {options.map((opt) => {
                    const value = typeof opt === "string" ? opt : opt.value;
                    const label = typeof opt === "string" ? opt : opt.label;
                    return (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    );
                })}
            </select>
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            {hint && !error ? <p className="text-xs text-gray-500">{hint}</p> : null}
        </div>
    );
}
