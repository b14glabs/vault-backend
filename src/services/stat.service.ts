import { Contract, JsonRpcProvider } from 'ethers'
import coreVaultAbi from '../abi/core-vault.json'

export const getNotInvestAmount = async () => {
  try {
    const provider = new JsonRpcProvider(process.env.RPC_URL)
    const coreVaultContract = new Contract(
      process.env.CORE_VAULT_ADDRESS,
      coreVaultAbi,
      provider
    )
    const [coreVaultBalance, totalUnbondingAmount] = await Promise.all([
      provider.getBalance(process.env.CORE_VAULT_ADDRESS),
      coreVaultContract.totalUnbondAmount(),
    ])
    return coreVaultBalance - totalUnbondingAmount
  } catch (error) {
    console.error(error)
    return BigInt(0)
  }
}

