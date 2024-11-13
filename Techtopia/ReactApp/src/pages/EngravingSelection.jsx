import React, { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from "react-router-dom";
import "../css/EngravingSelection.css";
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, sendMessage } from '../features/websocket/websocketslice';
import axios from './http';

const EngravingSelection = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [engravingText, setEngravingText] = useState("");
  const maxCharacters = 20;

  const profanityFilter = (inputText) => {
    const profanities = ["list of profanities"];
    const patterns = [/* patterns for profanity detection */];
    return patterns.some(pattern => pattern.test(inputText));
  };
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [recipientId, setRecipientId] = useState('');


  const isConnected = useSelector((state) => state.websocket.isConnected);
  const messages = useSelector((state) => state.websocket.messages);

  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken');
    if (!token) {
      navigate('/adminlogin');
      return;
    }

    console.log("Using token:", token); // Log the token to verify it's available

    // Fetch colors from API with authorization header
    const fetchColors = async () => {
      try {
        const response = await fetch("https://nfiyg2peub.execute-api.ap-southeast-1.amazonaws.com/Prod/api/LuggageTagColors", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch colors. Status: ${response.status}. Response: ${errorText}`);
        }

        const colorData = await response.json();
        console.log("Available colors from API:", colorData);
        setColors(colorData);
      } catch (error) {
        console.error("Error fetching colors:", error);
        alert("Failed to load colors. Please try again later.");
      }
    };

    fetchColors();
  }, [navigate]);



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedColor) {
      alert("Please select a color.");
      return;
    }
    if (engravingText.length > maxCharacters) {
      alert(`Text exceeds the limit of ${maxCharacters} characters`);
      return;
    }
    if (profanityFilter(engravingText)) {
      alert("Profanity detected! Please use appropriate language.");
      return;
    }
  
    const ticketData = {
      ticketId: uuid,
      luggageTagColor: selectedColor,
      engravingText: engravingText,
    };
  
    console.log("Ticket Data to be sent:", ticketData);
  
    try {
      const token = localStorage.getItem('adminAccessToken');
      if (!token) {
        alert("No token found. Please log in.");
        navigate('/adminlogin');
        return;
      }
  
      const response = await axios.post(`${import.meta.env.VITE_QUEUE_API}`, ticketData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  

  
      alert("Form submitted successfully!");
      navigate("/adminqueue");
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      alert("There was an error submitting your data. Please try again.");
    }
  };
  
  return (
    <div className="engraving-container">
      <div className="header">
        <button className="back-arrow" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </button>
        <div className="user-id-section">
          <h2>User ID: {uuid}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 style={{ textAlign: 'center' }}>Select a Colour</h3>

        <div className="color-selection">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`color-box ${selectedColor === color.luggageTagColorName ? "selected" : ""}`}
              style={{ backgroundColor: color.luggageTagColorCode }}
              onClick={() => setSelectedColor(color.luggageTagColorName)}
            />
          ))}
        </div>


        <div className="engraving-text-section">
          <label htmlFor="engravingText" style={{ fontSize: '38px' }}>
            Words to be Engraved (Max {maxCharacters} Characters)
          </label>
          <input
            type="text"
            id="engravingText"
            value={engravingText}
            onChange={(e) => setEngravingText(e.target.value)}
            maxLength={maxCharacters}
            placeholder="Enter engraving text"
            className="engraving-input"
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!selectedColor || engravingText.length === 0 || engravingText.length > maxCharacters}
        >
          Submit
        </button>

      </form>
    </div>
  );
};

export default EngravingSelection;
