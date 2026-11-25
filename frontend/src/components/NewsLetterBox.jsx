import { useState } from 'react'
import { toast } from 'react-toastify'

function NewsLetterBox() {
    const [email, setEmail] = useState('')

    const onSubmitHandler = (e) => {
        e.preventDefault()
        // Demo only: there is no mailing list backend yet
        toast.success('Thanks! You’re on the list.')
        setEmail('')
    }

    return (
        <section className="container-page mt-24">
            <div className="bg-ink px-6 py-14 text-center text-cream sm:px-12">
                <p className="eyebrow text-rust-light">The Kapra letter</p>
                <h2 className="mt-3 text-3xl font-medium sm:text-4xl">10% off your first order</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">New drops, restocks and the occasional sale. One email a week, never more.</p>
                <form onSubmit={onSubmitHandler} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" required className="flex-1 border border-cream/20 bg-transparent px-4 py-3 text-sm text-cream outline-none placeholder:text-cream/50 focus:border-cream" />
                    <button type="submit" className="bg-rust px-7 py-3 text-sm font-medium text-white transition hover:bg-rust-dark">Subscribe</button>
                </form>
            </div>
        </section>
    )
}

export default NewsLetterBox
