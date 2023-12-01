import { useContractSend } from "@/hooks/useContractWrite";
import { readContract } from "@wagmi/core";
import ERC20 from "@/abis/erc20InstacnceAbi.json";
import carRent from "@/abis/carrent.json"




export const approveMsg = async (amount) => {
 try {
     const data = await readContract({
       address: ERC20.address,
       abi: ERC20.abi,
       functionName: "approve",
       args: [carRent.address, amount]
     });
     return data
 } catch (error) {
    console.log(error)
 }
};
