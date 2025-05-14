import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import axios from 'axios';
import './QRPage.css'; // Import the CSS file

function QRPage() {
  const [fileName, setFileName] = useState('');
  const [uuid, setUUID] = useState('');
  const [status, setStatus] = useState('');
  const [medicineData, setMedicineData] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Load the background image from the public folder
  useEffect(() => {
    // In a real implementation, you would have your image in the public folder
    // and reference it directly. For this example, we're setting a placeholder
    // that would be replaced with the actual image path in production.
    setBackgroundImage('C:\Users\Swathi\Desktop\Vibha\MediScan\frontend\src\assets\backgroundmediscan.png');
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setStatus('📄 File selected: ' + file.name);
  };

  const handleScanQR = () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      setStatus('❌ Please select an image first');
      return;
    }

    setStatus('🔍 Scanning QR code...');
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0, img.width, img.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          const decodedUUID = code.data;
          setUUID(decodedUUID);
          setStatus('✅ QR decoded. Sending to backend...');
          axios.post('http://localhost:5000/qr', { qrUUID: decodedUUID })
.then((res) => {
           console.log('✅ Backend response:', res.data);
            setMedicineData(res.data);  
            setStatus('✅ Data received from backend!');
         })
           .catch((err) => {
  if (err.response) {
    if (err.response.status === 404) {
      console.error('❌ Fake medicine: UUID not found');
      setStatus('❌ Fake medicine: UUID not found');
    } else if (err.response.status === 400) {
      console.error('❌ Invalid UUID format');
      setStatus('❌ Invalid QR Code or UUID format');
    } else {
      console.error('❌ Unexpected backend error:', err.response.status);
      setStatus('❌ Server error. Please try again later.');
    }
  } else {
    console.error('❌ Network error:', err.message);
    setStatus('❌ Network error. Please check your connection.');
  }
});
        } 
        else {
          setUUID('');
          setStatus('❌ QR code not recognized.');
        }
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div 
      className="qr-page-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="qr-content">
        <h2 className="qr-title">MediScan QR</h2>
        
        <div className="file-input-container">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="file-input"
            style={{ display: 'none' }}
          />
          <div className="button-container">
            <button 
              type="button" 
              className="custom-button select-file-button" 
              onClick={triggerFileInput}
            >
              <span className="button-icon">📷</span>
              <span className="button-text">Select QR Image</span>
            </button>
            <button 
              type="button" 
              className="custom-button scan-button" 
              onClick={handleScanQR}
            >
              <span className="button-icon">🔍</span>
              <span className="button-text">Verify Medicine</span>
            </button>
          </div>
          {fileName && <p className="file-name">Selected: {fileName}</p>}
        </div>
        
        {status && (
          <p className={`status-message ${status.includes('✅') ? 'status-success' : status.includes('❌') ? 'status-error' : 'status-info'}`}>
            {status}
          </p>
        )}

        {/* Display the medicine information if available */}
        {medicineData && (
          <div className="medicine-info">
            <h3 className="qr-title">Medicine Details</h3>
            <table className="medicine-table">
              <tbody>
                <tr>
                  <td><strong>Medicine Name</strong></td>
                  <td>{medicineData.medicine_name}</td>
                </tr>
                <tr>
                  <td><strong>Ingredient</strong></td>
                  <td>{medicineData.ingredient}</td>
                </tr>
                <tr>
                  <td><strong>Use</strong></td>
                  <td>{medicineData.use}</td>
                </tr>
                <tr>
                  <td><strong>Side Effect</strong></td>
                  <td>{medicineData.side_effect}</td>
                </tr>
                <tr>
                  <td><strong>Price</strong></td>
                  <td>{medicineData.price}</td>
                </tr>
                <tr className="expiry-row">
                  <td><strong>Expiry Date</strong></td>
                  <td className="expiry-highlight">{medicineData.expiry_date}</td>
                </tr>
                <tr>
                  <td><strong>Status</strong></td>
                  <td><span className={`status-pill ${medicineData.status.toLowerCase().includes('valid') ? 'status-valid' : 'status-invalid'}`}>
                    {medicineData.status}
                  </span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden-canvas" />
      </div>
    </div>
  );
}

export default QRPage;