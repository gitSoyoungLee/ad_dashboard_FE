function SummaryCard({ title, value, unit, tooltip }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 border-t-2 border-t-blue-500 p-5 flex flex-col gap-3 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative group/card hover:z-10">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pt-1">
        {title}
        {tooltip && (
          <span className="relative group/tip">
            <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-50 text-[10px] font-bold text-blue-400 cursor-help">?</span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 invisible opacity-0 group-hover/tip:visible group-hover/tip:opacity-100 transition-all duration-150 w-52 px-3 py-2.5 text-xs text-white bg-slate-800 rounded-lg shadow-xl normal-case tracking-normal leading-relaxed z-50 pointer-events-none">
              {tooltip}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </span>
          </span>
        )}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-extrabold text-slate-800">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

export default SummaryCard;
