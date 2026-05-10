import { useCallback, useEffect, useRef, useState } from "react";
import PdfViewer from "../../../shared/ui/PdfViewer";

const SIGNATURE_WIDTH = 150;
const SIGNATURE_HEIGHT = 50;

const getPageIndex = (pageLayer) => {
  const testId = pageLayer.getAttribute("data-testid") || "";
  const match = testId.match(/core__page-layer-(\d+)/);

  return match ? Number(match[1]) : 0;
};

const getPageScale = (pageLayer) => {
  const scale = Number.parseFloat(
    window.getComputedStyle(pageLayer).getPropertyValue("--scale-factor")
  );

  return Number.isFinite(scale) && scale > 0 ? scale : 1;
};

const findPageLayerAtPoint = (container, clientX, clientY) => {
  const pageLayers = Array.from(
    container.querySelectorAll(".rpv-core__page-layer")
  );

  return pageLayers.find((pageLayer) => {
    const rect = pageLayer.getBoundingClientRect();

    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  });
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ApprovalPdfPreview = ({
  pdfUrl,
  signaturePosition,
  onSelectSignaturePosition,
  heightClass = "h-[500px]",
}) => {
  const containerRef = useRef(null);
  const [overlayStyle, setOverlayStyle] = useState(null);

  const updateOverlayStyle = useCallback(() => {
    const container = containerRef.current;

    if (!container || !signaturePosition) {
      setOverlayStyle(null);
      return;
    }

    const pageLayer = container.querySelector(
      `[data-testid="core__page-layer-${signaturePosition.pageIndex}"]`
    );

    if (!pageLayer) {
      setOverlayStyle(null);
      return;
    }

    const scale = getPageScale(pageLayer);
    const containerRect = container.getBoundingClientRect();
    const pageRect = pageLayer.getBoundingClientRect();

    setOverlayStyle({
      left: pageRect.left - containerRect.left + signaturePosition.x * scale,
      top: pageRect.top - containerRect.top + signaturePosition.y * scale,
      width: signaturePosition.width * scale,
      height: signaturePosition.height * scale,
    });
  }, [signaturePosition]);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(updateOverlayStyle);

    const container = containerRef.current;
    if (!container) {
      return () => window.cancelAnimationFrame(animationFrame);
    }

    const scrollParent = container.querySelector(".rpv-core__inner-pages");
    const resizeObserver = new ResizeObserver(updateOverlayStyle);

    resizeObserver.observe(container);
    if (scrollParent) {
      scrollParent.addEventListener("scroll", updateOverlayStyle);
    }
    window.addEventListener("resize", updateOverlayStyle);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      if (scrollParent) {
        scrollParent.removeEventListener("scroll", updateOverlayStyle);
      }
      window.removeEventListener("resize", updateOverlayStyle);
    };
  }, [updateOverlayStyle]);

  const handleClick = (event) => {
    if (!onSelectSignaturePosition || !containerRef.current) return;

    const pageLayer = findPageLayerAtPoint(
      containerRef.current,
      event.clientX,
      event.clientY
    );

    if (!pageLayer) return;

    const pageRect = pageLayer.getBoundingClientRect();
    const scale = getPageScale(pageLayer);
    const maxX = pageRect.width / scale - SIGNATURE_WIDTH;
    const maxY = pageRect.height / scale - SIGNATURE_HEIGHT;
    const x = clamp((event.clientX - pageRect.left) / scale, 0, maxX);
    const y = clamp((event.clientY - pageRect.top) / scale, 0, maxY);

    onSelectSignaturePosition({
      pageIndex: getPageIndex(pageLayer),
      x: Math.round(x),
      y: Math.round(y),
      width: SIGNATURE_WIDTH,
      height: SIGNATURE_HEIGHT,
      origin: "TOP_LEFT",
    });
  };

  return (
    <div
      ref={containerRef}
      className={`${heightClass} bg-black rounded-2xl relative overflow-hidden ${
        onSelectSignaturePosition ? "cursor-crosshair" : ""
      }`}
      onClick={handleClick}
    >
      {pdfUrl && <PdfViewer fileUrl={pdfUrl} />}

      {overlayStyle && (
        <div
          style={{
            position: "absolute",
            ...overlayStyle,
            border: "2px solid #3b82f6",
            background: "rgba(59,130,246,0.15)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            color: "#60a5fa",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          SIGN HERE
        </div>
      )}
    </div>
  );
};

export default ApprovalPdfPreview;
