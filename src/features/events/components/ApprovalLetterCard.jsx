import React, { useEffect, useState } from "react";
import { approveLetter, getMySignature, signApproveLetter } from "../../../shared/api/approvalService";
import { buildServerFileUrl } from "../../../shared/api/fileUrl";
import { getResponsiblePerson } from "../../../shared/api/eventService";
import ApprovalLetterModal from "./ApprovalLetterModal";
import ApprovalLetterSummary from "./ApprovalLetterSummary";
import ApprovalPdfPreview from "./ApprovalPdfPreview";

const ApprovalLetterCard = ({ letter, onReject, onApprove }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [signaturePos, setSignaturePos] = useState(null);
  const [userSignature, setUserSignature] = useState(null);
  const [isResponsibleApprover, setIsResponsibleApprover] = useState(false);
  const [bookingConflict, setBookingConflict] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSameApprover = (currentApprover, responsiblePerson) => {
    if (!currentApprover || !responsiblePerson) return false;

    return ["id", "userId", "approverId", "regNumber", "email", "name"].some(
      (key) =>
        currentApprover[key] &&
        responsiblePerson[key] &&
        String(currentApprover[key]).toLowerCase() ===
          String(responsiblePerson[key]).toLowerCase()
    ) ||
      (currentApprover.regNumber &&
        responsiblePerson.responsiblePersonRegNumber &&
        String(currentApprover.regNumber).toLowerCase() ===
          String(responsiblePerson.responsiblePersonRegNumber).toLowerCase()) ||
      (currentApprover.name &&
        responsiblePerson.responsiblePersonName &&
        String(currentApprover.name).toLowerCase() ===
          String(responsiblePerson.responsiblePersonName).toLowerCase());
  };

  // ================= FETCH APPROVAL CONTEXT =================
  useEffect(() => {
    const fetchApprovalContext = async () => {
      if (!letter) return;

      setSignaturePos(null);
      setBookingConflict(null);

      try {
        const responsiblePerson = await getResponsiblePerson(letter.eventPlace);
        const responsibleApprover = isSameApprover(
          letter.currentApprover,
          responsiblePerson
        );

        setIsResponsibleApprover(responsibleApprover);

        if (responsibleApprover) {
          setUserSignature(null);
          setSignaturePos(null);
          return;
        }
      } catch (err) {
        console.error("Responsible approver check error:", err);
        setIsResponsibleApprover(false);
      }

      try {
        const signature = await getMySignature();
        setUserSignature(signature);
      } catch (err) {
        console.error("Signature load error:", err);
        setUserSignature(null);
      }
    };

    fetchApprovalContext();
  }, [letter]);

  // ================= APPROVE =================
  const handleFinalApprove = async () => {
    if (!isResponsibleApprover && !signaturePos) {
      alert("Please select signature position");
      return;
    }

    if (!isResponsibleApprover && !signatureUrl) {
      alert("Please configure your signature before approving");
      return;
    }

    try {
      setLoading(true);

      const remarks = remark || "Approved by lecturer";
      const data = isResponsibleApprover
        ? await approveLetter(letter.letterId, { remarks })
        : await signApproveLetter(letter.letterId, {
            signature: signaturePos,
            remarks,
          });

      if (data?.conflict) {
        setBookingConflict(data);
        return;
      }

      setRemark("");
      setSignaturePos(null);
      setBookingConflict(null);
      setShowApproveModal(false);

      if (onApprove) onApprove(letter.letterId, data);
    } catch (err) {
      console.error(err);
      const conflictData = err?.response?.data;

      if (conflictData?.conflict) {
        setBookingConflict(conflictData);
        return;
      }

      alert("Approval failed");
    } finally {
      setLoading(false);
    }
  };

  if (!letter) return null;

  const pdfUrl = buildServerFileUrl(letter.pdfPath);
  const signatureUrl = buildServerFileUrl(userSignature?.signatureImagePath);
  const openApproveModal = () => {
    setSignaturePos(null);
    setBookingConflict(null);
    setShowApproveModal(true);
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8">
        <ApprovalPdfPreview pdfUrl={pdfUrl} />

        <ApprovalLetterSummary
          letter={letter}
          onReject={onReject}
          onOpenApproveModal={openApproveModal}
        />
      </div>

      {/* ================= MODAL ================= */}
      {showApproveModal && (
        <ApprovalLetterModal
          pdfUrl={pdfUrl}
          remark={remark}
          signatureUrl={signatureUrl}
          signaturePosition={signaturePos}
          bookingConflict={bookingConflict}
          requiresSignature={!isResponsibleApprover}
          loading={loading}
          onRemarkChange={setRemark}
          onSelectSignaturePosition={signatureUrl ? setSignaturePos : undefined}
          onClose={() => setShowApproveModal(false)}
          onConfirm={handleFinalApprove}
        />
      )}
    </>
  );
};

export default ApprovalLetterCard;
