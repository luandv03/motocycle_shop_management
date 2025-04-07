import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import MainLayout from "./layouts/main.layout";
import DashboardPage from "./pages/Dashboard.page";
import ProductManagementPage from "./pages/ProductManagement.page";
import BrandManagementPage from "./pages/BrandManagement.page";
import ModelManagementPage from "./pages/ModelManagement.page";
import PartManagementPage from "./pages/PartManagement";
import ProductDetailPage from "./pages/ProductDetail.page";
import ProductDetailEditPage from "./pages/ProductDetailEdit.page";
import CustomerManagementPage from "./pages/CustomerManagement.page";
import CustomerDetailPage from "./pages/CustomerDetail.page";
import RepairManagementPage from "./pages/RepairManagement.page";
import RepairDetailPage from "./pages/RepairDetail.page";
import InvoiceManagementPage from "./pages/InvoiceManagament.page";
import InvoiceDetailPage from "./pages/InvoiceDetail.page";
import PointManagementPage from "./pages/PointManagement.page";
import AccountManagementPage from "./pages/AccountManagement.page";
import SignInPage from "./pages/SignIn.page";
import ProfilePage from "./pages/Profile.page";

function App() {
    // const [searchParams] = useSearchParams();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    ></Route>

                    <Route
                        path="/products/motorcycles"
                        element={<ProductManagementPage />}
                    ></Route>

                    <Route
                        path="/products/brands"
                        element={<BrandManagementPage />}
                    ></Route>

                    <Route
                        path="/products/models"
                        element={<ModelManagementPage />}
                    ></Route>

                    <Route
                        path="/products/parts"
                        element={<PartManagementPage />}
                    ></Route>

                    <Route
                        path="/products/motorcycle/:motorcycleId"
                        element={<ProductDetailPage />}
                    ></Route>

                    <Route
                        path="/products/motorcycles/edit/:id"
                        element={<ProductDetailEditPage />}
                    ></Route>

                    <Route
                        path="/customers"
                        element={<CustomerManagementPage />}
                    ></Route>

                    <Route
                        path="/customers/:customerId"
                        element={<CustomerDetailPage />}
                    ></Route>

                    <Route
                        path="/repairs"
                        element={<RepairManagementPage />}
                    ></Route>

                    <Route
                        path="/repairs/:repairId"
                        element={<RepairDetailPage />}
                    ></Route>

                    <Route
                        path="/invoices"
                        element={<InvoiceManagementPage />}
                    ></Route>

                    <Route
                        path="/invoice/:invoiceId"
                        element={<InvoiceDetailPage />}
                    ></Route>

                    <Route
                        path="/points"
                        element={<PointManagementPage />}
                    ></Route>

                    <Route
                        path="/accounts"
                        element={<AccountManagementPage />}
                    ></Route>

                    <Route path="/profile" element={<ProfilePage />}></Route>
                </Route>
                <Route path="/sign-in" element={<SignInPage />}></Route>
            </Routes>
        </>
    );
}

export default App;
