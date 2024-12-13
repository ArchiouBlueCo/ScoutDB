import React, { useState } from 'react'
import './css/Settings.css'
import './css/responsive/Settings.css'
import { apiService } from "../services/apiService.js";

const Settings = ({scoutId}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConPassword, setNewConPassword] = useState("");
  const [flagMessage, setFlagMessage] = useState("");
  const [flagVisibility,setFlagVisibility] = useState(false);
  
  
  const resetPassword = async (e) => {
    e.preventDefault();
    const route = `/scouts/updatePassword/${scoutId}/`;
    setFlagVisibility(true);
    if(newPassword !== newConPassword){
      setFlagMessage("New passwords do not mamtch");
    }
    else{
      try {
        const response = await apiService.put(route, {currentPassword : oldPassword, newPassword: newPassword}, {
          headers: {
            'Content-Type': 'application/json'
          }, });
        if(response.error){
          setFlagMessage("Incorrect password entered");     
        }
        else{
          setFlagMessage("Password as been successfully updated");
        }
        
      } catch (error) {
        setFlagMessage("An error occured");
      }
    }
  }


  return (
    <div className='container'>
      <form onSubmit={resetPassword}>
        <div className="settings_wrapper">
          <h2>Reset Password</h2>
          <input type="text" placeholder='Enter Old Password' onChange={(e)=>{setOldPassword(e.target.value)}} required/>
          <input type="text" placeholder='Enter New Password' onChange={(e)=>{setNewPassword(e.target.value)}} required/>
          <input type="text" placeholder='Enter Confirm Password' onChange={(e)=>{setNewConPassword(e.target.value)}} required/>
          <button type='sumbit'>Reset password</button>

          {flagMessage && <p>{flagMessage}</p>}
        </div>
      </form>

    </div>
  )
}

export default Settings