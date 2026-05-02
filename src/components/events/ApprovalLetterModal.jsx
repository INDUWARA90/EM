import React from "react";
import { X, PenTool, MessageSquare, ShieldCheck, AlertCircle } from "lucide-react";
import ApprovalPdfPreview from "./ApprovalPdfPreview";

const ApprovalLetterModal = ({
  pdfUrl,
  remark,
  signatureUrl,
  signaturePosition,
  loading,
  onRemarkChange,
  onSelectSignaturePosition,
  onClose,
  onConfirm,
}) => {
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
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Step 2: Sign & Finalize</p>
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
              {!signaturePosition && (
                <span className="text-[10px] text-amber-400 font-bold animate-pulse flex items-center gap-1">
                  <AlertCircle size={12} /> Click on the page to place signature
                </span>
              )}
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
              <ApprovalPdfPreview
                pdfUrl={pdfUrl}
                signaturePosition={signaturePosition}
                onSelectSignaturePosition={onSelectSignaturePosition}
                heightClass="h-[550px]"
              />
            </div>
          </div>

          {/* Right Side: Approval Controls (4 cols) */}
          <div className="lg:col-span-4 p-8 flex flex-col bg-slate-900 overflow-y-auto">
            <div className="space-y-8 flex-1">
              
              {/* Signature Preview Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <PenTool size={16} className="text-blue-400" />
                  <h3 className="text-sm font-bold">Your Digital Signature</h3>
                </div>
                
                {signatureUrl ? (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <div className="relative bg-white h-28 rounded-xl p-4 flex items-center justify-center border border-slate-700/50">
                      <img src={signatureUrl} alt="signature" className="max-h-full object-contain mix-blend-multiply" />
                    </div>
                  </div>
                ) : (
                  <div className="h-28 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-center p-4">
                    <AlertCircle className="text-red-400 mb-2" size={20} />
                    <p className="text-xs text-red-400 font-medium">Signature not configured in settings.</p>
                  </div>
                )}
              </section>

              {/* Remarks Section */}
              <section className="space-y-3 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-slate-300">
                  <MessageSquare size={16} className="text-blue-400" />
                  <h3 className="text-sm font-bold">Approval Remarks</h3>
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
                disabled={loading || !signaturePosition || !signatureUrl}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm & Authenticate"
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