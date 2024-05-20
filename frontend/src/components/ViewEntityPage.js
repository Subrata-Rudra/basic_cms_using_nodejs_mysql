import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEntityPage = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableName, setTableName] = useState("Select an Entity");
  const [tableDetails, setTableDetails] = useState([]);
  async function fetchTables() {
    await axios
      .get(process.env.REACT_APP_BACKEND_DEVELOPMENT_BASE_URL + "/getAllTables")
      .then((response) => {
        localStorage.setItem("tables", JSON.stringify(response.data));
      })
      .catch((err) => {
        console.error(`Error is fetching data from server: ${err}`);
      });
  }
  async function handleAddData() {
    let format;
    try {
      const url =
        process.env.REACT_APP_BACKEND_DEVELOPMENT_BASE_URL +
        "/tableDetails?name=" +
        tableName;
      const res = await axios.get(url);
      format = res.data;
      setTableDetails(res.data);
    } catch (error) {
      console.log(
        "Error occurred in getting details of an entity from backend server."
      );
      console.error(error);
    }
    if (format.length > 0) {
      let toAdd = ``;
      for (let i = 0; i < format.length; i++) {
        let fieldName = format[i]["field"];
        toAdd += `<label> ${fieldName} <label/>`;
        let dataType = format[i]["type"];
        if (dataType === "varchar(255)") {
          toAdd += `<input type="text"/><br>`;
        } else if (dataType === "int") {
          toAdd += `<input type="number"/><br>`;
        } else if (dataType === "date") {
          toAdd += `<input type="date"/><br>`;
        }
      }
    }
  }
  async function handleTableView() {
    if (tableName === "Select an Entity") {
      return;
    }
    const url =
      process.env.REACT_APP_BACKEND_DEVELOPMENT_BASE_URL +
      "/getTableData?tableName=" +
      tableName;
    await axios
      .get(url)
      .then((response) => {
        setTableData(response.data);
      })
      .catch((err) => {
        console.error(`Error is fetching data from server: ${err}`);
      });
  }
  async function deleteOneRow(id) {
    try {
      const url =
        process.env.REACT_APP_BACKEND_DEVELOPMENT_BASE_URL + "/deleteData";
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
        tableName: tableName,
        id: id,
      };
      const response = await axios.post(url, data, config);
      if (response.status === 200) {
        handleTableView();
      }
    } catch (error) {
      console.log(
        "Error occurred in deleting row of an entity in backend server."
      );
      console.error(error);
    }
  }
  async function editOneRow(id) {
    try {
      const url =
        process.env.REACT_APP_BACKEND_DEVELOPMENT_BASE_URL + "/updateData";
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
        tableName: tableName,
        id: id,
        data: [],
      };
      const response = await axios.post(url, data, config);
      if (response.status === 200) {
        handleTableView();
      }
    } catch (error) {
      console.log(
        "Error occurred in deleting row of an entity in backend server."
      );
      console.error(error);
    }
  }
  useEffect(() => {
    fetchTables();
    const storedData = localStorage.getItem("tables");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setTables(parsedData);
      } catch (err) {
        console.error(`Error parsing stored data: ${err}`);
      }
    } else {
      fetchTables();
    }
  }, []);
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
        View Entity
      </h1>
      <div
        style={{
          display: "flex",
          height: "30vh",
          marginTop: "1.5rem",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "1.2rem",
        }}
      >
        <label htmlFor="tableName">Select Entity: </label>
        <select
          name="tableName"
          style={{
            width: "30%",
            padding: ".5rem",
            textAlign: "center",
            margin: "1rem",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
          onChange={(e) => setTableName(e.target.value)}
          value={tableName}
        >
          {tables.map((table) => (
            <option key={table} value={table}>
              {table.charAt(0).toUpperCase() + table.slice(1)}
            </option>
          ))}
        </select>
        <button id="addBtn" onClick={() => handleAddData()}>
          Add Data
        </button>
        <button id="viewBtn" onClick={() => handleTableView()}>
          View
        </button>
      </div>
      <div
        id="tableShow"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {tableData.length > 0 && (
          <table>
            <thead>
              <tr style={{ border: "2px solid black" }}>
                {Object.keys(tableData[0]).map((tData) => (
                  <th
                    style={{
                      border: "2px solid grey",
                      padding: ".3rem .7rem",
                    }}
                    key={tData}
                  >
                    {tData.charAt(0).toUpperCase() +
                      tData.slice(1).replace(/_/g, " ")}
                  </th>
                ))}
                <th
                  style={{
                    border: "2px solid grey",
                    padding: ".3rem .7rem",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((tableEle, index) => (
                <tr key={index}>
                  {Object.keys(tableData[0]).map((head) => (
                    <td
                      style={{
                        border: "2px solid grey",
                        padding: ".3rem .7rem",
                      }}
                      key={head}
                    >
                      {tableEle[head]}
                    </td>
                  ))}
                  <td>
                    <button
                      id="editBtn"
                      onClick={() => editOneRow(tableEle.id)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      id="deleteBtn"
                      onClick={() => deleteOneRow(tableEle.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CreateEntityPage;
