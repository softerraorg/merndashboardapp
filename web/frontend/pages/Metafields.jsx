import {Page} from '@shopify/polaris';
import { Layout, LegacyCard, TextField, Button, FormLayout, Card } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';

export default function MetafieldsPage() {
    

    let [metaObject, setMetaObject] = useState({
        metaname: '',
        metavalue: ''
    });
    let [metafields, setMetafields] = useState([]);


    const handleSubmit = useCallback(() => {
        console.log(metaObject);
    })


    const handleEmailChange = useCallback((value, id) => {
        setMetaObject((oldConfig) => (
            {
            ...oldConfig,
                [id]: value,
            }
        ))
    })

    useEffect(() => {
        fetch('api/metafields/product', {
            method: 'GET',
            headers: {"Content-Type": "application/json"}
        }).then(response => response.json()).then(data => {
            console.log("data product metafields", data);
            setMetafields(data.data || []);
        }).catch(error => console.error('Error:', error));
    })
    return (
        <Page narrowWidth>
            MetafieldsPage
            <Layout>
                <Layout.Section>
                    <LegacyCard title="Metafields" sectioned>
                        
                        <form onSubmit={handleSubmit}>
                        <TextField
                            label="Metafield Name"
                            value={metaObject.metaname}
                            onChange={(value) => handleEmailChange(value, 'metaname')}
                            id="metaname"
                        />
                        <TextField
                            label="Metafield Value"
                            value={metaObject.metavalue}
                            onChange={(value) => handleEmailChange(value, 'metavalue')}
                            id="metavalue"
                        />
                        <Button onClick={handleSubmit}>Submit</Button>
                        </form>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section>
                {metafields.map((metafield) => (
    <Card key={metafield.id}>
        <p>{metafield.namespace}.{metafield.key}</p>
        <p>{metafield.value}</p>
    </Card>
))}
                </Layout.Section>
            </Layout>
        </Page>
    )
}

