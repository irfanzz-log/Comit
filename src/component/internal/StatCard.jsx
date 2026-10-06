import Icon from "@/component/internal/Icon";

const VARIANT_STYLES = {
    gray: "bg-gray-50 text-gray-600 ring-gray-200",
    blue: "bg-blue-50 text-blue-600 ring-blue-200",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    red: "bg-red-50 text-red-600 ring-red-200",
    yellow: "bg-amber-50 text-amber-600 ring-amber-200",
    purple: "bg-violet-50 text-violet-600 ring-violet-200",
};

export default function StatCard({ title, value, subtitle, icon, variant = "gray", loading = false }) {
    const style = VARIANT_STYLES[variant] || VARIANT_STYLES.gray;

    return (
        <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                    {loading ? (
                        <div className="mt-2 h-8 w-24 rounded-lg bg-gray-100 animate-pulse" />
                    ) : (
                        <p className="mt-1 text-2xl font-bold text-gray-900 truncate">{value}</p>
                    )}
                </div>
                {icon ? (
                    <span className={`shrink-0 p-2.5 rounded-xl ring-1 ${style}`}>
                        <Icon name={icon} size={18} />
                    </span>
                ) : null}
            </div>
            {subtitle ? <p className="mt-2 text-xs text-gray-500 truncate">{subtitle}</p> : null}
        </div>
    );
}
