import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'


export function TopBar() {
  let [storeName, setStoreName] = useState("");
  useEffect(() => {
    const fetchData = async () => {  // Make this function async
      try {
        let request = await fetch("/api/store/info", {  // Add await here
          method: "GET", 
          headers: {
             "Content-type": "application/json"
          }
        });
        let response = await request.json();  // Add await here
        console.log("response store name", response);
        setStoreName(response.data[0].name);
      }
      catch(error) {
        console.log(error);
      }
    };
    
    fetchData();  // Call the async function
  }, []);  // Add dependency array
  
  return (
    <div className="topbar-section">
        <div className="logo-block">
            <img className="logo" src="../assets/logo.png" alt="logo image" />
            <h1 className="text-bold h4">{storeName}</h1>
            <NavLink to="/">Sales</NavLink>
            <NavLink to="/products">Products</NavLink>
        </div>
    </div>
  )
}