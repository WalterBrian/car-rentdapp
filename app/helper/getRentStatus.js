import carrent from "../../abis/carrent.json"
import { readContract } from "@wagmi/core"

export const getStatus = async ({ params }) => {
  try {
    const rentData = await readContract({
      address: carrent.address,
      abi: carrent.abi,
      functionName: 'getRent',
      args: [params]
    });
    return rentData
  } catch (error) {
    // handle error
  }
};

export const getHIreAmount = async ({ params }) => {
    try {
      const rentData = await readContract({
        address: carrent.address,
        abi: carrent.abi,
        functionName: 'getCars',
        args: [params]
      });
      console.log(rentData)
      return rentData
    } catch (error) {
      // handle error
      console.log(error)
    }
  };
    
