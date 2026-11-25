import Hero from '../components/Hero'
import CategoryTiles from '../components/CategoryTiles'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'

function Home() {
    return (
        <>
            <Hero />
            <CategoryTiles />
            <LatestCollection />
            <BestSeller />
            <OurPolicy />
            <NewsLetterBox />
        </>
    )
}

export default Home
