import React from "react";

const Name = () => {
    return (
        <div style={{ marginLeft: '20%', marginTop: '80px', width: '80%' }}>
            <h1>Welcome to your dashboard!</h1>
            <form>
                <label>
                    Company Name:&nbsp;
                    <input type="text" name="name" /> &nbsp;
                </label>
                <input type="submit" value="Submit" /> &nbsp;
            </form>
         </div>
    );
}

export default Name;