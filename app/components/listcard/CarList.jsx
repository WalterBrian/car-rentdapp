import React from "react";
import { useState } from "react";
import Car from "../../components/card/Car";
import { useContractCall } from "@/hooks/useContractRead";

const CarList = () => {
  const { data } = useContractCall("getCarLength", [], true);

  //   to get car length
  const carLength = data ? Number(data.toString()) : 0;
  // states of the errors
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");
  const clearMessage = () => {
    setError("");
    setSuccess("");
    setLoading("");
  };

  // to display all the cars we have for hire
  const getCarLength = () => {
    if (!carLength) return null;
    const registeredCar = [];
    for (let i = 0; i < carLength; i++) {
      registeredCar.push(<Car key={i} id={i} />);
    }
    return registeredCar;
  };
  return (
    <div className="">
      <div className=" mx-auto max-w-4xl py-2 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-3">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {getCarLength()}
        </div>
      </div>
    </div>
  );
};

export default CarList;
