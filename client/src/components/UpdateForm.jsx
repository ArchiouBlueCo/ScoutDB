import React, { useState , useEffect } from "react";
import './css/UpdateForm.css'
import { apiService } from "../services/apiService";
import LoadingScreen from "./Loading.jsx";

const UpdateForm = ({player}) => {

  const africanCountries = [
    { "name": "Algeria", "code": "DZ" },
    { "name": "Angola", "code": "AO" },
    { "name": "Benin", "code": "BJ" },
    { "name": "Botswana", "code": "BW" },
    { "name": "Burkina Faso", "code": "BF" },
    { "name": "Burundi", "code": "BI" },
    { "name": "Cabo Verde", "code": "CV" },
    { "name": "Cameroon", "code": "CM" },
    { "name": "Central African Republic", "code": "CF" },
    { "name": "Chad", "code": "TD" },
    { "name": "Comoros", "code": "KM" },
    { "name": "Congo (Congo-Brazzaville)", "code": "CG" },
    { "name": "Democratic Republic of the Congo", "code": "CD" },
    { "name": "Djibouti", "code": "DJ" },
    { "name": "Egypt", "code": "EG" },
    { "name": "Equatorial Guinea", "code": "GQ" },
    { "name": "Eritrea", "code": "ER" },
    { "name": "Eswatini (fmr. Swaziland)", "code": "SZ" },
    { "name": "Ethiopia", "code": "ET" },
    { "name": "Gabon", "code": "GA" },
    { "name": "Gambia", "code": "GM" },
    { "name": "Ghana", "code": "GH" },
    { "name": "Guinea", "code": "GN" },
    { "name": "Guinea-Bissau", "code": "GW" },
    { "name": "Ivory Coast", "code": "CI" },
    { "name": "Kenya", "code": "KE" },
    { "name": "Lesotho", "code": "LS" },
    { "name": "Liberia", "code": "LR" },
    { "name": "Libya", "code": "LY" },
    { "name": "Madagascar", "code": "MG" },
    { "name": "Malawi", "code": "MW" },
    { "name": "Mali", "code": "ML" },
    { "name": "Mauritania", "code": "MR" },
    { "name": "Mauritius", "code": "MU" },
    { "name": "Morocco", "code": "MA" },
    { "name": "Mozambique", "code": "MZ" },
    { "name": "Namibia", "code": "NA" },
    { "name": "Niger", "code": "NE" },
    { "name": "Nigeria", "code": "NG" },
    { "name": "Rwanda", "code": "RW" },
    { "name": "Sao Tome and Principe", "code": "ST" },
    { "name": "Senegal", "code": "SN" },
    { "name": "Seychelles", "code": "SC" },
    { "name": "Sierra Leone", "code": "SL" },
    { "name": "Somalia", "code": "SO" },
    { "name": "South Africa", "code": "ZA" },
    { "name": "South Sudan", "code": "SS" },
    { "name": "Sudan", "code": "SD" },
    { "name": "Tanzania", "code": "TZ" },
    { "name": "Togo", "code": "TG" },
    { "name": "Tunisia", "code": "TN" },
    { "name": "Uganda", "code": "UG" },
    { "name": "Zambia", "code": "ZM" },
    { "name": "Zimbabwe", "code": "ZW" }
  ];

  //Bug with the select fields
  const [playerData, setPlayerData] = useState({
    firstname: '', lastname: '',
    dob: '', height:'',
    gender: '', club: '', 
    position: '', scoutedBy: '',
    foot: '', coachTel: '', region: '', agentName: '',
    coachName: '', nationalityISO: '', agentTel: '',
    nationality:'', status: '', marketValue: 0, contract: 0,
    image: '', // For storing the image file
  });


  const [playerId, setplayerId] = useState(); 
  const [countryCode, setCountryCode] = useState(''); 
  const [flagMessage, setFlagMessage] = useState(''); 
  const [isVisible, setIsVisible] = useState(false); 
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleDialog = () => {
    setShowDialog(true);

    // Automatically close the dialog after 2 seconds
    setTimeout(() => {
      setShowDialog(false);
    }, 2000);
  }
  
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const newdate = date.toLocaleDateString();  // This will format the date according to the user's locale
    const [month, day, year] = newdate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleFileChange = (e) => {
    setPlayerData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };


  // Populate form data from props on component mount
  useEffect(() => {
    if (player) {
      setPlayerData({
        firstname: player.First_name || '', 
        lastname: player.Last_name || '',
        dob: formatDate(player.Date_of_Birth) || '',
        gender: player.Gender ||'', 
        club: player.Club ||'', 
        position: player.Position || '', 
        scoutedBy: player.Scouted_By ||'',
        foot: player.Preferred_Foot || '', 
        agentTel: player.Number_of_agent || '', 
        agentName: player.Agent || '', 
        nationality: player.Nationality || '', 
        nationalityISO: player.NationalityISO || '', 
        region: player.Region_scouted_in || '',
        status: player.Status || '',
        height: player.Height || '',
        contract: player.Contract || '',
        image:  player.Image || '', // For storing the image file

      });
    }
  }, [player]);


  // Handle changes for input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      playerData.gender.length === 0 || playerData.status.length === 0 || playerData.nationality.length === 0
      || playerData.foot.length === 0 || playerData.position.length === 0
    ) {
      setFlagMessage("Kindly enter all the details of the player");
      setIsVisible(true);
      console.log("empty forms");
    } else {
      const countrySearch = africanCountries.find((africanCountry) => africanCountry.name === playerData.nationality);
    
    if(countrySearch){
      setCountryCode(countrySearch.code);
    }
    else{
      setCountryCode("");
    }

    const formData = new FormData();
    formData.append('First_name', playerData.firstname);
    formData.append('Last_name', playerData.lastname);
    formData.append('Gender', playerData.gender);
    formData.append('Date_of_Birth', playerData.dob);
    formData.append('Position', playerData.position);
    formData.append('Preferred_Foot', playerData.foot);
    formData.append('Region_scouted_in', playerData.region);
    formData.append('Club', playerData.club);
    formData.append('Image', playerData.image);
    formData.append('Nationality', playerData.nationality);
    formData.append('Number_of_agent', playerData.agentTel);
    formData.append('Agent', playerData.agentName);
    formData.append('NationalityISO', countrySearch.code);
    formData.append('Status', playerData.status);
    formData.append('Scouted_By', player.Scouted_By);
    formData.append('Height', playerData.height);
    formData.append('Market_Value', playerData.marketValue);
    formData.append('Contract', playerData.contract);

      try {
        
        const response = await apiService.put(`/players/update/${player._id}/`, formData, {
          headers: {
            // 'Content-Type': "application/json",
            'Content-Type': "multipart/form-data",
          },
        });
        setplayerId(response._id);
        handleDialog();
      } catch (error) {
        console.error('Error saving player:', error);
      } finally{
        setLoading(false);
      }
    }

  };

  return(
    <div className="add-form-container">

    {showDialog && (
        <div className="dialogStyles">
          <div className="dialogContent">
            <p>Player Details Updated Successfully</p>
            <button onClick={() => setShowDialog(false)}>Close</button>
          </div>
        </div>
      )}

    <div className="form-wrapperr">

      <div className="form-step">
      {loading && <LoadingScreen/>}
      
        <h2>Player Update Form</h2>
        <div className="registration-form-wrapper">
          <form className="registration-form" onSubmit={handleSubmit}>
          <input type="text" name='firstname' value={playerData.firstname} onChange={handleInputChange} placeholder="Firstname of player" required/>
          <input type="text" name='lastname' value={playerData.lastname} onChange={handleInputChange} placeholder="Lastname of player" required/>
            <select name="gender" id="gender" value={playerData.gender} onChange={handleInputChange} defaultValue="Male">
              <option value="">-- Select gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input type="date" name='dob' value={playerData.dob} onChange={handleInputChange} placeholder="Date of birth" required/>
            <input type="text" name='height' value={playerData.height} onChange={handleInputChange} placeholder="Height in cm" defaultValue={"N/A"}/>

            <select  name="nationality" id="nationality" value={playerData.nationality} onChange={handleInputChange}>
            <option value="">--Select Nationality --</option>
            {africanCountries.map((country, index) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>

            <select name="position" id="position" value={playerData.position} onChange={handleInputChange}>
              <option value="">-- Select position --</option>
              <option value="Center Foward">Center Foward</option>
              <option value="Right Winger">Right Winger</option>
              <option value="Left Winger">Left Winger</option>
              <option value="Central Attacking Midfielder">Central Attacking Midfielder</option>
              <option value="Central Midfielder">Central Midfielder</option>
              <option value="Defender Midfielder">Defender Midfielder</option>
              <option value="Right Back">Right Back</option>
              <option value="Left Back">Left Back</option>
              <option value="Center Back">Center Back</option>
              <option value="Goalkeeper">Goalkeeper</option>
            </select>
            <select name="foot" id="foot" value={playerData.foot} onChange={handleInputChange} >
              <option value="">-- Select Preferred Foot --</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
            <input type="text" name='region' value={playerData.region} onChange={handleInputChange} placeholder="Region Scouted" defaultValue={"N/A"}/>
            <input type="text" name='club' value={playerData.club} onChange={handleInputChange} placeholder="Club name" required/>
            <input type="text" name='agentName' value={playerData.agentName} onChange={handleInputChange} placeholder="Agent" defaultValue={"N/A"}/>
            <input type="tel" name='agentTel' value= {playerData.agentTel} onChange={handleInputChange} placeholder="Agent Tel:" defaultValue={"N/A"}/>
            <select name="status" id="status" value={playerData.status} onChange={handleInputChange}>
              <option value="">-- Select Status --</option>
              <option value="Signed" defaultValue>Signed</option> 
              <option value="Follow">Follow</option>
              <option value="Trials">Trials</option>
              <option value="Leave">Leave</option>
            </select>
            <input type="number" name='marketValue' value={playerData.marketValue} onChange={handleInputChange} placeholder="Market value in euros" defaultValue={"N/A"}/>
            <input type="number" name='contract' value={playerData.contract} onChange={handleInputChange} placeholder="Contract ends in " />
            <input type="file" id="image" name="image" onChange={handleFileChange}  accept="image/png , image/jpeg, image/jpg"/>
            <div className="btnsub">
              <button type="submit" >Update Player</button>
            </div>
          </form>
        </div>
        
      </div>
    </div>

  </div>
  )
}

export default UpdateForm