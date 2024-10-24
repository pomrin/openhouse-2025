import React from 'react';
import Map from './../assets/images/Fintech.png';
import '../css/Wayfinder.css'; // Import your CSS file

function Fintech() {
    return (
        <div className="container">
            <img src={Map} alt="Fintech Map" className="map-image" />
        </div>
    );
}

export default Fintech;
