import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const qrRegionId = "qr-reader-region";

  const startScanner = async () => {
    setCameraError("");

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
      }

      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        setCameraError("No camera found on this device.");
        return;
      }

      const backCamera =
        cameras.find((camera) =>
          camera.label.toLowerCase().includes("back")
        ) || cameras[0];

      await html5QrCodeRef.current.start(
        backCamera.id,
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          await stopScanner();
          onScanSuccess(decodedText);
        },
        () => {
          // Ignore scan failure frames.
        }
      );

      setIsScanning(true);
    } catch (error) {
      setCameraError(
        error?.message ||
          "Unable to start camera. Please allow camera permission."
      );
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      }
    } catch (error) {
      console.log("Scanner stop error:", error);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="bg-white shadow rounded p-5">
      <h2 className="text-xl font-bold mb-4">Camera QR Scanner</h2>

      {cameraError && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {cameraError}
        </p>
      )}

      <div
        id={qrRegionId}
        ref={scannerRef}
        className="w-full max-w-md mx-auto mb-4"
      />

      <div className="flex gap-3">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Start Camera Scanner
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Stop Scanner
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-3">
        Allow camera permission and show the student QR coupon inside the box.
      </p>
    </div>
  );
};

export default QRScanner;