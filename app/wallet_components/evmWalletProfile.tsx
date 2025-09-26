"use client";

import { useAccount, useBalance, useEnsName } from "wagmi";
import { formatUnits } from "viem";

export default function Profile() {
  const { address, chain } = useAccount();

  const { data } = useBalance({ address });

  const { data :ensName } = useEnsName({ address });

  return (
    <div className="grid text-center lg:text-left">
      <h2>Wallet address</h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          {ensName || address}
        </p>
      <h2>Network</h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          {chain?.name || ""}
        </p>
      <h2>Balance</h2>
      <div className={`m-0 max-w-[30ch] text-sm opacity-50`}>
        {data ? (
          <p>
            {Number(formatUnits(data.value, data.decimals)).toFixed(4)}{" "}
            {data.symbol}
          </p>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}