import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function OrderDetails() {
  return (
   <>
   <Layout>
    <Layout.Section>
        <LegacyCard title="Order Details" sectioned>
            <h2>Order Details</h2>
        </LegacyCard>
    </Layout.Section>
   </Layout>
   </>
  )
}