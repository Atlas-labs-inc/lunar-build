import type { NextApiRequest, NextApiResponse } from 'next'
import { utils, Wallet, Provider} from "zksync-web3";
import * as ethers from "ethers";
import { BigNumber } from "@ethersproject/bignumber";

const sendFunds = async (address: string, amount: BigNumber) => {
  const wallet = new Wallet(process.env.FUNDING_KEY, new Provider(process.env.NEXT_PUBLIC_Pl2), new ethers.providers.JsonRpcProvider(process.env.PL1));
  if(!ethers.utils.isAddress(address)){
    throw "Invalid address";
  }


  // Add funds to L2
  if((await wallet.getBalance()).lt(ethers.utils.parseEther("0.1"))){
    console.log("depositing...");
    const depositHandle1 = await wallet.deposit({
      to: wallet.address,
      token: utils.ETH_ADDRESS,
      amount: ethers.utils.parseEther("0.2"),
    });
    // Wait until the deposit is processed
    await depositHandle1.wait();
  }
  console.log("transferring");
  const depositHandle = await wallet.transfer({
      to: address,
      token: utils.ETH_ADDRESS,
      amount: amount,
  });
  // Wait until the deposit is processed
  await depositHandle.wait();
}

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { main_address },
    method,
  } = req
  switch (method) {
    case 'POST':
      await sendFunds(main_address as string, ethers.utils.parseEther("0.005"));
      res.status(200).json({"status": "success"})
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}