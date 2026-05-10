function BackgroundImagePicker({ onChange, previewUrl }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
        Background Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-emerald-500"
      />
      {previewUrl && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
          <img src={previewUrl} alt="Selected background preview" className="w-full h-52 object-cover" />
        </div>
      )}
    </div>
  );
}

export default BackgroundImagePicker;
