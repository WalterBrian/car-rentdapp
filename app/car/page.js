'use client'
import React from 'react'
import Navbar from '../components/Navbar'
import { FaCopy } from 'react-icons/fa'
import CarItem from '../components/card/Car'
import CarModal from '../components/modals/CarModal'
import { useAccount } from "wagmi"
import CarList from '../components/listcard/CarList'
const Car = () => {

  const { address } = useAccount()
  return (
    <div>
        <Navbar />
        <div>
          <p className=' text-center mt-5 text-lg'>{address == "0x9dBa18e9b96b905919cC828C399d313EfD55D800" ? <p>This is admin account</p>: ""} </p>
            <CarModal />
            {/* <CarItem /> */}
            <CarList />
        </div>
    </div>
  )
}

export default Car
