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
import AdminLayout from './pages/admin/AdminLayout'
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
import CouponDashboard from './pages/admin/CouponDashboard'

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
          element:<AdminLayout/>,
          children: [
            {
              index: true,
              element: <AdminDashboard />
            },
            {
              path: "products",
              element: <ProductManagement />
            },
            {
              path: "categories",
              element: <CategoryPage />
            },
            {
              path: "orders",
              element: <Orders />
            },
            {
              path: "users",
              element:<Users />
            },
            {
              path: "payments",
              element:<Payments />
            },
            {
              path: "carts",
              element:<CartDashboard />
            },
            {
              path: "shipping",
              element:<ShippingDashboard />
            },
            {
              path: "review",
              element:<ReviewDashboard />
            },
            {
              path: "coupon",
              element:<CouponDashboard />
            },
          ]
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
