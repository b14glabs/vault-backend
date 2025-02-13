import Web3 from "web3";

const CRTSAddress = `0xe48696582061011beadcdb1eb132ff2261ced5cf`;
const ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const readCRTSBalance = async (address: string, block: number): Promise<bigint> => {
  const web3 = new Web3(process.env.RPC_URL);
  const contract = new web3.eth.Contract(ABI, CRTSAddress);
  return contract.methods.balanceOf(address).call({}, block);
};
