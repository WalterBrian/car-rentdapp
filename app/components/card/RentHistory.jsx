"use client";
import React, { useCallback, useState, useEffect } from "react";
import { truncateAddress } from "@/app/utils/truuncateAddress";
import { identiconTemplate } from "../../utils/identiconTemplate";
import { useAccount } from "wagmi";
import { useContractCall } from "@/hooks/useContractRead";
import { ethers } from "ethers";
import { useContractTrans } from "@/hooks/useContractTrans";
import { useContractSend } from "@/hooks/useContractWrite";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";

const RentHistory = ({ id }) => {
  const { address } = useAccount();

  const {
    data: getRent,
    isLoading,
    error,
  } = useContractCall("getRent", [id], true);
  const [rentDetails, setRentDetails] = useState(null);

  
  const getHiredDetails = useCallback(() => {
    if (!getRent) return null;
    setRentDetails({
      carID: Number(getRent[0]),
      bookingAccount: getRent[1],
      name: getRent[2],
      destination: getRent[3],
      amount: Number(getRent[4]),
      paid: Boolean(getRent[5]),
    });
  }, [getRent]);

  

  useEffect(() => {
    getHiredDetails();
  }, [getHiredDetails])

  const { writeAsync: approve } = useContractTrans(
    rentDetails?.amount?.toString() || "1"
  );

  const { writeAsync: hirePayment } = useContractSend("carRentPayment", [
    Number(id)
  ]);


/**
 * Handles the payment process for the ERC20 cUSD token spend on behalf.
 *
 * @throws {string} Failed process allowance
 * @throws {Error} Failed to pay hire ment
 * @return {Promise<void>} A promise that resolves when the payment process is complete
 */
  const handlePayment = async () => {
        if (!approve) throw "Failed process allowance";
        //  approve payment for the ERC20 cUSD token spend on behalf
        await approve();
        // await the transaction
        
        if(!hirePayment) throw new Error('Failed to pay hire ment')
        // once we approve, we handle payment
         await hirePayment();
        // wait for the transaction to make by the user
        
   
  };

  const { openConnectModal } = useConnectModal();


  // send hirepayment when the transfer bottun is clicked
  const payment = async () => {

    try {
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // messages to display during the process of the payments
      await toast.promise(handlePayment(), {
        pending: "Awaiting Payment",
        success: "Payment success, Thank You",
        error: "unexpected error",
      });
    } catch (e) {
      console.log({ e });
    }
  };

  if (!rentDetails) return null;

  const convertHireAmount = ethers.utils.formatEther(rentDetails?.amount?.toString());

  return (
    <div className=" flex items-center justify-center mt-5">
        {address == rentDetails.bookingAccount ? (
            <div className=" w-[402px] h-[270px] bg-[#111113] text-white rounded-lg flex flex-col justify-center  max-sm:w-[350px]">
            <div className=" flex justify-between px-4 items-center mt-[20px]">
              {identiconTemplate(rentDetails.bookingAccount, 12)}
              {rentDetails.paid == false ? (
                <button
                className=" rounded-lg w-[100px] h-[44px] border-black border bg-white text-black font-medium"
                onClick={payment}
              >
                Payment
              </button>
              ) : ( <button
                className=" rounded-lg w-[100px] h-[44px] border-black border bg-white text-black font-medium"
              >
                Completed
              </button>)}
            </div>
            <span className=" mb-[12px] mt-[22px] ml-[25px] text-lg font-semibold">
              <p>{truncateAddress(rentDetails.bookingAccount)}</p>
            </span>
            <div className=" flex ml-[28px] gap-4">
              <p>Name: {rentDetails.name} </p>
              <span className=" flex flex-row gap-2 mr-5 justify-center items-start">
               
              </span>
            </div>
            <div className=" ml-[28px] text-base font-medium  mt-2">
              <p>Destination: {rentDetails.destination} </p>
              <p>Trip Fee: {convertHireAmount}</p>
            </div>
          </div>
        ): (
            <>
                <p className=" text-center">This wallet address have no History with this Car</p>
            </>
        )}
      
    </div>
  );
};

export default RentHistory;
