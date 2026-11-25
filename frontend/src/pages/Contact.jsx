import contactImg from '../assets/contact_store.jpg'

const Contact = () => (
    <section className="container-page grid items-center gap-12 pt-12 md:grid-cols-2 lg:gap-20">
        <div>
            <p className="eyebrow">Contact</p>
            <h1 className="mt-4 text-4xl font-medium leading-tight sm:text-5xl">We’re here to help.</h1>
            <p className="mt-4 max-w-md leading-relaxed text-muted">Questions about sizing, an order or an exchange? Reach out and a real person will get back to you within one working day.</p>

            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                    <dt className="eyebrow text-ink">Studio</dt>
                    <dd className="mt-3 text-sm leading-relaxed text-muted">Main Boulevard, Gulberg III<br />Lahore, Pakistan</dd>
                </div>
                <div>
                    <dt className="eyebrow text-ink">Hours</dt>
                    <dd className="mt-3 text-sm leading-relaxed text-muted">Monday to Saturday<br />10am to 7pm</dd>
                </div>
                <div>
                    <dt className="eyebrow text-ink">Email</dt>
                    <dd className="mt-3 text-sm text-muted">hello@kapra.store</dd>
                </div>
                <div>
                    <dt className="eyebrow text-ink">Orders</dt>
                    <dd className="mt-3 text-sm text-muted">Track yours under <a href="/orders" className="underline underline-offset-4">My orders</a></dd>
                </div>
            </dl>
            <p className="mt-10 text-xs text-muted">Kapra is a portfolio demo store. Contact details are placeholders.</p>
        </div>
        <img src={contactImg} alt="Inside the Kapra studio" className="aspect-[4/5] w-full object-cover" />
    </section>
)

export default Contact
