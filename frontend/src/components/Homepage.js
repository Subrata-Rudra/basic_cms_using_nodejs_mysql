import { React } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1
        id="mainh1"
        style={{ color: "blue", marginTop: "1rem", textAlign: "center" }}
      >
        Content Management System - Lite
      </h1>
      <div
        className="container"
        style={{
          display: "flex",
          height: "85vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          className="main"
          style={{ marginTop: "2rem", display: "flex", flexDirection: "row" }}
        >
          <div className="left" style={{ marginRight: "1rem" }}>
            <button
              id="createEntity"
              onClick={() => {
                navigate("/createEntity");
              }}
            >
              Create Entity
            </button>
          </div>
          <div className="right" style={{ marginLeft: "1rem" }}>
            <button
              id="viewEntity"
              onClick={() => {
                navigate("/viewEntity");
              }}
            >
              View Entity
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
