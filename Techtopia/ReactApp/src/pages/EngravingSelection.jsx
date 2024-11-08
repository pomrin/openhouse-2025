import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/EngravingSelection.css"; // Import CSS for styling

const EngravingSelection = () => {
  const { uuid } = useParams(); // Fetch UUID from route params
  const navigate = useNavigate(); // Initialize the navigate function
  const [selectedColor, setSelectedColor] = useState("");
  const [engravingText, setEngravingText] = useState("");
  const maxCharacters = 20; // Define character limit

  // Profanity filter function
  const profanityFilter = (inputText) => {
    const profanities = [
      "fuck", "shit", "bitch", "ass", "crap", "damn", "hell", "prick",
      "KNN", "CB", "cibai", "bodoh", "siao", "pukimak", "chao", "jialat",
      "kau", "simi sai", "tua pui", "SMD", "GTH", "kanina", "KANINA", "KPKB", "kpkb",
      "DLLM", "hamgacan", "Fkurmother", "die", 'jump', 'buto', 'fker', 'diefk', "kanina", "knn",
      "knnccb", "knncb", "knnpcb", "knnb", "knnbcb", "kpkb", "dllm", "diuleiloumou", "diu", "hamgacan",
      "hgc", "ccb", "fck", "fker", "fucker", "fucking", "fucked", "fucking", "ppys", "yaosiew",
      "motherfucker", "motherfker", "mtfucker", "fk", 'chibai', 'cbdog', 'cbfuck', 'yaosiewkia',
      'SLK', 'SYH', '369', '108', '18', '32', '108', 'apk', 'TWL', 'lanjiao', 'lanpah', 'yourmother',
    ];
    const patterns = [
      /f[\.]?u[\.]?c[\.]?k/i, /s[\.]?h[\.]?i[\.]?t/i, /b[\.]?i[\.]?t[\.]?c[\.]?h/i,
      /k+n+n/i, /(c[\.]?b[\.]?|cibai)/i, /(p[\.]?u[\.]?k[\.]?i[\.]?m[\.]?a[\.]?k)/i,
      /(b[o0]d[o0]h)/i, /(jialat|jialart|jialatt)/i
    ];

    return patterns.some(pattern => pattern.test(inputText));
  };
  useEffect(() => {
    // Token validation: check if JWT token exists
    const token = localStorage.getItem('adminAccessToken');

    // If no token, redirect to login
    if (!token) {
      navigate('/adminlogin');
    }
  }, [navigate]);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedColor) {
      alert("Please select a color.");
      return;
    }

    if (engravingText.length <= maxCharacters) {
      // Check for profanity
      if (profanityFilter(engravingText)) {
        alert("Profanity detected! Please use appropriate language.");
        return;
      }

      const ticketData = {
        ticketId: uuid,
        luggageTagColor: selectedColor,
        engravingText: engravingText,
      };

      try {
        const token = localStorage.getItem('adminAccessToken');
        if (!token) {
          alert("No token found. Please log in.");
          navigate('/adminlogin');
          return;
        }



        const response = await fetch(
          `${import.meta.env.VITE_QUEUE_API}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(ticketData),
          });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${await response.text()}`);
        }

        alert("Form submitted successfully!");
        navigate("/adminqueue");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("There was an error submitting your data. Please try again.");
      }
    } else {
      alert(`Text exceeds the limit of ${maxCharacters} characters`);
    }
  };

  return (
    <div className="engraving-container">
      <div className="user-id-section">
        <h2>User ID: {uuid}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 style={{ textAlign: 'center' }}>Select a Colour</h3>
        <div className="color-selection">
          <div
            className={`color-box ${selectedColor === "red" ? "selected" : ""}`}
            style={{ backgroundColor: "red" }}
            onClick={() => setSelectedColor("red")}
          />
          <div
            className={`color-box ${selectedColor === "yellow" ? "selected" : ""}`}
            style={{ backgroundColor: "yellow" }}
            onClick={() => setSelectedColor("yellow")}
          />
          <div
            className={`color-box ${selectedColor === "pink" ? "selected" : ""}`}
            style={{ backgroundColor: "hotpink" }}
            onClick={() => setSelectedColor("pink")}
          />
          <div
            className={`color-box ${selectedColor === "green" ? "selected" : ""}`}
            style={{ backgroundColor: "limegreen" }}
            onClick={() => setSelectedColor("green")}
          />
        </div>

        <div className="engraving-text-section">
          <label
            htmlFor="engravingText"
            style={{
              fontSize: '38px',
            }}
          >
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

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EngravingSelection;
