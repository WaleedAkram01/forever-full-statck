import { Link } from 'react-router-dom'
import Logo from './Logo'

const Footer = () => (
    <footer className="mt-24 border-t border-line bg-sand">
        <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
                <Logo />
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                    Everyday clothing for men, women and kids. Honest fabrics, considered cuts and prices that make sense.
                </p>
            </div>
            <div>
                <p className="eyebrow mb-5">Shop</p>
                <ul className="flex flex-col gap-3 text-sm text-muted">
                    <li><Link to="/collection" className="hover:text-ink">All products</Link></li>
                    <li><Link to="/collection?category=Men" className="hover:text-ink">Men</Link></li>
                    <li><Link to="/collection?category=Women" className="hover:text-ink">Women</Link></li>
                    <li><Link to="/collection?category=Kids" className="hover:text-ink">Kids</Link></li>
                </ul>
            </div>
            <div>
                <p className="eyebrow mb-5">Company</p>
                <ul className="flex flex-col gap-3 text-sm text-muted">
                    <li><Link to="/about" className="hover:text-ink">Our story</Link></li>
                    <li><Link to="/contact" className="hover:text-ink">Contact</Link></li>
                    <li><Link to="/orders" className="hover:text-ink">Track an order</Link></li>
                </ul>
            </div>
            <div>
                <p className="eyebrow mb-5">Help</p>
                <ul className="flex flex-col gap-3 text-sm text-muted">
                    <li>Mon to Sat, 10am to 7pm</li>
                    <li>hello@kapra.store</li>
                    <li>7-day exchanges</li>
                </ul>
            </div>
        </div>
        <div className="border-t border-line">
            <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
                <p>© {new Date().getFullYear()} Kapra. A portfolio project by Waleed Akram.</p>
                <p>Product photos: CC0 (StockSnap)</p>
            </div>
        </div>
    </footer>
)

export default Footer
