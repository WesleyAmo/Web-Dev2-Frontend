import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MyAccount from "../views/MyAccount.vue";
import ProductManagement from "../views/ProductManagement.vue";
import CreateProduct from "../views/CreateProduct.vue";
import ShoppingCart from "../views/ShoppingCart.vue";
import ProductView from "../components/products/ProductDetailView.vue"; // Add this import
import ProductList from "../components/products/ProductList.vue"; // Add this import

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/my-account",
      name: "my-account",
      component: MyAccount,
      meta: { requiresAuth: true },
    },
    {
      path: "/management/products",
      name: "management/products",
      component: ProductManagement,
    },
    {
      path: "/cart",
      name: "shoppingcart",
      component: ShoppingCart,
    },
    {
      path: "/products/:id", // Add this new route
      name: "product-detail",
      component: ProductView,
      props: true,
    },
    {
      path: "/products",
      name: "product",
      component: ProductList,
    },
    {
      path: "/productmanagement",
      component: ProductManagement,
    },
    {
      path: "/productmanagement/createproduct",
      component: CreateProduct,
    },
  ],
});
// Navigation guard to check auth status
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isAuthenticated = localStorage.getItem("authToken");

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      next({ name: "login", query: { redirect: to.fullPath } });
    } else {
      // Continue to the route if authenticated
      next();
    }
  } else {
    // Continue to the route if it doesn't require auth
    next();
  }
});
export default router;
