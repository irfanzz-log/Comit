export default function PageContainer({ title, subtitle, actions, children, className = "" }) {
    return (
        <section
            className={`relative w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ${className}`}
        >
            <header className="border-b border-gray-100 bg-white/70 backdrop-blur-sm w-full px-5 py-4 flex flex-row justify-between items-center gap-3">
                <div className="min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
                    {subtitle ? (
                        <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex items-center gap-2 shrink-0">{actions}</div>
                ) : null}
            </header>

            <div className="p-5 md:p-6 space-y-6">{children}</div>
        </section>
    );
}
