import { AuthProvider } from './features/auth/context/AuthContext';
import { Header } from './features/shared/components/Header/Header';
import { Footer } from './features/shared/components/Footer/Footer';
import { Outlet } from 'react-router';

function App() {
    return (
        <AuthProvider>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </AuthProvider>
    );
}

export default App;