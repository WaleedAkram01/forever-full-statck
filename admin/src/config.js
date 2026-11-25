export const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '')

export const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString('en-PK')}`

export const ORDER_STATUSES = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled']

// Shown on the login screen so visitors can explore the panel safely (read-only on the server)
export const DEMO_CREDENTIALS = { email: 'demo@kapra.store', password: 'demo1234' }
