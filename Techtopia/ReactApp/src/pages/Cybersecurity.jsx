import React, { useState, useRef } from 'react';
import Map from './../assets/images/CybersecurityMap.png';
import '../css/Wayfinder.css'; // Import your CSS file

const Cybersecurity = () => {
    const [scale, setScale] = useState(1.1);
    // const [position, setPosition] = useState({ x: 0, y: 0 });
    // const containerRef = useRef(null);
    // const isDragging = useRef(false);
    // const startPos = useRef({ x: 0, y: 0 });

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale * 1.2, 1.6)); // Max zoom level of 3
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale / 1.2, 1.1)); // Min zoom level of 1
    };

    // const handleMouseDown = (e) => {
    //     isDragging.current = true;
    //     startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    // };

    // const handleMouseMove = (e) => {
    //     if (isDragging.current) {
    //         const dx = e.clientX - startPos.current.x;
    //         const dy = e.clientY - startPos.current.y;

    //         // Calculate new position
    //         let newX = dx;
    //         let newY = dy;

    //         // Get container dimensions
    //         const containerWidth = containerRef.current.offsetWidth * scale;
    //         const containerHeight = containerRef.current.offsetHeight * scale;
    //         const maxX = 0; // Left edge
    //         const minX = window.innerWidth - containerWidth; // Right edge
    //         const maxY = 0; // Top edge
    //         const minY = window.innerHeight - containerHeight; // Bottom edge

    //         // Limit panning within bounds
    //         newX = Math.min(maxX, Math.max(newX, minX));
    //         newY = Math.min(maxY, Math.max(newY, minY));

    //         setPosition({ x: newX, y: newY });
    //     }
    // };

    // const handleMouseUp = () => {
    //     isDragging.current = false;
    // };

    // const handleMouseLeave = () => {
    //     isDragging.current = false;
    // };

    return (
        <div 
            className="map-container"
            // onMouseDown={handleMouseDown}
            // onMouseMove={handleMouseMove}
            // onMouseUp={handleMouseUp}
            // onMouseLeave={handleMouseLeave}
            // style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
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

export default Cybersecurity;
