import React, {useState, useEffect} from 'react'
import './css/EvaluationView.css'
import viteLogo from '/vite.svg';
import { apiService } from "../services/apiService.js";
import ExportStyledPDF from './ExportStyledPDF.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const EvaluationView = ({player}) => {

    const [ratings, setRatings] = useState([{}]);
    const [isRate, setIsRate] = useState(false);
    const [err, setErr] = useState();
    const [link, setLink] = useState({url: '', title: ''});
    const [linkList, setLinkList] = useState([]);

    const fetchPlayerLinks = async () =>{
        try{
            const search = `/players/getlinks/${player._id}/`;
            var linkSearch = await apiService.get(search);
            setLinkList(linkSearch.Link); 
        }catch (e){
            console.log("Error loading links: " + e);
        }
    } 

    useEffect(() => {
        //Fetch all players from the database
          const fetchEvaluation = async () => {
            try {
              const query = `/evaluation/${player._id}/`;
              const data = await apiService.get(query);
              setRatings(data);
              setIsRate(true);
            } catch (e) {
              setErr("Failed to load evaluation: " + e);
              console.log(err);
            }
          };
          fetchEvaluation();
          fetchPlayerLinks();
        }, []);
    
        const formatDate = (isoDate) => {
            const date = new Date(isoDate);
            return date.toLocaleDateString();  // This will format the date according to the user's locale
        };

        

        // const renderEvaluation = () => {
        
        //     const predefinedOrder = ["Physicality", "In_Posession", "Out_of_Posession", "Weakness", "Summary"];
            
        //     const evaluationArray = Object.values(ratings);


        //     const sortedEvaluationArray = evaluationArray.sort(
        //     (a, b) => predefinedOrder.indexOf(a.id) - predefinedOrder.indexOf(b.id)
        //     );

        //     const sortedEvaluationObject = Object.fromEntries(
        //     sortedEvaluationArray.map((item) => [item.id, item])
        //     );

        //     console.log("x" + sortedEvaluationObject);
        //     // Predefined order
            

        //     // Sort based on predefined order
        //     const sortedRatings = Object.entries(ratings).sort(
        //         ([keyA], [keyB]) => predefinedOrder.indexOf(keyA) - predefinedOrder.indexOf(keyB)
        //     );

        //     return Object.entries(ratings).map(([key, value]) => {
        //         const header = key.replace(/_/g, " ");
        //         if(!(key.toUpperCase() === "PLAYER_ID" || key.toUpperCase() === "_ID" || key.toUpperCase() === "NOTE")){
        //             return (
        //                 <div key={key} className="noteView">
        //                     <span>{header}</span>
        //                     <div className="noteValue">
        //                         {value}
        //                     </div>
        //                 </div>
        //             ); 
        //         }
                
        //     });
        // }

         // Handle changes for input fields
        
         const handleInputChange = (e) => {
            const { name, value } = e.target;
            setLink((prevData) => ({
            ...prevData,
            [name]: value,
            }));
        };

        const emptyLinkFields = () =>{
            setLink({url: "", title: ""});
        }

        const addLink = async (e) =>{
            e.preventDefault();
            
            try {
                const jsonData = {
                    url: link.url,
                    title: link.title 
                }
                const response = await apiService.put(`/players/addlink/${player._id}`, jsonData, {
                  headers: {
                    'Content-Type': "application/json",
                  },
                });
                fetchPlayerLinks();
                emptyLinkFields();
              } catch (error) {
                console.error('Error adding link:', error);
              }
            }

  return (
    <div className="view_wrapper">
        <div className="view_personal">
            <div className="personal_top">
                <div className="img">
                    <img src={player.Image} alt="" />
                </div>
                <h2>{player.First_name + " " + player.Last_name}</h2>
            </div>
            <div className="personal_btm">
                <div className="personal_detail">
                    <span>Date of Birth: </span>
                    <p>{formatDate(player.Date_of_Birth)}</p>
                </div>
                <div className="personal_detail">
                    <span>Prefered Foot: </span>
                    <p>{player.Preferred_Foot}</p>
                </div>
                <div className="personal_detail">
                    <span>Height: </span>
                    <p>{player.Height== "" ? "N/A" : `${player.Height} cm`}</p>
                </div>
                <div className="personal_detail">
                    <span>Position: </span>
                    <p>{player.Position}</p>
                </div>
                <div className="personal_detail">
                    <span>Nationality: </span>
                    <p>{player.Nationality}</p>
                </div>
                <div className="personal_detail">
                    <span>Club: </span>
                    <p>{player.Club}</p>
                </div>
                <div className="personal_detail">
                    <span>Scouted by: </span>
                    <p>{player.Scouted_By}</p>
                </div>
                <div className="personal_detail">
                    <span>Agent: </span>
                    <p>{player.Agent}</p>
                </div>
                <div className="personal_detail">
                    <span>Contract Length: </span>
                    <p>{player.Contract == null ? "N/A" : `Until ${player.Contract}`}</p>
                </div>
                <div className="personal_detail">
                    <span>Date Added: </span>
                    <p>{formatDate(player.Date_Added)}</p>
                </div>
            <ExportStyledPDF player={player} evaluation={ratings}/>    
            </div>
        </div>

        <div className="view_evaluation">
            <div className="player-evaluation">
            <h3>Evaluation Metrics</h3>
            <div  className="evaluation-metrics">
                
            <ul className="linkList">
                    <div className="noteView">
                        <span>Physicality</span>
                        <div className="noteValue">{ratings["Physicality"]}</div>
                     </div>                   
                    <div className="noteView">
                        <span>In Possession</span>
                        <div className="noteValue">{ratings["In_Possession"]}</div>
                     </div>                   
                    <div className="noteView">
                        <span>Out of Posession</span>
                        <div className="noteValue">{ratings["Out_of_Posession"]}</div>
                     </div>                   
                    <div className="noteView">
                        <span>Weakness</span>
                        <div className="noteValue">{ratings["Weakness"]}</div>
                     </div>                   
                    <div className="noteView">
                        <span>Summary</span>
                        <div className="noteValue">{ratings["Summary"]}</div>
                     </div>                   
                </ul>
            </div>
            </div>

            <div className="player-evaluation">
                {/* <div className="border" style={{borderTop: "solid 1px var(--text)"}}></div> */}
                <h4 className="links-header">Player Videos</h4>
                {/* <div className="border" style={{borderTop: "solid 1px var(--text)"}}></div> */}
                <form onSubmit={addLink} className="video-link">
                    <div className="link-input">
                        <input type="text" placeholder="Paste link here" value={link.url} name='url' onChange={handleInputChange} required className='xca'/>
                        <input type="text" placeholder="Title" value={link.title} name='title' onChange={handleInputChange} required/>
                    </div>
                    <button type="submit" className='addLink'>
                        <FontAwesomeIcon icon={faAdd}/>
                    </button>
                </form>
                
            </div>
        </div>
    </div>
  )
}

export default EvaluationView