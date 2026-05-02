import PdfViewer from "../PdfViewer";

const ApprovalPdfPreview = ({ pdfUrl, signaturePosition, onSelectSignaturePosition, heightClass = "h-[500px]" }) => (
  <div
    className={`${heightClass} bg-black rounded-2xl relative overflow-hidden cursor-crosshair`}
    onClick={onSelectSignaturePosition}
  >
    {pdfUrl && <PdfViewer fileUrl={pdfUrl} />}

    {signaturePosition && (
      <div
        style={{
          position: "absolute",
          left: signaturePosition.x,
          top: signaturePosition.y,
          width: signaturePosition.width,
          height: signaturePosition.height,
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
);

export default ApprovalPdfPreview;
