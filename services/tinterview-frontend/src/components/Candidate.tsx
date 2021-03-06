import React from "react";

const Candidate = () => {
  return (
    // eslint-disable-next-line
    <div className="CandidateBox">
      <div>1</div>
      <div>nombre apellido</div>
      <div>position 1</div>
      <div className="Recruiters">
        <div>Recruiter 1</div>
        <div>Recruiter 2</div>
      </div>
      <div>13/12/2020 13:00</div>
      <button className="OptionsButton" type="button">
        <img
          className="OptionsImg"
          src="data:image/jpeg;base64,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"
        />
      </button>
    </div>
  );
};
export default Candidate;
