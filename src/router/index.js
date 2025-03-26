import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MyAccount from "../views/MyAccount.vue";
import ProductManagement from "../views/management/ProductManagement.vue";
import OrderManagement from "../views/management/OrderManagement.vue";
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
    },
    {
      path: "/management/products",
      name: "management/products",
      component: ProductManagement,
    },
    {
      path: "/management/orders",
      name: "management/orders",
      component: OrderManagement,
    },
    {
      path: "/shoppingcart",
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
  ],
});

export default router;
