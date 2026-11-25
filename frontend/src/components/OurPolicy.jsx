import { ChatIcon, ReturnIcon, ShieldIcon, TruckIcon } from './Icons'

const items = [
    { Icon: TruckIcon, title: 'Nationwide delivery', text: '2 to 4 working days, Rs. 250 flat.' },
    { Icon: ReturnIcon, title: '7-day exchanges', text: 'Wrong size? Swap it, no questions.' },
    { Icon: ShieldIcon, title: 'Secure checkout', text: 'Pay by card with Stripe or cash on delivery.' },
    { Icon: ChatIcon, title: 'Real support', text: 'Talk to a person, Mon to Sat.' },
]

function OurPolicy() {
    return (
        <section className="container-page mt-24">
            <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
                {items.map(({ Icon, title, text }) => (
                    <div key={title} className="bg-cream p-6 sm:p-8">
                        <Icon size={26} className="text-rust" />
                        <p className="mt-4 font-medium">{title}</p>
                        <p className="mt-1 text-sm text-muted">{text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default OurPolicy
