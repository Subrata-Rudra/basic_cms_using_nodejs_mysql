import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEntityPage = () => {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState([]);
  const [tableName, setTableName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("VARCHAR(255)");
  const [propertyRequired, setPropertyRequired] = useState("");
  const [propertyUnique, setPropertyUnique] = useState("");
  const handleAdd = () => {
    let toAdd = `<tr class="tr-tableRow">`;
    let str = propertyName.replace(/ /g, "_");
    toAdd += "<td>" + str + "</td>";
    str += "|=|" + propertyType;
    if (propertyType === "VARCHAR(255)") {
      toAdd += "<td>Text</td>";
    } else if (propertyType === "INT") {
      toAdd += "<td>Number</td>";
    } else {
      toAdd += "<td>Date</td>";
    }
    if (propertyRequired === "n") {
      str += "|=|n";
      toAdd += "<td>Required</td>";
    } else {
      toAdd += "<td>Not Required</td>";
    }
    if (propertyUnique === "u") {
      str += "|=|u";
      toAdd += "<td>Unique</td>";
    } else {
      toAdd += "<td>Not Unique</td>";
    }
    document.getElementById("tableRow").innerHTML += toAdd;
    setAttributes((prevState) => [...prevState, str]);
    setPropertyName("");
    setPropertyType("VARCHAR(255)");
    setPropertyRequired("");
    setPropertyUnique("");
  };

  const handleSubmit = async () => {
    if (tableName === "") {
      alert("Please enter the name of the entity.");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
        name: tableName,
        attributes: attributes,
      };
      let url =
        process.env.REACT_APP_BACKEND_DEVELOPMENT_BASE_URL + "/createTable";
      const response = await axios.post(url, data, config);
      if (response.status === 201) {
        alert("Entity Created✅");
        setTableName("");
        setPropertyName("");
        setPropertyType("VARCHAR(255)");
        setPropertyRequired("");
        setPropertyUnique("");
      } else if (response.status === 200) {
        alert(response.data);
        setTableName("");
        setPropertyName("");
        setPropertyType("VARCHAR(255)");
        setPropertyRequired("");
        setPropertyUnique("");
      }
    } catch (error) {
      console.log(
        "Error occurred in sending entity creation data to backend server."
      );
      console.error(error);
    }
  };

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          marginTop: "1rem",
          cursor: "pointer",
          color: "blue",
        }}
        onClick={() => navigate("/")}
      >
        Home
      </h1>
      <h1
        style={{
          textAlign: "center",
          marginTop: "1rem",
        }}
      >
        Create Entity
      </h1>
      <div
        style={{
          display: "flex",
          height: "80vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <table>
          <thead>
            <tr>
              <th className="mainTh">Property Name</th>
              <th className="mainTh">Property Type</th>
              <th className="mainTh">Required</th>
              <th className="mainTh">Unique</th>
            </tr>
          </thead>
          <tbody id="tableRow"></tbody>
        </table>
        <div
          className="tableNameDiv"
          style={{
            padding: "2rem",
            borderTop: "2px solid black",
            borderLeft: "2px solid black",
            borderRight: "2px solid black",
            minWidth: "36.2%",
            marginTop: "3rem",
            // textAlign: "left",
          }}
        >
          <label htmlFor="tName">Entity Name: </label>
          <input
            type="text"
            name="tName"
            value={tableName}
            placeholder="e.g. Person"
            autoComplete="off"
            onChange={(e) => {
              setTableName(e.target.value);
            }}
          />
        </div>
        <div
          className="form"
          style={{
            display: "flex",
            flexDirection: "column",
            border: "2px solid black",
            padding: "1rem",
            textAlign: "left",
            minWidth: "38.3%",
            marginBottom: "1rem",
          }}
        >
          <div style={{ padding: ".5rem 0" }}>
            <label htmlFor="propertyName">Property Name: </label>
            <input
              type="text"
              name="propertyName"
              id="propertyName"
              value={propertyName}
              placeholder="e.g. Email"
              autoComplete="off"
              onChange={(e) => {
                setPropertyName(e.target.value);
              }}
            />
          </div>
          <div style={{ padding: ".5rem 0" }}>
            <label htmlFor="propertyType">Property Type: </label>
            <select
              name="propertyType"
              id="propertyType"
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
              }}
            >
              <option value="" disabled selected hidden>
                Select Property Type
              </option>
              <option value="VARCHAR(255)">Text</option>
              <option value="INT">Number</option>
              <option value="DATE">Date</option>
            </select>
          </div>
          <div style={{ padding: ".5rem 0" }}>
            <label htmlFor="propertyRequired">Required: </label>
            <select
              name="propertyRequired"
              id="propertyRequired"
              value={propertyRequired}
              onChange={(e) => {
                setPropertyRequired(e.target.value);
              }}
            >
              <option value="" disabled selected hidden>
                Select Required or Not
              </option>
              <option value="n">Yes</option>
              <option value="y">No</option>
            </select>
          </div>
          <div style={{ padding: ".5rem 0" }}>
            <label htmlFor="propertyUnique">Unique: </label>
            <select
              name="propertyUnique"
              id="propertyUnique"
              value={propertyUnique}
              onChange={(e) => {
                setPropertyUnique(e.target.value);
              }}
            >
              <option value="" disabled selected hidden>
                Select Unique or Not
              </option>
              <option value="u">Yes</option>
              <option value="y">No</option>
            </select>
          </div>
          <button style={{ marginTop: "1rem" }} onClick={handleAdd}>
            Add
          </button>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
};

export default CreateEntityPage;
