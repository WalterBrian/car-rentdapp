import { useContractWrite, usePrepareContractWrite } from "wagmi";
import ERC20 from '../abis/erc20InstacnceAbi.json'
import CarRent from "../abis/carrent.json"
import { BigNumber } from "ethers";


export const useContractTrans = (hireAmount) => {
    const gasLimit = BigNumber.from(1000000)

    const { config } = usePrepareContractWrite({
        address: ERC20.address,
        abi: ERC20.abi,
        functionName: 'approve',
        args: [CarRent.address, hireAmount],
        overrides: {
            gasLimit
        },
        onError: (err) => {
            console.log({ err });
        }
    })

    const { data, isSuccess, writeAsync, write, error,  isLoading} = useContractWrite(config)
    return { data, isSuccess, writeAsync, write, isLoading}
}
