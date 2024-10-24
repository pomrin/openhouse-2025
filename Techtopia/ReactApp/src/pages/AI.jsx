import React from 'react';
import Map from './../assets/images/AI.png';
import '../css/Wayfinder.css'; // Import your CSS file

function AI() {
    return (
        <div className="container">
            <img src={Map} alt="AI Map" className="map-image" />
        </div>
    );
}

export default AI;