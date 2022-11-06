// apiResponse?.status === 204, if sent successfully!
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import type { NextApiRequest, NextApiResponse } from 'next'

const sendNotification = async (receiver: string, title: string, body: string) => {
  const PK = process.env.NEXT_PUBLIC_CHANNEL_PUSH_DELEGATOR_KEY; // channel private key
  const signer = new ethers.Wallet(PK);

  const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: title,
        body: body
      },
      payload: {
        title: title,
        body: body,
        cta: '',
        img: ''
      },
      recipients: `eip155:5:${receiver}`, // recipient address
      channel: 'eip155:5:0x52312AD6f01657413b2eaE9287f6B9ADaD93D5FE', // your channel address
      env: 'staging'
    });
  }
  export default async function(req: NextApiRequest, res: NextApiResponse) {
    const {
      body: { address, title, body },
      method,
    } = req
    switch (method) {
      case 'POST':
        await sendNotification(address, title, body)
        res.status(200).json({"status": "success"})
        break
      default:
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  }