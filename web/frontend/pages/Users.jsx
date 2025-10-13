import { Page } from "@shopify/polaris";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      console.log("Fetching users...");
      setLoading(true);
      console.log("Fetchi");
      const request = await fetch("/api/getusers", {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      });
      const response = await request.json(); 
      console.log("Users response:", response);
      setUsers(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Page narrowWidth>
      <button onClick={() => fetchData()}>Refresh Users</button>
      {loading ? (
        
        <p>Loading users...</p>
        
      ) : (
        <>
          <p>Total users: {users.length}</p>
          {users.map((user) => (
            <div key={user._id} style={{marginBottom: "20px", padding: "10px", border: "1px solid #ddd"}}>
              <h2>{user.username}</h2>
              <p>{user.useremail}</p>
            </div>
          ))}
          <button onClick={() => fetchData()}>Refresh Users</button>
        </>
      )}
    </Page>
  );
}