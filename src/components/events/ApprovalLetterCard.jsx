import React, { useEffect, useState } from "react";
import PdfViewer from "../PdfViewer";
import { CheckCircle2, XCircle } from "lucide-react";

const ApprovalLetterCard = ({ letter, onReject, onApprove }) => {
  if (!letter) return null;

  const BASE_URL = "http://localhost:8081";

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [signaturePos, setSignaturePos] = useState(null);
  const [userSignature, setUserSignature] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FIXED PDF URL (NO DOUBLE SLASH) =================
  const cleanPath = (path) => {
    if (!path) return "";
    return path.startsWith("/") ? path : `/${path}`;
  };

  const pdfUrl = letter?.pdfPath
    ? `${BASE_URL}${cleanPath(letter.pdfPath).replace("../", "")}`
    : null;

  // ================= FETCH SIGNATURE =================
  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/signature/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load signature");

        const data = await res.json();
        setUserSignature(data);
      } catch (err) {
        console.error("Signature load error:", err);
        setUserSignature(null);
      }
    };

    fetchSignature();
  }, []);

  const signatureUrl = userSignature?.signatureImagePath
    ? `${BASE_URL}${cleanPath(userSignature.signatureImagePath)}`
    : null;

  // ================= CLICK POSITION =================
  const handlePdfClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setSignaturePos({
      pageIndex: 0,
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
      width: 150,
      height: 50,
      origin: "TOP_LEFT",
    });
  };

  // ================= ONLY SIGN-APPROVE API =================
  const handleFinalApprove = async () => {
    if (!signaturePos) {
      alert("Please select signature position");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        signature: signaturePos,
        remarks: remark || "Approved by lecturer",
      };

      const res = await fetch(
        `${BASE_URL}/api/letter/${letter.letterId}/sign-approve`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("ERROR:", text);
        throw new Error("Sign approval failed");
      }

      const data = await res.json();

      setRemark("");
      setSignaturePos(null);
      setShowApproveModal(false);

      if (onApprove) onApprove(letter.letterId, data);
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8">

        {/* PDF */}
        <div
          className="h-[500px] bg-black rounded-2xl relative overflow-hidden cursor-crosshair"
          onClick={handlePdfClick}
        >
          {pdfUrl && <PdfViewer fileUrl={pdfUrl} />}

          {signaturePos && (
            <div
              style={{
                position: "absolute",
                left: signaturePos.x,
                top: signaturePos.y,
                width: signaturePos.width,
                height: signaturePos.height,
                border: "2px solid #3b82f6",
                background: "rgba(59,130,246,0.15)",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: "#60a5fa",
                fontWeight: "bold",
              }}
            >
              SIGN HERE
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-black">{letter.title}</h2>
            <p className="text-slate-400 mt-2">{letter.description}</p>

            <div className="mt-4 p-3 bg-blue-600/20 rounded-xl">
              Current Approver: {letter.currentApprover?.name}
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              onClick={() => onReject(letter.letterId)}
              className="flex-1 bg-slate-800 p-4 rounded-xl"
            >
              <XCircle size={16} /> Reject
            </button>

            <button
              onClick={() => setShowApproveModal(true)}
              className="flex-1 bg-blue-600 p-4 rounded-xl"
            >
              <CheckCircle2 size={16} /> Approve
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-slate-900 w-[90%] max-w-6xl rounded-2xl p-6">

            <h2 className="text-xl font-bold mb-4 text-white">
              Approve Letter
            </h2>

            <div className="grid grid-cols-2 gap-6">

              {/* PDF */}
              <div
                className="h-[450px] relative bg-black rounded-xl overflow-hidden cursor-crosshair"
                onClick={handlePdfClick}
              >
                {pdfUrl && <PdfViewer fileUrl={pdfUrl} />}
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col">

                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-2">
                    My Signature
                  </p>

                  {signatureUrl ? (
                    <img
                      src={signatureUrl}
                      alt="signature"
                      className="h-24 bg-white rounded-lg p-2"
                    />
                  ) : (
                    <p className="text-red-400 text-xs">
                      No signature found
                    </p>
                  )}
                </div>

                <label className="text-xs text-slate-400 mb-2">
                  Remark
                </label>

                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-slate-800 text-white"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 bg-slate-700 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleFinalApprove}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 rounded-xl disabled:opacity-50"
              >
                {loading ? "Approving..." : "Confirm Approve"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ApprovalLetterCard;