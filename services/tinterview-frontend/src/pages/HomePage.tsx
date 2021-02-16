import React from "react";
import Candidate from "../components/Candidate";

const HomePage = () => {
  let overlay = document.getElementById("Overlay");
  const buttonHandlerAddCandidate = () => {
    if (!overlay) {
      overlay = document.getElementById("Overlay");
    }
    if (overlay) {
      overlay.classList.add("active");
    }
  };
  const buttonHandlerClosePopUp = () => {
    if (overlay) {
      overlay.classList.remove("active");
    }
  };
  return (
    // eslint-disable-next-line
    <div className="App">
      <div className="Header">
        <img
          className="CWLogo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/CoverWallet_Logo.png/478px-CoverWallet_Logo.png"
          alt="coverwallet logo"
        />
        <h1 className="Center">Tinterview</h1>
        <button className="PowerOffButton" type="button">
          <img
            className="PowerOffLogo"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAVBeAp8qJG9df7JJcbvl5ivfuy74XqWuBgg&usqp=CAU"
          />
        </button>
      </div>
      <div className="RecruiterHeader">
        <div className="Searcher">
          <input
            className="InputSearch"
            type="text"
            id="search"
            placeholder="Search..."
          />
          <button className="LupaButton" type="button">
            <img
              className="Lupa"
              src="https://e7.pngegg.com/pngimages/213/564/png-clipart-magnifying-glass-magnification-magnifying-glass-glass-logo.png"
            />
          </button>
        </div>
        <div />
        <div>X elements</div>
        <button
          className="AddCandidateButton"
          type="button"
          onClick={() => buttonHandlerAddCandidate()}
        >
          Add Candidate
        </button>
      </div>
      <div className="Homebox">
        <div className="HomeboxHeader">
          <h5>Phase</h5>
          <h5>Name</h5>
          <h5>Position</h5>
          <h5>Interviewers</h5>
          <h5>Interview Date</h5>
          <h5>Action</h5>
        </div>
        <div className="HomeboxBody">
          <Candidate />
        </div>
      </div>
      <div className="Overlay" id="Overlay">
        <div className="PopUp" id="PopUp">
          <div className="Left">
            <h3>Add candidate</h3>
            <div className="Buttons2">
              <button type="button">add</button>
              <button type="button" onClick={() => buttonHandlerClosePopUp()}>
                cancel
              </button>
            </div>
          </div>
          <div className="Right">
            <div className="X">
              <button
                className="ClosePopUp"
                type="button"
                onClick={() => buttonHandlerClosePopUp()}
              >
                X
              </button>
            </div>
            <div className="Form">
              <div>Name</div>
              <input
                className=""
                type="text"
                id="nameInput"
                placeholder="Enter name of candidate"
              />
              <div>Email</div>
              <input
                className=""
                type="text"
                id="emailInput"
                placeholder="my@company.com"
              />
              <div>Position</div>
              <input
                className=""
                type="text"
                id="positionInput"
                placeholder="Position"
              />
              <div>Seniority</div>
              <input
                className=""
                type="text"
                id="seniorityInput"
                placeholder="Seniority"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
