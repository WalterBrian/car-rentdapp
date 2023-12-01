import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { BigNumber } from 'ethers';
import CarRent from "../abis/carrent.json"
import { toast } from "react-toastify"

export const useContractSend = (functionName, args) => {
    // gas limit to use when sending transaction

    // const gasList = 
    const gasLimit = BigNumber.from(1000000)

    const {config, error} = usePrepareContractWrite({
        // the address of the car rent contract
        address: CarRent.address,
        // the abi of the contract of the car rent
        abi: CarRent.abi,
        functionName,
        args,
        overrides: {
            gasLimit
        },
        onError: (err) => {
            console.log(err);
            // toast.error(err.message)
        }
        
    })

    const {data, isSuccess, write, writeAsync, isLoading, isError} = useContractWrite(config, )
    return { data, isSuccess, write, writeAsync, isLoading, error, isError}
}