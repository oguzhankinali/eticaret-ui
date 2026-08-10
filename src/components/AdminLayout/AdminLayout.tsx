import { NavLink, Outlet } from 'react-router-dom'
import './AdminLayout.css'
export default function AdminLayout() {
    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <h3>Admin Paneli</h3>
                <nav>
                    <ul className="admin-menu">
                        <li>
                            <NavLink to="/admin" end className="admin-link">
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/products" end className="admin-link">
                                Ürün Yönetimi
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/orders" end className="admin-link">
                                Siparişler
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>

        </div>
    )
}