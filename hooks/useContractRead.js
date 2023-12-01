import { useContractRead } from "wagmi";
import CarRent from "../abis/carrent.json"
export const useContractCall = (functionName, args, watch) => {

    const resp = useContractRead({

        address: CarRent.address,
        abi: CarRent.abi,
        functionName: functionName,
        args,
        watch,
        onError: (err) => {
            console.log({ err })
        }

    })
    
    return resp
}