function ApproverItem({
    approver,
    index,
    roleMap,
    onRoleChange,
    onOrderChange,
    onRemove
}) {
    const isFirstApprover = index === 0 && approver.name && !Object.keys(roleMap).includes(approver.role);

    return (
        <div
            key={`${approver.role}-${index}`}
            className="group flex gap-3 items-center bg-white/5 border border-white/10 p-3 rounded-xl transition-all hover:bg-white/[0.08]"
        >
            {/* Step Number */}
            <div className="flex-shrink-0">
                <input
                    type="number"
                    value={approver.order}
                    onChange={(e) => onOrderChange(index, e.target.value)}
                    disabled={isFirstApprover}
                    className={`w-12 bg-[#050b1a] border border-white/10 rounded-lg p-2 text-center text-sm font-bold text-blue-400 focus:ring-1 focus:ring-blue-500 outline-none ${isFirstApprover ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                />
            </div>

            {/* Role Selection */}
            <div className="flex-1">
                {isFirstApprover ? (
                    <input
                        type="text"
                        value={approver.role}
                        disabled
                        className="w-full bg-[#1a2235] border border-blue-500/50 rounded-lg p-2 text-sm text-blue-400 font-semibold italic"
                    />
                ) : (
                    <select
                        value={approver.role}
                        onChange={(e) => onRoleChange(index, e.target.value)}
                        className="w-full bg-[#1a2235] border border-white/10 rounded-lg p-2 text-sm text-white outline-none cursor-pointer focus:border-blue-500/50"
                    >
                        {Object.keys(roleMap).map((role) => (
                            <option key={role} value={role} className="bg-[#0f172a] text-white">
                                {role}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Auto-filled Assignee Name */}
            <div className="flex-[1.5]">
                <input
                    value={approver.name || ""}
                    readOnly   // 🔥 IMPORTANT FIX
                    placeholder="Assignee Name"
                    className={`w-full bg-transparent border rounded-lg p-2 text-sm italic ${isFirstApprover
                            ? "border-blue-500/50 text-blue-300"
                            : "border-white/5 text-slate-400"
                        }`}
                />
            </div>

            {/* Remove Action */}
            <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={isFirstApprover}
                className={`p-2 transition-colors md:opacity-0 group-hover:opacity-100 ${isFirstApprover
                        ? "opacity-30 cursor-not-allowed text-slate-600"
                        : "text-slate-500 hover:text-red-400"
                    }`}
                title={isFirstApprover ? "Cannot remove first approver" : "Remove step"}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
            </button>
        </div>
    );
}

export default ApproverItem;
