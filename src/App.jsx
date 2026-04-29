import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import CategoryPage from './components/CategoryPage'
import ProductManagement from './components/ProductManagement'
import { LoginProvider } from './context/LoginContext'
import Layout from './pages/common/Layout'
import Home from './pages/Home'
import Login from './pages/user/Login'
import Register from './pages/user/Register'
import Cart from './pages/Cart'
import { CartProvider } from './context/CartContext'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Orders from './pages/admin/Orders'
import Users from './pages/admin/Users'

function App() {

  const routes = createBrowserRouter([
    {
      path:"",
      element:<Layout/>,
      children:[
        {
          index: true,
          element: <Home/>
        },
        {
          path:"/login",
          element: <Login/>
        },
        {
          path:"/register",
          element: <Register/>
        },
        {
          path:"/cart",
          element: <Cart/>
        },
        {
          path:"/checkout",
          element: <Checkout/>
        },
        {
          path:"/admin",
          element: <AdminDashboard/>
        },
        {
          path:"/admin/products",
          element: <ProductManagement/>
        },
        {
          path:"/admin/categories",
          element: <CategoryPage/>
        },
        {
          path:"/admin/orders",
          element: <Orders/>
        },
        {
          path:"/admin/users",
          element:<Users/>
        }
      ]
    }
  ])

  return (
<>
<LoginProvider>
  <CartProvider>
    <RouterProvider router={routes}/>
  </CartProvider>
</LoginProvider>
</>
  )
}

export default App
