import React from 'react';
import './css/Loading.css'
import Lottie  from 'lottie-react';
import loadingAnimation from '../assets/QHeEthBMzR.json';


const LoadingScreen = () => {
    return (
      <div className="loading-overlay">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div> 
    );
  }
  
  export default LoadingScreen;