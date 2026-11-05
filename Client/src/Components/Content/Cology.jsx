import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Cology.css";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Cology() {
  const { specSub } = useParams();
  const [cology, setCology] = useState([]);

  useEffect(() => {
    const singlesubject=async ()=>{
      try {
        const response=await fetch(`${API_BASE}/api/create`);
const data=await response.json();

if(!response.ok){
  alert(data||"This information isn't existed")
}
const listofInfo = data.customers;
        const singleInfo = listofInfo.filter(
          (spinfo) => spinfo.Link === specSub
        );
        setCology(singleInfo || []);

    }
    
       catch (error) {
        alert(error.message)
      }

      
    
    };
  singlesubject();
  }, [specSub]);

  // Handle PDF Download securely (Sends the token to the backend)
  const handlePdfDownload = async (pdfLink, fileName) => {
    try {
      const token = localStorage.getItem("token");
      
      // Assuming your database stores exactly: "Pharmacology-pdf"
      const response = await fetch(`${API_BASE}/api/${pdfLink}`, {
        headers: {
          "Authorization": `Bearer ${token}` // Pass the JWT token
        }
      });

      if (!response.ok) {
        return alert("Unauthorized or file not found. Please log in again.");
      }

      // Convert the response to a blob (binary large object)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and click it to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`; 
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };

  return (
    <div className='Cology'>
      {cology.map((singleInfo) => (
        <div key={singleInfo.Id}> {/* Key goes on the outer wrapper */}
          <div className='pharmacology'>
            <img src={singleInfo.img_url} alt={singleInfo.Link} />
          </div>
          
          <div className='descripition'>
            <h3>{singleInfo.Description || singleInfo.Descripition}</h3> {/* Fixed typo in DB column */}
            
            {/* PDF DOWNLOAD BUTTON */}
            <button 
              onClick={() => handlePdfDownload(singleInfo.Pdf_link, singleInfo.Link)}
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline", background: "none", border: "none" }}
            >
              Download {singleInfo.Link} PDF
            </button>

            <div>
              <a href={singleInfo.Exam_link} target="_blank" rel="noreferrer">Take Exam</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cology;