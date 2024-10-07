import React, { useState } from 'react';
import './App.css'; // Include your updated CSS here

function App() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('');
  const [dropdowns, setDropdowns] = useState([]);

  // Schema options
  const allSchemas = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ];

  const handleSaveSegmentClick = () => {
    setPopupOpen(true); // Show the popup
  };

  const handleInputChange = (e) => {
    setSegmentName(e.target.value);
  };

  const handleSchemaChange = (e) => {
    setSelectedSchema(e.target.value); // Update the selected schema
  };

  const handleAddNewSchema = () => {
    if (selectedSchema) {
      // Add the new schema to dropdowns array and reset selected schema
      setDropdowns([...dropdowns, selectedSchema]);
      setSelectedSchema('');
    }
  };

  const handleClosePopup = () => {
    // Prepare the data in required format for submission
    const schema = dropdowns.map((schemaValue) => {
      const foundSchema = allSchemas.find((schema) => schema.value === schemaValue);
      return { [schemaValue]: foundSchema?.label };
    });

    const data = {
      segment_name: segmentName,
      schema,
    };

    console.log("Data to send to server:", data);

    const webhookUrl = "https://webhook.site/a97c6522-dac0-48b5-a8df-59940b856e37"; // Use the actual Webhook URL

  // Send data to server using Fetch
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Data sent successfully!");
      } else {
        console.error("Error sending data:", response.status);
      }
    })
    .catch((error) => {
      console.error("Network error:", error);
    });

  // Reset form and close popup
  setPopupOpen(false);
  setSegmentName('');
  setDropdowns([]);
};
    

  // Function to get available options for new dropdown
  const getAvailableSchemas = () => {
    const selectedValues = new Set(dropdowns);
    return allSchemas.filter(schema => !selectedValues.has(schema.value));
  };

  return (
    <>
    <div className='header'>
    </div>
    <div className="App">
      <button onClick={handleSaveSegmentClick}>Save segment</button>

      {isPopupOpen && (
        <div className="popup">
          <div className='header'>
          </div>
          <div className="popup-content">
          <span className="close-icon" onClick={() => setPopupOpen(false)}>×</span>
            <h2>Enter Segment Name</h2>
            <input
              type="text"
              value={segmentName}
              onChange={handleInputChange}
              placeholder="Segment name"
            />
            <div className="blue-box">
              {dropdowns.map((dropdownValue, index) => (
                <select key={index} value={dropdownValue} onChange={(e) => {
                  const newDropdowns = [...dropdowns];
                  newDropdowns[index] = e.target.value;
                  setDropdowns(newDropdowns);
                }}>
                  <option value="">Select schema</option>
                  {getAvailableSchemas().concat({ label: allSchemas.find(schema => schema.value === dropdownValue)?.label, value: dropdownValue }).map((schema) => (
                    <option key={schema.value} value={schema.value}>
                      {schema.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
            <label htmlFor="schema-dropdown">Add schema to segment:</label>
            <select id="schema-dropdown" value={selectedSchema} onChange={handleSchemaChange}>
              <option value="">Select schema</option>
              {getAvailableSchemas().map((schema) => (
                <option key={schema.value} value={schema.value}>
                  {schema.label}
                </option>
              ))}
            </select>
            
            <button onClick={handleAddNewSchema}>+Add new schema</button>

            {/* Render added dropdowns */}
            <button style={{backgroundColor:"white", color:"black", border:"2px solid black"}} onClick={handleClosePopup}>Save</button>

            
          </div>
          
        </div>
      )}
    </div>
    </>
  );
}

export default App;
