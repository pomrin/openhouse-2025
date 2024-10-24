import React from 'react';
import Map from './../assets/images/CybersecurityMap.png';
import '../css/Wayfinder.css'; // Import your CSS file

function Cybersecurity() {
    return (
        <div className="container">
            <img src={Map} alt="Cybersecurity Map" className="map-image" />
        </div>
    );
}

export default Cybersecurity;
