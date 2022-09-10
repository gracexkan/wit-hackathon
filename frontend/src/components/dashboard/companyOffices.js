import React from "react";

const Offices = () => {
    return (
        <div style={{ marginLeft: '20%', marginTop: '80px', width: '80%', display: "flex" }}>
            <h1>My offices</h1> &nbsp;
            <div>
                <button onClick={addOffice}>+</button>
            </div>
         </div>
    );
}

function addOffice() {
    // alert('hello');
}

export default Offices;