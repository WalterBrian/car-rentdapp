import Image from 'next/image'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CarModal from './components/modals/CarModal'
import BookCar from './components/BookCar'


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BookCar />
      {/* <CarModal /> */}
    </>
  )
}
