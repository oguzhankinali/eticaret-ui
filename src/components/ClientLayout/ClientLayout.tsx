import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'
import './ClientLayout.css'

export default function ClientLayout(props: { username: string }) {
    return (
        <div>
            <Header username={props.username} />
            <main className="client-main">
                <Outlet />
            </main>
            <footer className="client-footer">
                <p>© 2026 E-Ticaret Sitemiz - Tüm Hakları Saklıdır.</p>
            </footer>
        </div>
    )


}


