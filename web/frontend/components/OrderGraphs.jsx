import React, { useState } from 'react'
import { Layout, LegacyCard } from '@shopify/polaris'
import { storeData} from "../data"

import { Chart as ChartJs} from "chart.js/auto"
import { Line, Doughnut, Bar } from "react-chartjs-2"

export function OrderGraphs() {

    let [data, setData] = useState({
        labels: storeData?.map(item => item.year) || [],
        datasets: [
            {
                label: "Order Details",
                data: storeData?.map(item => item.orders) || [],
                backgroundColor: ["#008170", "#000", '#8e8e8e', "#81b737" ]
            }
        ]
    })
    console.log("storeData imported:", storeData);
  return (
    <>
    <Layout>
        <Layout.Section>
         <div className="home-section">
          <div className="graphs-section">
            <Layout>
              <Layout.Section oneHalf>
                <LegacyCard title="Total Orders" sectioned>
                    <Line data={data} options={{responsive: true, maintainAspectRatio: false}}/>

                </LegacyCard>

              </Layout.Section>
              <Layout.Section oneThird>
                <LegacyCard title="Completed Orders" sectioned>
                 <Doughnut data={data} options={{responsive: true, maintainAspectRatio: false}}/>
                </LegacyCard>

              </Layout.Section>
              <Layout.Section oneThird>
                <LegacyCard title="Remaining Orders" sectioned>
                 <Bar data={data} options={{responsive: true, maintainAspectRatio: false}}/>
                </LegacyCard>
                
              </Layout.Section>

            </Layout>
          </div>
        </div>
      </Layout.Section>
    </Layout>
    </>
  )
}