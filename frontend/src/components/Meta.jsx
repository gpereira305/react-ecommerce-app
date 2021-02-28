import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Bem Vindo à TechShop',
  description: 'Temos promoções diariamente',
  keywords: 'Smartwatches, Smartphones,  Eletrônicos HiTech',
}

export default Meta;