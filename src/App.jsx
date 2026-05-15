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
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Orders from './pages/admin/Orders'
import Users from './pages/admin/Users'
import Payments from './pages/admin/Payments'
import CartDashboard from './pages/admin/CartDashboard'
import Wishlist from './pages/Wishlist'
import ShippingDashboard from './pages/admin/ShippingDashboard'
import UserDashboard from './pages/user/UserDashboard'
import AddReview from './pages/user/AddReview'
import EditReview from './pages/user/EditReview'
import ProductDetails from './pages/ProductDetails'
import ReviewDashboard from './pages/admin/ReviewDashboard'

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
          path:"/wishlist",
          element: <Wishlist/>
        },
        {
          path:"/checkout",
          element: <Checkout/>
        },
        {
          path: "/dashboard",
          element: <UserDashboard />
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
        },
        {
          path:"/admin/payments",
          element:<Payments/>
        },
        {
          path:"/admin/carts",
          element:<CartDashboard/>
        },
        {
          path:"/admin/shipping",
          element:<ShippingDashboard/>
        },
        {
          path:"/admin/review",
          element:<ReviewDashboard/>
        },
        {
          path:"/reviews/add/:productId",
          element:<AddReview/>
        },
        {
          path:"/reviews/edit/:reviewId",
          element:<EditReview/>
        },
        {
          path:"/product/:productId",
          element:<ProductDetails/>
        }
      ]
    }
  ])

  return (
<>
<LoginProvider>
    <RouterProvider router={routes}/>
</LoginProvider>
</>
  )
}

export default App
