import { Address, NFTCard, Connector, ConnectButton, useAccount } from "@ant-design/web3";
import { http, useReadContract, useWriteContract } from 'wagmi';
import { Mainnet, WagmiWeb3ConfigProvider, MetaMask } from '@ant-design/web3-wagmi';
import { Button, message } from 'antd';
import {parseEther } from 'viem';

const CallTest = () => {
  const { writeContract } = useWriteContract();
  const { account } = useAccount();
  const { data } = useReadContract({
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [
          {
            type: 'uint256',
            name: '',
          }
        ],
      }
    ],
    address: '0xEcd0D12E21805803f70de03B72B1C162dB0898d9',
    functionName: 'balanceOf',
    args: [account?.address as `0x${string}`],
  });
  return <div>{data?.toString()}

    <Button
     onClick={ () => {
      writeContract({
        abi:[{
          type: 'function',
          name: 'mint',
          stateMutability: 'payable',
          inputs: [{ internalType: 'uint256', name: 'quantity', type: 'uint256' }], 
          outputs: [], 
        }],
        address: '0xEcd0D12E21805803f70de03B72B1C162dB0898d9',
        functionName: 'mint',
        args: [BigInt(1)],
        value: parseEther('0.01'),

      }, {
        onSuccess: () => {
          message.success('Mint success');
        },
        onError: (error) => {       
          message.error(`Mint failed: ${error.message}`);
        }
      })}}>
        Mint
    </Button>
    </div>
}

export default function Web3() {

  async function getAccount() {
    const accounts = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err: any) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });
    const account = accounts[0];
    return account;
  }

  // await getAccount(); // 你的账户地址

  return (
    <WagmiWeb3ConfigProvider
      chains={[Mainnet]}
      transports={{
        [Mainnet.id]: http('https://api.zan.top/node/v1/eth/mainnet/1b007c60cff1487fb27f237aa900e617')
      }}
      wallets={[MetaMask()]}>
      <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
      <NFTCard address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" tokenId={641} />
      <Connector>
        <ConnectButton />
      </Connector>
      <CallTest />
    </WagmiWeb3ConfigProvider>

  );
}