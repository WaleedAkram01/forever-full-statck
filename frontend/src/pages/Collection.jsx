import { useContext, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/shop'
import { ProductGrid } from '../components/ProductItem'
import { CloseIcon } from '../components/Icons'

const CATEGORIES = ['Women', 'Men', 'Kids']
const SUB_CATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear']

function FilterGroup({ title, keyName, values, selected, products, onToggle }) {
    return (
        <div className="border-b border-line py-6">
            <p className="eyebrow mb-4 text-ink">{title}</p>
            <div className="flex flex-col gap-3 text-sm">
                {values.map((v) => (
                    <label key={v} className="flex cursor-pointer items-center gap-3">
                        <input type="checkbox" checked={selected.includes(v)} onChange={() => onToggle(keyName, v)} className="h-4 w-4 accent-[#9A3B1E]" />
                        <span className={selected.includes(v) ? 'font-medium' : 'text-muted'}>{v}</span>
                        <span className="ml-auto text-xs text-muted">
                            {products.filter((p) => (keyName === 'category' ? p.category : p.subCategory) === v).length}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
}

function Collection() {
    const { products, productsLoading, search, showSearch, setSearch } = useContext(ShopContext)
    const [params, setParams] = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [sortType, setSortType] = useState('newest')

    const category = params.getAll('category')
    const subCategory = params.getAll('sub')

    const toggle = (key, value) => {
        const next = new URLSearchParams(params)
        const current = next.getAll(key)
        next.delete(key)
        const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
        updated.forEach((v) => next.append(key, v))
        setParams(next, { replace: true })
    }

    const clearAll = () => {
        setParams({}, { replace: true })
        setSearch('')
    }

    const filtered = useMemo(() => {
        let list = products.slice()
        const q = search.trim().toLowerCase()
        if (showSearch && q) {
            list = list.filter((p) => `${p.name} ${p.description} ${p.category} ${p.subCategory}`.toLowerCase().includes(q))
        }
        if (category.length) list = list.filter((p) => category.includes(p.category))
        if (subCategory.length) list = list.filter((p) => subCategory.includes(p.subCategory))

        if (sortType === 'low-high') list.sort((a, b) => a.price - b.price)
        else if (sortType === 'high-low') list.sort((a, b) => b.price - a.price)
        else list.sort((a, b) => b.date - a.date)
        return list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, search, showSearch, sortType, params])

    const activeFilters = [...category, ...subCategory]

    return (
        <div className="container-page pt-10">
            <div className="mb-8 flex flex-col gap-2 border-b border-line pb-8">
                <p className="eyebrow">Shop</p>
                <h1 className="text-4xl font-medium sm:text-5xl">{category.length === 1 ? `${category[0]}’s collection` : 'All products'}</h1>
                <p className="text-sm text-muted">{productsLoading ? 'Loading products…' : `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}`}</p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <aside className="lg:w-60 lg:flex-shrink-0">
                    <button onClick={() => setShowFilters(!showFilters)} className="btn-outline w-full lg:hidden">
                        {showFilters ? 'Hide filters' : 'Show filters'}{activeFilters.length > 0 && ` (${activeFilters.length})`}
                    </button>
                    <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                        <FilterGroup title="Category" keyName="category" values={CATEGORIES} selected={category} products={products} onToggle={toggle} />
                        <FilterGroup title="Type" keyName="sub" values={SUB_CATEGORIES} selected={subCategory} products={products} onToggle={toggle} />
                        {activeFilters.length > 0 && (
                            <button onClick={clearAll} className="mt-4 text-sm text-rust underline underline-offset-4">Clear all filters</button>
                        )}
                    </div>
                </aside>

                <div className="flex-1">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                            {activeFilters.map((f) => (
                                <button key={f} onClick={() => toggle(category.includes(f) ? 'category' : 'sub', f)} className="flex items-center gap-1.5 border border-line bg-white px-3 py-1.5 text-xs">
                                    {f} <CloseIcon size={12} />
                                </button>
                            ))}
                        </div>
                        <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="border border-line bg-white px-3 py-2 text-sm outline-none">
                            <option value="newest">Sort: Newest</option>
                            <option value="low-high">Price: Low to high</option>
                            <option value="high-low">Price: High to low</option>
                        </select>
                    </div>

                    {!productsLoading && filtered.length === 0 ? (
                        <div className="border border-dashed border-line px-6 py-20 text-center">
                            <p className="font-display text-2xl">No products found</p>
                            <p className="mt-2 text-sm text-muted">Try a different search or remove some filters.</p>
                            <button onClick={clearAll} className="btn-primary mt-6">Reset filters</button>
                        </div>
                    ) : (
                        <ProductGrid items={filtered} loading={productsLoading} count={9} className="grid-cols-2 md:grid-cols-3" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Collection
