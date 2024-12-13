import React, { useState , useEffect} from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './css/ExportFilteredData.css'
import logo from '/chelsea.png';


const PlayerListPDF = ({players, gotoDash}) => {
  const [userText, setUserText] = useState('');
  const [data, setData] = useState([]); // State for storing the filtered results
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
        return date.toLocaleDateString();  // This will format the date according to the user's locale
    };

    const handleEmptyFields = (field) =>{
        return field.length === 0 ? "N/A" : field;
    }

    useEffect(()=>{
        setData(players);
    }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    setData(players);
    // console.log(data);
    
    // Adding Image to PDF
    doc.addImage(logo, "JPEG", 40, 13, 20, 20);

    const startX = 105;
    const startY = 20;

    // Title and Subtitle
    doc.setFontSize(25);
    doc.setTextColor(60);
    doc.text("Achirou Elite Scouting", startX, startY, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Comprehensive Filter Report`, startX, startY + 10, { align: "center" });

    // Divider
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 35, 190, 35);

    // Add user-entered text to the PDF
    doc.setFontSize(12);
    doc.text(`Report Description: ${userText}` || 'No additional notes provided.', 14, 45);

    // Add a table with player data
    doc.autoTable({
      startY: 60, // Start below the user text
      head: [['#', 'Name', 'Date of Birth', 'Position', 'Nationality', 'Scouted By', 'Status']],
      headStyles: { fillColor: [10, 10, 10], textColor: 255, fontSize: 14 },
      bodyStyles: { fontSize: 10 },
      styles: { halign: "center" },
      body: data.map((player, index) => [
        index.length != 0 ? Number(index) + 1 : '1',
        `${player.First_name} ${player.Last_name}`,
        formatDate(player.Date_of_Birth),
        handleEmptyFields(player.Position),
        handleEmptyFields(player.Nationality),
        handleEmptyFields(player.Scouted_By),
        handleEmptyFields(player.Status),
      ]),
    });

    // Save the PDF
    doc.save('Achirou Elite Scouting Summary Report.pdf');
    gotoDash();
  };

  return (
    <div className='export_wrapper'>
        <div className="export_overlay"></div>
      <h1>Generate Summary Report</h1>

      <textarea
        rows="4"
        cols="50"
        placeholder="Enter filter description..."
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        style={{ marginBottom: '10px', padding: '10px', width: '100%' }}
      />

      <button onClick={
        ()=>{
          generatePDF(players);

        }
        } style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Generate PDF
      </button>
    </div>
  );
};

export default PlayerListPDF;
