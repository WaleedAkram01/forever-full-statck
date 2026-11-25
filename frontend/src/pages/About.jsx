import aboutImg from '../assets/about_store.jpg'
import NewsLetterBox from '../components/NewsLetterBox'

const values = [
    { title: 'Better basics', text: 'Fabrics we would wear ourselves: combed cotton, soft denim and warm wool blends.' },
    { title: 'Fair prices', text: 'No inflated “sale” prices. We price every piece honestly from day one.' },
    { title: 'Easy to shop', text: 'Cash on delivery, card payments, clear sizing and 7-day exchanges.' },
]

const About = () => (
    <>
        <section className="container-page grid items-center gap-12 pt-12 md:grid-cols-2 lg:gap-20">
            <img src={aboutImg} alt="Coats hanging in the Kapra studio" className="aspect-[4/5] w-full object-cover" />
            <div>
                <p className="eyebrow">Our story</p>
                <h1 className="mt-4 text-4xl font-medium leading-tight sm:text-5xl">Everyday clothes, made with care.</h1>
                <div className="mt-6 space-y-4 leading-relaxed text-muted">
                    <p>Kapra (کپڑا) simply means “cloth”. We started with one idea: the clothes you wear most should be the best ones you own.</p>
                    <p>So we focus on the essentials: shirts that hold their shape, denim that gets better with age, knits and coats that keep you warm through Lahore winters. No trends for the sake of trends, just pieces you reach for again and again.</p>
                </div>
            </div>
        </section>

        <section className="container-page mt-24">
            <div className="grid gap-px border border-line bg-line md:grid-cols-3">
                {values.map((v, i) => (
                    <div key={v.title} className="bg-cream p-8 sm:p-10">
                        <p className="font-display text-4xl text-rust">0{i + 1}</p>
                        <p className="mt-6 text-lg font-medium">{v.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
                    </div>
                ))}
            </div>
        </section>

        <NewsLetterBox />
    </>
)

export default About
