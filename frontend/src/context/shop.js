import { createContext } from 'react'

export const ShopContext = createContext()

export const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString('en-PK')}`
