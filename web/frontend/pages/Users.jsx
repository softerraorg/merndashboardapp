import {
    Page,
    Layout,
    LegacyCard,
    DataTable,
  } from "@shopify/polaris";
  import { useEffect, useState } from "react";

  
  
  
  export default function Users() {

    let [users, setUsers] = useState([]);
    let getUsers = () => {

   fetch('api/getusers')
      .then(response => response.json())
      .then(data => {setUsers(data);console.log("users data", data)})
      .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
      getUsers();
    }, []);

  return (

    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <LegacyCard title="Users" sectioned>
            <DataTable 
              columnContentTypes={[
                'text',
                'text',
              ]}
              headings={[
                'Username',
                'Email',
              ]}
              rows={users.map((user) => [
                user.username,
                user.useremail,
              ])}
            />
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
  }