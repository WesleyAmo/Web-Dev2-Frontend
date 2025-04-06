import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/user/LoginView.vue";
import Register from "../views/user/RegisterView.vue";
import MyAccount from "../views/user/MyAccountView.vue";
import ProductManagement from "../views/management/ProductManagement.vue";
import CreateProduct from "../components/products/CreateProduct.vue";
import ShoppingCart from "../views/ShoppingCartView.vue";
import ProductView from "../views/ProductDetailView.vue";
import ProductList from "../views/ProductsView.vue";
import OrderManagement from "../views/management/OrderManagement.vue";

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
      meta: { requiresAuth: true, requiresAdmin: true }, //  requiresAdmin
    },
    {
      path: "/cart",
      name: "shoppingcart",
      component: ShoppingCart,
    },
    {
      path: "/products/:id",
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
      meta: { requiresAuth: true, requiresAdmin: true }, //  requiresAdmin
    },
    {
      path: "/productmanagement/createproduct",
      component: CreateProduct,
      meta: { requiresAuth: true, requiresAdmin: true }, //  requiresAdmin
    },
    {
      path: "/orders",
      name: "OrderManagement",
      component: OrderManagement,
      meta: { requiresAuth: true, requiresAdmin: true }, //  requiresAdmin
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import("@/stores/auth");
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.initializeAuth();
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      return next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    }

    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      if (!authStore.isAdmin) {
        return next({ name: "home" });
      }
    }
  }

  next();
});

export default router;
