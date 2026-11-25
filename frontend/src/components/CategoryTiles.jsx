import { Link } from 'react-router-dom'
import men from '../assets/cat_men.jpg'
import women from '../assets/cat_women.jpg'
import kids from '../assets/cat_kids.jpg'
import Title from './Title'
import { ArrowIcon } from './Icons'

const tiles = [
    { label: 'Women', img: women, text: 'Blouses, denim, coats' },
    { label: 'Men', img: men, text: 'Shirts, chinos, outerwear' },
    { label: 'Kids', img: kids, text: 'Play-ready everyday wear' },
]

function CategoryTiles() {
    return (
        <section className="container-page mt-24">
            <Title eyebrow="Shop by category" title="Something for everyone" />
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                {tiles.map((t) => (
                    <Link key={t.label} to={`/collection?category=${t.label}`} className="group relative block aspect-[4/5] overflow-hidden bg-sand">
                        <img src={t.img} alt={`${t.label} collection`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6 text-cream">
                            <div>
                                <p className="font-display text-3xl">{t.label}</p>
                                <p className="mt-1 text-sm text-cream/80">{t.text}</p>
                            </div>
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-ink transition group-hover:bg-rust group-hover:text-white"><ArrowIcon size={18} /></span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default CategoryTiles
