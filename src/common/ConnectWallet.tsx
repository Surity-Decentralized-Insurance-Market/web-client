import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import React, { useEffect, useState } from "react";
import Icon from "./Icon";

export default function ConnectWallet() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { chains, chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const [showConnectors, setShowConnectors] = useState(false);
  const [showNetworks, setShowNetworks] = useState(false);
  const [correctNetwork, setCorrectNetwork] = useState(false);

  useEffect(() => {
    const allowedChains = chains.map((c) => c.id);
    chain && setCorrectNetwork(allowedChains.includes(chain.id));
  }, [chain]);

  return (
    <>
      {!isConnected && (
        <button
          onClick={() => setShowConnectors(true)}
          className="flex gap-x-2 items-center bg-foreground min-w-[10vw] justify-center py-2 border border-front/10 rounded-md text-sm font-semibold mobile:px-3"
        >
          <img className="w-[1.3em]" src="/icons/bttc.png" />
          Connect
        </button>
      )}

      {isConnected && (
        <button
          className="font-light flex gap-x-2 items-center bg-foreground min-w-[10vw] justify-center py-2 border border-front/10 rounded-md text-sm"
          onClick={() => setShowNetworks(true)}
        >
          {correctNetwork && (
            <p>
              {address?.slice(0, 5)}....{address?.slice(-5)}
            </p>
          )}

          {!correctNetwork && (
            <p className="text-red-500 font-medium">Wrong Network</p>
          )}
        </button>
      )}

      {showConnectors && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/80">
          <div className="bg-foreground rounded-lg border border-front/20 shadow shadow-front/20 flex flex-col p-5 gap-y-3">
            {connectors.map((connector) => (
              <button
                className="bg-teal-300 w-[33vh] py-2 text-black rounded font-medium disabled:opacity-50"
                disabled={isLoading}
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                  setShowConnectors(false);
                }}
              >
                {connector.name}
              </button>
            ))}
            <button
              className="py-2 bg-red-500 rounded"
              onClick={() => {
                setShowConnectors(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showNetworks && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/80">
          <div className="bg-foreground rounded-lg border border-front/20 shadow shadow-front/20 flex flex-col p-5 gap-y-4">
            <p className="text-center">Choose Network</p>
            {chains.map((chain) => (
              <button
                className="bg-teal-300 w-[40vh] py-2 text-black rounded font-medium disabled:opacity-50"
                key={chain.id}
                onClick={() => {
                  switchNetwork && switchNetwork(chain.id);
                  setShowNetworks(false);
                }}
              >
                {chain.name}
              </button>
            ))}
            <button
              className="py-2 bg-red-500 rounded"
              onClick={() => {
                disconnect();
                setShowNetworks(false);
              }}
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </>
  );
}
