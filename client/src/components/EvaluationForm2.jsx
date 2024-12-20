import React, {useState} from 'react'
import './css/EvaluationForm2.css'
import { apiService } from "../services/apiService";


const EvaluationForm2 = ({newPlayerId}) => {

    const evaluationCriteria = [
      {id: 'Physicality', label: "Physicality",},
      {id: 'In_Posession', label: "In Posession",},
      {id: 'Out_of_Posession', label: "Out of Posession",},
      {id: 'Weakness', label: "Weakness",},
      {id: 'Summary', label: "Summary",}, 
    ];
    
      const [ratings, setRatings] = useState({});
    
      const handleChange = (e, criterionId) => {
        setRatings({
          ...ratings,
          [criterionId]: e.target.value,
          Player_id: newPlayerId,
        });
      };

      const [showDialog, setShowDialog] = useState(false);

      const handleDialog = () => {
        setShowDialog(true);

        // Automatically close the dialog after 2 seconds
        setTimeout(() => {
          setShowDialog(false);
        }, 2000);
      }
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await apiService.post('/evaluation/', ratings, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          handleDialog();
          } catch (error) {
            console.error('Error saving player:', error);
          }
      };

  return (
    <div className="survey-form">
      {showDialog && (
        <div className="dialogStyles">
          <div className="dialogContent">
            <p>Player Details Successfully Updated</p>
            <button onClick={() => setShowDialog(false)}>Close</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="evaluation-q">
          {evaluationCriteria.map((criterion)=> (
            <div className="question">
              <span>{criterion.label}</span>
              <textarea name={criterion.id} 
                id={criterion.id}
                rows={10}  
                cols={5}
                onChange={(e) => handleChange(e, criterion.id)} 
                required
              />
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button">
          Submit Evaluation
        </button>
      </form> 
    </div>

  )
}

export default EvaluationForm2