import React, { useEffect, useState } from "react";
import { getMySignature, signApproveLetter } from "../../api/approvalService";
import { buildServerFileUrl } from "../../api/fileUrl";
import ApprovalLetterModal from "./ApprovalLetterModal";
import ApprovalLetterSummary from "./ApprovalLetterSummary";
import ApprovalPdfPreview from "./ApprovalPdfPreview";

const ApprovalLetterCard = ({ letter, onReject, onApprove }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [signaturePos, setSignaturePos] = useState(null);
  const [userSignature, setUserSignature] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH SIGNATURE =================
  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const data = await getMySignature();
        setUserSignature(data);
      } catch (err) {
        console.error("Signature load error:", err);
        setUserSignature(null);
      }
    };

    fetchSignature();
  }, []);

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

      const data = await signApproveLetter(letter.letterId, payload);

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

  if (!letter) return null;

  const pdfUrl = buildServerFileUrl(letter.pdfPath);
  const signatureUrl = buildServerFileUrl(userSignature?.signatureImagePath);

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8">
        <ApprovalPdfPreview
          pdfUrl={pdfUrl}
          signaturePosition={signaturePos}
          onSelectSignaturePosition={handlePdfClick}
        />

        <ApprovalLetterSummary
          letter={letter}
          onReject={onReject}
          onOpenApproveModal={() => setShowApproveModal(true)}
        />
      </div>

      {/* ================= MODAL ================= */}
      {showApproveModal && (
        <ApprovalLetterModal
          pdfUrl={pdfUrl}
          remark={remark}
          signatureUrl={signatureUrl}
          signaturePosition={signaturePos}
          loading={loading}
          onRemarkChange={setRemark}
          onSelectSignaturePosition={handlePdfClick}
          onClose={() => setShowApproveModal(false)}
          onConfirm={handleFinalApprove}
        />
      )}
    </>
  );
};

export default ApprovalLetterCard;
