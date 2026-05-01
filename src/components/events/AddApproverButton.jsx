function AddApproverButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-xl text-slate-400 text-sm font-medium hover:bg-white/5 hover:border-blue-500/50 hover:text-blue-400 transition-all"
    >
      <span className="text-lg">+</span> Add Extra Approval Step
    </button>
  );
}

export default AddApproverButton;
