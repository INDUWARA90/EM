function ApproversHeader({ count }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">
        Approval Pipeline
      </h3>
      <span className="text-[10px] text-slate-500 font-medium">
        {count} Steps Defined
      </span>
    </div>
  );
}

export default ApproversHeader;
