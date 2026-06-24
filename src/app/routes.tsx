import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Transaction } from "./pages/Transaction";
import { Customer } from "./pages/Customer";
import { CustomerDetail } from "./pages/CustomerDetail";
import { Stock } from "./pages/Stock";
import { Profile } from "./pages/Profile";
import { SalesOrder } from "./pages/SalesOrder";
import { Login } from "./pages/Login";
import { Pelunasan } from "./pages/Pelunasan";
import { NewCustomer } from "./pages/NewCustomer";

export const router = createHashRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "transaction", Component: Transaction },
      { path: "customer", Component: Customer },
      { path: "customer/:id", Component: CustomerDetail },
      { path: "customer/new", Component: NewCustomer },
      { path: "stock", Component: Stock },
      { path: "profile", Component: Profile },
      { path: "sales-order", Component: SalesOrder },
      { path: "pelunasan", Component: Pelunasan },
    ],
  },
]);

