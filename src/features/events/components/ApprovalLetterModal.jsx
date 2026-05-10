import React, { useEffect, useRef, useState } from "react";
import {
  X,
  PenTool,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  CalendarClock,
  MapPin,
  Upload,
  Eraser,
  Check,
} from "lucide-react";
import ApprovalPdfPreview from "./ApprovalPdfPreview";

const ApprovalLetterModal = ({
  pdfUrl,
  remark,
  signatureUrl,
  signatureSource,
  signaturePosition,
  bookingConflict,
  requiresSignature = true,
  loading,
  onRemarkChange,
  onSignatureChange,
  onSelectSignaturePosition,
  onClose,
  onConfirm,
}) => {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const fileInputRef = useRef(null);
  const [hasInk, setHasInk] = useState(false);
  const [activeSignatureTab, setActiveSignatureTab] = useState("upload");

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(ratio, ratio);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.2;
  };

  useEffect(() => {
    if (activeSignatureTab === "draw") {
      initCanvas();
    }
  }, [activeSignatureTab]);

  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDraw = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const point = getCanvasPoint(event);
    if (!point) return;

    drawingRef.current = true;
    canvas.setPointerCapture?.(event.pointerId);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    event.preventDefault();
  };

  const draw = (event) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const point = getCanvasPoint(event);
    if (!point) return;

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    setHasInk(true);
    event.preventDefault();
  };

  const stopDraw = (event) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    event.preventDefault();
  };

  const clearDrawingPad = () => {
    initCanvas();
    setHasInk(false);
  };

  const useDrawingAsSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasInk) {
      alert("Please draw your signature first.");
      return;
    }

    const dataUrl = canvas.toDataURL("image/png");
    onSignatureChange?.({ dataUrl, source: "draw" });
  };

  const triggerFilePicker = () => fileInputRef.current?.click();

  const convertImageFileToPngDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const rawDataUrl = typeof reader.result === "string" ? reader.result : null;
        if (!rawDataUrl) {
          reject(new Error("Unable to read signature file"));
          return;
        }

        const image = new Image();
        image.onload = () => {
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = Math.max(1, image.naturalWidth || image.width);
          tempCanvas.height = Math.max(1, image.naturalHeight || image.height);

          const context = tempCanvas.getContext("2d");
          if (!context) {
            reject(new Error("Unable to process signature image"));
            return;
          }

          context.drawImage(image, 0, 0);
          resolve(tempCanvas.toDataURL("image/png"));
        };
        image.onerror = () => reject(new Error("Invalid signature image"));
        image.src = rawDataUrl;
      };

      reader.onerror = () => reject(new Error("Unable to read signature file"));
      reader.readAsDataURL(file);
    });

  const onUploadSignature = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await convertImageFileToPngDataUrl(file);
      onSignatureChange?.({ dataUrl, source: "upload" });
    } catch (error) {
      console.error(error);
      alert("Could not process signature image. Please try another file.");
    }

    event.target.value = "";
  };

  const clearAttachedSignature = () => {
    onSignatureChange?.({ dataUrl: null, source: null });
  };

  const canPlaceSignature = requiresSignature && Boolean(signatureUrl);
  const conflicts = Array.isArray(bookingConflict?.conflicts)
    ? bookingConflict.conflicts
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-slate-900 border border-slate-700/50 w-full max-w-6xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ShieldCheck className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Authorize Document</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Side: PDF Preview (8 cols) */}
          <div className="lg:col-span-8 p-6 bg-slate-950/30 border-r border-slate-800 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Workspace</span>
              {canPlaceSignature && !signaturePosition && (
                <span className="text-[10px] text-amber-400 font-bold animate-pulse flex items-center gap-1">
                  <AlertCircle size={12} /> Click on the page to place signature
                </span>
              )}
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
              <ApprovalPdfPreview
                pdfUrl={pdfUrl}
                signatureImageUrl={canPlaceSignature ? signatureUrl : null}
                signaturePosition={canPlaceSignature ? signaturePosition : null}
                onSelectSignaturePosition={canPlaceSignature ? onSelectSignaturePosition : undefined}
                heightClass="h-[550px]"
              />
            </div>
          </div>

          {/* Right Side: Approval Controls (4 cols) */}
          <div className="lg:col-span-4 p-8 flex flex-col bg-slate-900 overflow-y-auto">
            <div className="space-y-8 flex-1">
              {bookingConflict?.conflict && (
                <section className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 shrink-0 text-amber-400" size={18} />
                    <div>
                      <h3 className="text-sm font-bold text-amber-200">Place Already Booked</h3>
                      <p className="mt-1 text-xs leading-relaxed text-amber-100/80">
                        {bookingConflict.message || "This place already has another event at the selected date and time."}
                      </p>
                    </div>
                  </div>

                  {conflicts.length > 0 && (
                    <div className="space-y-2">
                      {conflicts.map((conflict) => (
                        <div
                          key={`${conflict.calendarEventId || conflict.letterId}-${conflict.eventDate}-${conflict.eventTime}`}
                          className="rounded-lg border border-amber-400/20 bg-slate-950/40 p-3"
                        >
                          <p className="text-xs font-bold text-slate-100">{conflict.title || "Existing booking"}</p>
                          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-300">
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock size={12} className="text-amber-300" />
                              {conflict.eventDate} {conflict.eventTime?.slice(0, 5)} - {conflict.endTime?.slice(0, 5)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} className="text-amber-300" />
                              {conflict.placeName || "Same place"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
              
              {requiresSignature && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <PenTool size={16} className="text-blue-400" />
                    <h3 className="text-sm font-bold">Your Digital Signature</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSignatureTab("upload");
                        setHasInk(false);
                      }}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        activeSignatureTab === "upload"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700/70"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Upload size={13} />
                        Upload
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSignatureTab("draw");
                        setHasInk(false);
                      }}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        activeSignatureTab === "draw"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700/70"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <PenTool size={13} />
                        Draw
                      </span>
                    </button>
                  </div>

                  {activeSignatureTab === "upload" ? (
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onUploadSignature}
                      />
                      <button
                        type="button"
                        onClick={triggerFilePicker}
                        className="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-3 text-sm font-medium text-slate-100 hover:bg-slate-700 transition"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Upload size={14} />
                          Attach Signature Image
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-700 bg-slate-800 p-2">
                        <canvas
                          ref={canvasRef}
                          className="h-36 w-full touch-none rounded-lg bg-white"
                          onPointerDown={startDraw}
                          onPointerMove={draw}
                          onPointerUp={stopDraw}
                          onPointerLeave={stopDraw}
                          onPointerCancel={stopDraw}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={useDrawingAsSignature}
                          className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500 transition"
                        >
                          <span className="inline-flex items-center gap-1">
                            <Check size={13} />
                            Use Drawing
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={clearDrawingPad}
                          className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                        >
                          <span className="inline-flex items-center gap-1">
                            <Eraser size={13} />
                            Clear Pad
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {signatureUrl ? (
                    <div className="space-y-2">
                      <div className="relative bg-white h-28 rounded-xl p-4 flex items-center justify-center border border-slate-700/50">
                        <img src={signatureUrl} alt="signature" className="max-h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold">
                          Attached: {signatureSource === "draw" ? "Drawing" : "Uploaded image"}
                        </span>
                        <button
                          type="button"
                          onClick={clearAttachedSignature}
                          className="text-slate-400 hover:text-white transition"
                        >
                          Clear attached
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-14 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-400">
                      No signature attached yet
                    </div>
                  )}
                </section>
              )}

              {/* Remarks Section */}
              <section className="space-y-3 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-slate-300">
                  <MessageSquare size={16} className="text-blue-400" />
                  <h3 className="text-sm font-bold">Additional Description</h3>
                </div>
                <div className="flex-1 flex flex-col">
                  <textarea
                    value={remark}
                    onChange={(e) => onRemarkChange(e.target.value)}
                    placeholder="Add a reason or instruction for this approval..."
                    className="w-full flex-1 p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600 resize-none min-h-[120px]"
                  />
                </div>
              </section>
            </div>

            {/* Bottom Actions */}
            <div className="pt-8 flex flex-col gap-3">
              <button
                onClick={onConfirm}
                disabled={loading || (requiresSignature && (!signaturePosition || !signatureUrl))}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Approve Confirm"
                )}
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-3 text-slate-400 hover:text-white font-medium text-sm transition-colors"
              >
                Cancel and return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalLetterModal;
