import React from 'react'
import { Layout, LegacyCard } from '@shopify/polaris'

export function Card({title, data, productCard, collectionCard, ordersCard}) {
  return (
    <>
    <Layout.Section oneThird>
     <LegacyCard title={title} sectioned>
    <h2>{productCard? data : collectionCard? data : ordersCard? data : "32"}</h2>
     </LegacyCard>
    </Layout.Section>
    </>
  )
}