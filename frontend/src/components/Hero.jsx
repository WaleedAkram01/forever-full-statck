import { Link } from 'react-router-dom'
import heroImg from '../assets/hero_model.jpg'
import { ArrowIcon } from './Icons'

function Hero() {
    return (
        <section className="container-page pt-6 sm:pt-10">
            <div className="grid overflow-hidden bg-sand md:grid-cols-2">
                <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-16">
                    <p className="eyebrow">Autumn / Winter 2026</p>
                    <h1 className="mt-5 text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
                        Clothes you’ll <em className="text-rust">reach for</em> every day.
                    </h1>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                        Overshirts, denim, knits and coats in honest fabrics and easy fits. Made for real days, and built to last.
                    </p>
                    <div className="mt-9 flex flex-wrap gap-3">
                        <Link to="/collection" className="btn-primary">Shop the collection <ArrowIcon size={16} /></Link>
                        <Link to="/collection?sub=Winterwear" className="btn-outline">Winter edit</Link>
                    </div>
                    <dl className="mt-12 grid max-w-sm grid-cols-3 gap-6 border-t border-line pt-6 text-sm">
                        <div><dt className="text-muted">Styles</dt><dd className="mt-1 font-display text-2xl">40+</dd></div>
                        <div><dt className="text-muted">Delivery</dt><dd className="mt-1 font-display text-2xl">2–4 days</dd></div>
                        <div><dt className="text-muted">Exchanges</dt><dd className="mt-1 font-display text-2xl">7 days</dd></div>
                    </dl>
                </div>
                <div className="relative min-h-[420px]">
                    <img src={heroImg} alt="Model wearing an olive utility jacket" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute bottom-5 left-5 bg-cream/95 px-4 py-3 text-sm shadow-sm">
                        <p className="font-medium">New in: Outerwear</p>
                        <p className="text-muted">Trench coats, parkas & more</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
