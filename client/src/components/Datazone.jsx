import React, {useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter , faRefresh, faUser, faTrash, faPencil, faFilePdf} from '@fortawesome/free-solid-svg-icons';
import { apiService } from "../services/apiService.js";

import './css/Datazone.css'
import './css/responsive/Datazone.css'
import EvaluationView from './EvaluationView.jsx';
import UpdateForm from './UpdateForm.jsx';
import ExportFilteredData from './ExportFilteredData.jsx';
import Flag from 'react-world-flags';

const Datazone = ({scoutName}) => {

  const [players, setPlayers] = useState([]);   //State for storing all players
  const [filteredData, setFilteredData] = useState([]); // State for storing the filtered results
  const [sortOrder, setSortOrder] = useState(true); // Ascending = true, Descending = false
  const [sortColumn, setSortColumn] = useState(null); // Track the sorted column
  const [searchValue, setSearchValue] = useState('');
  const [err, setErr] = useState('');
  const [dobFilter, setDobFilter]= useState({start: '', end: ''});
  const [hoveredClass, setHoveredClass] = useState('');

  //Fetch all players from the database      
  const fetchPlayers = async () => {
    try {
      const data = await apiService.get("/players/");
      setPlayers(data);
      setFilteredData(data);
    } catch (e) {
      setErr("Failed to load players: " + e);
      console.log(err);
    }
  };

  useEffect(() => {
    //Fetch all players from the database once page loads
      fetchPlayers();
    }, []);
    
      // Sorting function
      const sortTable = (column) => {
        const sortedPlayers = [...filteredData];
    
        sortedPlayers.sort((a, b) => {
          const aValue = a[column].toString().toLowerCase();
          const bValue = b[column].toString().toLowerCase();
    
          // Handle numeric sorting (Age)
          if (!isNaN(aValue) && !isNaN(bValue)) {
            return sortOrder ? aValue - bValue : bValue - aValue;
          }
    
          return sortOrder ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
    
        setFilteredData(sortedPlayers);
        setSortOrder(!sortOrder);
        setSortColumn(column);
      };
    
      // Render arrow based on the sorting order and sorted column
      const renderArrow = (column) => {
        if (sortColumn === column) {
          return sortOrder ? "▲" : "▼";
        }
        return "▲▼";
      };

      // Function to handle search name change
      const handleInputChange = (e) => {
        setSearchValue(e.target.value);
      };

      // Function to handle Enter key press
      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          // Perform action when Enter is pressed
          handleSearch();
        }
      };

      // Function to apply fuzzy search by name
      const applyNameSearch = (term) => {
        const result = players.filter(person => {
          const firstName = person.First_name; 
          const lastName = person.Last_name; // Split full name into first and last name
          const lowerCaseTerm = term.toLowerCase(); // Make the search term lowercase for case-insensitive matching
    
          return (
            firstName.toLowerCase().includes(lowerCaseTerm) || // Check if first name matches
            lastName.toLowerCase().includes(lowerCaseTerm)     // Check if last name matches
          );
        });

        setFilteredData(result);
      };

      const handleSearchFilter = (value) => {
        // const value = e.target.value.toLowerCase();
        setSearchValue(value);
    
        const filteredResults = players.filter((person) =>
          Object.values(person).some((field) =>
            String(field).toLowerCase().includes(value.toLowerCase())
          )
        );
    
        setFilteredData(filteredResults);
      };

      //handle Search name search
      const handleSearch = () => {
        // applyNameSearch(searchValue);
        handleSearchFilter(searchValue);
      };

      //handle refresh of dashboard
      const refreshFilter = () => {
        applyNameSearch('');
      };

      const [selectedPlayer, setSelectedPlayer] = useState();
      const [isVisible, setIsVisible] = useState(false); // State to control visibility
      const [isEvaView, setisEvaView] = useState(false); // State to control visibility
      const [isUpdateView, setIsUpdateView] = useState(false); // State to control visibility
      const [isExport, setIsExport] = useState(false); // State to control visibility
      const [yearFilterErr, setyearFilterErr] = useState();

      const filterRef = useRef(null); // Reference to the filter section
      const evaluationRef = useRef(null);
      const updateRef = useRef(null);
      const exportRef = useRef(null);
     

      // Function to toggle visibility when the button is clicked
      const toggleFilter = () => {
        setIsVisible((prev) => !prev);
      };

      //Show evaluation of player
      const showEvaluation = () => {
        setisEvaView((prev) => !prev);
      };

      //Show updateform for player
      const showUpadte = () => {
        setIsUpdateView((prev) => !prev);
      };

      //Show exportForm for player
      const showExport = () => {
        setIsExport((prev) => !prev);
      };

      useEffect(() => {
        const handleClickOutside = (event) => {
          if (filterRef.current && !filterRef.current.contains(event.target)) {
            setIsVisible(false);
          }
          if (evaluationRef.current && !evaluationRef.current.contains(event.target)) {
            setisEvaView(false);
          }
          if (updateRef.current && !updateRef.current.contains(event.target)) {
            setIsUpdateView(false);
          }
          if (exportRef.current && !exportRef.current.contains(event.target)) {
            setIsExport(false);
          }
        };
    
        // Add event listener when component mounts
        document.addEventListener('mousedown', handleClickOutside);
    
        // Clean up the event listener when component unmounts
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [])

       // Function to format the date
      const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      return date.toLocaleDateString();  // This will format the date according to the user's locale
      };

      const [startYear, setStartYear] = useState('');
      const [endYear, setEndYear] = useState('');

      const handleFilter = () => {
        // Filter players based on the specified year range
        if(parseInt(startYear, 10) > parseInt(endYear, 10)){
          setyearFilterErr("Invalid year range");
        }else{
          const filtered = players.filter(player => {
            const year = new Date(player.Date_of_Birth).getFullYear();
            setyearFilterErr("");
            return year >= parseInt(startYear, 10) && year <= parseInt(endYear, 10);
          });
          console.log(filtered);
          setFilteredData(filtered);
        }
      };

      const deletePlayer = async (event, pid) => {
        event.stopPropagation(); // Prevents the row click event
        try {
          const data = await apiService.delete(`/players/delete/${pid}`);
          const evaDel = await apiService.delete(`/evaluation/delete/${pid}`);
          fetchPlayers();
        } catch (e) {
          setErr("Failed to delete player: " + e);
          console.log(err);
        }
      };

      const positionMap = [
        {"full": "Goalkeeper", "short": "GK"},
        {"full": "Center Back", "short": "CB"},
        {"full": "Left Back", "short": "LB"},
        {"full": "Right Back", "short": "RB"},
        {"full": "Defender Midfielder", "short": "DM"},
        {"full": "Central Midfielder", "short": "CM"},
        {"full": "Central Attacking Midfielder", "short": "CAM"},
        {"full": "Left Winger", "short": "LW"},
        {"full": "Right Winger", "short": "RW"},
        {"full": "Center Foward", "short": "CF"},
      ];

      const positionMapping = (positionMap, data) => {
        const shortform = positionMap.find((position) => position.full === data);
        return shortform.short;
      }

      // Function to handle mouse enter
      const handleMouseEnter = (className) => {
        setHoveredClass(className);
      };

      // Function to handle mouse leave
      const handleMouseLeave = () => {
        setHoveredClass('');
      };

  return (
    <>
     {isEvaView && (<div className="evalution-pop" ref={evaluationRef}><EvaluationView player={selectedPlayer}/></div>)}

     {isUpdateView && (<div className="evalution-pop" ref={updateRef}><UpdateForm player={selectedPlayer}/></div>)}

     {isExport && (<div className="evalution-pop" ref={exportRef}><ExportFilteredData players={filteredData} gotoDash={showExport}/></div>)}

    <div className="container">

      <div className="overhead">
        <div className="avatar_section">
          <div className="user-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <h4>Hello, {scoutName}</h4>
        </div>

        <div className="filter">
          <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress} // Detect Enter key press
              placeholder="Search database"
            />
            <div className="filterIcon" onClick={toggleFilter}>
              <FontAwesomeIcon icon={faFilter}/>
            </div>
            <div className="filterIcon" onClick={refreshFilter}>
              <FontAwesomeIcon icon={faRefresh}/>
            </div>
            <div className="filterIcon" onClick={() => {showExport();}}>
              <FontAwesomeIcon icon={faFilePdf}/>
            </div>

            {/* Filter section */}
            {isVisible && (
              <div className="filter-section" ref={filterRef}>
                <h3>Filter Options</h3>
                <div className="filter-option">
                    <input type="number" onChange={(e) => setStartYear(e.target.value)} name="start" value={startYear}/>
                    <p> - </p>
                    <input type="number" onChange={(e)=> setEndYear(e.target.value)} name="end" value={endYear}/>
                </div>
                <button onClick={handleFilter}>Find results</button>
                {yearFilterErr && <p className="error-message">{yearFilterErr}</p>}
                
              </div>
            )}

        </div>
      </div>

      <div className="table">
      <table className="player-table">
      <thead>
        <tr>
          <th>
          </th>
          <th onClick={() => sortTable("name")}>
            Name <span className="arrow">{renderArrow("name")}</span>
          </th>
          <th>
            Nationality 
          </th>
          <th>
            DOB
          </th>
          <th>
            Position
          </th>
          <th >
            Preferred Foot
          </th>
          <th >
            Scouted By 
          </th>
          <th >
            Status 
          </th>
          <th >
            {/* Delete icon */}
          </th>
          <th >
            {/* Edit icon */}
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((player, index) => (
          <tr 
            key={index} 
            onClick={() => {
                showEvaluation();
                setSelectedPlayer(player);
              }
            }
          >
            <td className='player_Img'>
              <img src={player.Image} className="player-img" />
            </td>
            <td className="name">
              
              {player.First_name + " " + player.Last_name}
            </td>
            <td className="nation">
              {/* <span className={`flag-icon flag-icon-${countryCode}`}></span> */}
              <div className="nationality">
              <span className='nation-img'><Flag code={player.NationalityISO} style={{ width: '30px', height: '30px' }} /></span>
              {player.Nationality}
              </div>
            </td>
            <td>{formatDate(player.Date_of_Birth)}</td>
            
            <td>{positionMapping(positionMap,player.Position)}</td>
            <td>{player.Preferred_Foot}</td>
            <td>{player.Scouted_By}</td>
            <td className={`status`}
              onMouseEnter={() => handleMouseEnter(`${player.Status.toLowerCase()}`)}
              onMouseLeave={handleMouseLeave}
            >
              <div className='tooltip'>
                <div className={`${player.Status.toLowerCase()}`}></div>
                <span class="tooltiptext">{`${player.Status}`}</span>
              </div>
              
              
            </td>
            <td className='trash-td'  onClick={(event) => deletePlayer(event, player._id)}>
              <div className='trash-icon' title='delete'>
                <FontAwesomeIcon icon={faTrash}/>
              </div>
            </td>
            <td className='edit-td'  onClick={() => {showUpadte();}}>
              <div className='edit-icon' title='edit'>
                <FontAwesomeIcon icon={faPencil}/>
              </div>
            </td>
            
          </tr>
          
        ))}
      </tbody>
      </table>
      </div>
  </div>
  </>
  )
}






export default Datazone