import React, {useState} from 'react';
import Map from './../assets/images/Fintech.png';
import '../css/Wayfinder.css'; // Import your CSS file

const Fintech = () => {
    const [scale, setScale] = useState(1.1);
    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale * 1.2, 1.6)); // Max zoom level of 3
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale / 1.2, 1.1)); // Min zoom level of 1
    };

    return (
        <div 
            className="map-container"
        >
            <div className="button-container" >
            <button onClick={zoomIn} className="zoom-button" >+</button>
                <button onClick={zoomOut} className="zoom-button" >−</button>
            </div>
            <div 
                className="container" 
                 style={{
                     transform: `scale(${scale}) `
                 }}
                //  translate(${position.x}px, ${position.y}px)`,
                //  ref={containerRef}
            >
                <img src={Map} alt="Cybersecurity Map" className="map-image" />
            </div>
        </div>
    );
}

export default Fintech;
