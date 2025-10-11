import {
  Page,
  Layout,
  LegacyCard,
} from "@shopify/polaris";
import { OrderGraphs } from "../components/OrderGraphs";
import { Card } from "../components/Card";
import { OrderDetails } from "../components/OrderDetails";
import React, { useEffect, useState } from 'react'


export default function HomePage() {
  let [product, setProduct] = useState(0);
  let [collection, setCollection] = useState(0);
  let [orders, setOrders] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      let request = await fetch("/api/products/count", {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      })
      let response = await request.json(); 
      console.log("product count response", response.count);
      setProduct(response.count);
    };
    fetchData();
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      let request = await fetch("/api/collections/count", {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      })
      let response = await request.json(); 
      console.log("collection count response", response.count);
      setCollection(response.count);
    };
    fetchData();
  }, [])

  useEffect(()=> {
    const fetchData = async () => {
      let request = await fetch("/api/orders/all", {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      })
      let response = await request.json(); 
      console.log("orders count response", response);
      setOrders(response.count);
    };
    fetchData();

  }, [])

  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
         <div className="home-section">
          <div className="graphs-section">
            <OrderGraphs />
          </div>
          <div className="cards-section">
            <Layout>
                <Card title="Total Orders" />
                <Card title="Fulfilled Orders" />
                <Card title="Remaining Orders" />
                <Card title="Total Products" data={product} productCard />
                <Card title="Total Collections" data={collection} collectionCard />
                <Card title="Order" data={orders} ordersCard />
            </Layout>
          </div>
          <div className="order-details-section">
          <OrderDetails />
          </div>
         </div>

        </Layout.Section>

      </Layout>
    </Page>
  );
}
