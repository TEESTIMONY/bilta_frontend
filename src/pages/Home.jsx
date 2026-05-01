import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Intro from '../components/Intro'
import Services from '../components/Services'
import WhyBilta from '../components/WhyBilta'
import Solutions from '../components/Solutions'
import HowItWorks from '../components/HowItWorks'
import Mission from '../components/Mission'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Services />
        <WhyBilta />
        <Solutions />
        <HowItWorks />
        <Mission />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}

export default Home