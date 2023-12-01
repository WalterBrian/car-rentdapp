"use client";
import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useDebounce } from "use-debounce";
import { ethers } from "ethers";
import { useContractSend } from "@/hooks/useContractWrite";
import { toast } from "react-toastify";

const CarModal = () => {
  const [toggle, setToggle] = useState(false);
  const [loading, setloading] = useState(false);
  const [model, setModel] = useState("");
  const [carImage, setcarImage] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [bookingPrice, setBookingPrice] = useState(0);

  // form validation
  const isFormFilled = model && carImage && plateNumber && bookingPrice;

/**
 * Clears the model, car image, plate number, and booking price.
 */
  const handleClear = () => {
    setModel("");
    setcarImage("");
    setPlateNumber("");
    setBookingPrice(0);
  };
  // the debounce value to input to the blockchain
  const [debounceModel] = useDebounce(model, 500);
  const [debounceCarImage] = useDebounce(carImage, 500);
  const [debouncePlateNumber] = useDebounce(plateNumber, 500);
  const [debouncebookingPrice] = useDebounce(bookingPrice, 500);

  //   convert the mininum car booking price
  const convertBookingPrice = ethers.utils.parseEther(
    debouncebookingPrice.toString() || "0"
  );

  // adding car to the smart contract backend
  const { writeAsync: recordCar } = useContractSend("addCar", [
    debounceModel,
    debounceCarImage,
    debouncePlateNumber,
    convertBookingPrice,
  ]);

  /**
   * Handles the recording of a car.
   *
   * @return {Promise<void>} This function does not return anything.
   * @throws {string} If there is a failure to record the car.
   * @throws {Error} If the form details are not filled correctly.
   */
  const handleRecordCar = async () => {
    if (!recordCar) throw "Failed to record Car";
    setloading("Adding Car");
    if (!isFormFilled) throw new Error("Please fill the correct details");

    const transactTx = await recordCar();
    setloading("Waiting for confirmation");
    await transactTx;
    // set the toggle state to false so as to close the form field box
    setToggle(false);
    // clear the form input after the validation
    handleClear();
  };

  //   let handle the form submission and display all the necessary errors
  const addCar = async(e) => {
    console.log("add car");
    e.preventDefault();
    try {
        await toast.promise(
            handleRecordCar(), {
                pending: "Registering Car",
                success: "Car Successfully registered",
                error: "Error registering your car,"
            }
        )
    } catch (e) {
        console.log({ e })
        toast.error(e?.message || "Something Went wrong. Try again or contact the admin")
    }
  };

  return (
    <div className="flex justify-end mt-10 mb-10">
      <button
        id="modalBioDate"
        type="button"
        data-bs-toggle="modalBioData"
        data-bs-target="#modalCenter"
        className=" text-white font-bold text-lg border-2 rounded-xl py-1 bg-[#06102b] px-3 flex items-center mr-10 flex-col text-center drop-shadow-xl"
        onClick={() => setToggle(true)}
      >
        Add Car
      </button>
      {toggle && (
        // w-[600px] rounded-2xl bg-slate-100 p-5
        <div
          id="modalBioData"
          className="flex justify-center fixed left-0 top-0 items-center w-full h-full mt-6"
        >
          <div className="w-[600px] rounded-2xl bg-slate-100 p-5">
            <form onSubmit={addCar}>
              <div className="mb-8">
                <input
                  type="text"
                  onChange={(e) => setModel(e.target.value)}
                  className="border-4 w-full  border-[#EFAE07] px-4 py-2 rounded-xl"
                  name="carModel"
                  id="carModel"
                  placeholder="Car Name"
                />
              </div>
              <div className="mb-8">
                <input
                  type="text"
                  onChange={(e) => setcarImage(e.target.value)}
                  className="border-4 w-full  border-[#EFAE07] px-4 py-2 rounded-xl"
                  name="carImage"
                  id="carImage"
                  placeholder="Car Image"
                />
              </div>

              <div className="mb-8">
                <input
                  type="text"
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className=" border-4 w-full border-[#EFAE07] px-4 py-2 rounded-xl"
                  name="plateNumber"
                  id="plateNumber"
                  placeholder="Enter Car Plate Number"
                />
              </div>

              <div className="mb-8">
                <input
                  type="number"
                  onChange={(e) => setBookingPrice(e.target.value)}
                  className=" border-4 w-full border-[#EFAE07] px-4 py-2 rounded-xl"
                  name="booking prices"
                  id="bookingprice"
                  placeholder="Minimum booking price"
                />
              </div>
              <div className=" flex justify-between">
                <button
                  type="submit"
                  className=" border-4 text-white border-[#EFAE07] bg-[#06102b] px-4 py-2 rounded-full"
                  disabled={!!loading || !isFormFilled || !recordCar}
                >
                  {loading ? loading : "Adding Car"}
                </button>
                <button type="button" onClick={() => setToggle(false)}>
                  <IoCloseCircle size={30} color="#06102b" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarModal;
