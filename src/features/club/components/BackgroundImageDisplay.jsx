function BackgroundImageDisplay({ imageUrl }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
        Background Image
      </p>
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Current club background"
            className="w-full h-52 object-cover"
          />
        ) : (
          <div className="h-40 flex items-center justify-center text-sm text-slate-500">
            No background image uploaded.
          </div>
        )}
      </div>
    </div>
  );
}

export default BackgroundImageDisplay;
