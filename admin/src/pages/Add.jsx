import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../config.js'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const EMPTY = { name: '', description: '', price: '', category: 'Men', subCategory: 'Topwear', bestseller: false, sizes: [] }

const Add = ({ token, isDemo, onAuthError }) => {
    const [images, setImages] = useState([null, null, null, null])
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)

    const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
    const toggleSize = (s) => set('sizes', form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s])
    const setImage = (i, file) => setImages((prev) => prev.map((img, idx) => (idx === i ? file : img)))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!images.some(Boolean)) return toast.error('Add at least one image')
        if (form.sizes.length === 0) return toast.error('Select at least one size')

        const formData = new FormData()
        Object.entries(form).forEach(([k, v]) => formData.append(k, k === 'sizes' ? JSON.stringify(v) : v))
        images.forEach((img, i) => img && formData.append(`image${i + 1}`, img))

        setSaving(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } })
            toast.success(data.message || 'Product added')
            setForm(EMPTY)
            setImages([null, null, null, null])
        } catch (error) {
            if (error.response?.status === 401) onAuthError()
            else toast.error(error.response?.data?.message || 'Could not add product')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl">
            <h1 className="text-3xl font-semibold">Add product</h1>
            <p className="mt-1 text-sm text-muted">New products appear in the store right away.</p>

            <div className="card mt-8 space-y-6 p-6">
                <div>
                    <span className="label">Images (first one is the cover)</span>
                    <div className="flex flex-wrap gap-3">
                        {images.map((img, i) => (
                            <label key={i} className="flex h-32 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-line bg-cream text-xs text-muted hover:border-ink">
                                {img ? <img src={URL.createObjectURL(img)} alt="" className="h-full w-full object-cover" /> : <span>+ Image {i + 1}</span>}
                                <input onChange={(e) => setImage(i, e.target.files[0] || null)} type="file" accept="image/*" hidden />
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="label" htmlFor="name">Product name</label>
                    <input id="name" className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Washed Chambray Shirt" required />
                </div>
                <div>
                    <label className="label" htmlFor="description">Description</label>
                    <textarea id="description" rows={4} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Fabric, fit and what makes it special" required />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label className="label" htmlFor="category">Category</label>
                        <select id="category" className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                            {['Men', 'Women', 'Kids'].map((c) => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label" htmlFor="sub">Type</label>
                        <select id="sub" className="input" value={form.subCategory} onChange={(e) => set('subCategory', e.target.value)}>
                            {['Topwear', 'Bottomwear', 'Winterwear'].map((c) => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label" htmlFor="price">Price (Rs.)</label>
                        <input id="price" className="input" type="number" min="1" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="4990" required />
                    </div>
                </div>

                <div>
                    <span className="label">Sizes</span>
                    <div className="flex flex-wrap gap-2">
                        {SIZES.map((s) => (
                            <button type="button" key={s} onClick={() => toggleSize(s)} className={`h-10 min-w-12 rounded-md border px-3 text-sm transition ${form.sizes.includes(s) ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink'}`}>{s}</button>
                        ))}
                    </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.bestseller} onChange={(e) => set('bestseller', e.target.checked)} className="h-4 w-4 accent-[#9A3B1E]" />
                    Show in bestsellers
                </label>
            </div>

            <button type="submit" disabled={saving || isDemo} className="btn-primary mt-6 px-8 py-3">
                {isDemo ? 'Disabled in demo mode' : saving ? 'Saving…' : 'Add product'}
            </button>
        </form>
    )
}

export default Add
