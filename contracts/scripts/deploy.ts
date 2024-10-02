import hre from "hardhat";
import {
  Address,
  defineChain,
  WriteContractReturnType,
  zeroAddress,
} from "viem";
import fs from "fs";

const donau = defineChain({
  id: 1029,
  rpcUrls: {
    default: {
      http: ["https://pre-rpc.bt.io"],
      webSocket: ["wss://pre-rpc.bt.io:8546"],
    },
  },
  name: "BitTorrent Chain Donau",
  nativeCurrency: { symbol: "BTT", decimals: 18, name: "BitTorrent (BTT)" },
});

async function main() {
  const [deployer] = await hre.viem.getWalletClients({});
  const publicClient = await hre.viem.getPublicClient({});

  async function tx(txn: Promise<WriteContractReturnType>) {
    await publicClient.waitForTransactionReceipt({ hash: await txn });
  }

  const usdj = await hre.viem.deployContract("USDJ", [], {
    client: { wallet: deployer },
  });

  const usdjDecimals = BigInt(Math.pow(10, await usdj.read.decimals()));

  await tx(
    usdj.write.transfer(
      ["0x5dE36d74D5A8497a18Ed5B495A870e583b83B7da", 100_000_000_000n], // Riya
      { account: deployer.account },
    ),
  );

  await tx(
    usdj.write.transfer(
      ["0xAA1bfB4D4eCDbc78A6f929D829fded3710D070D0", 100_000_000_000n], // Kartik
      { account: deployer.account },
    ),
  );

  const periphery = await hre.viem.deployContract(
    "SurityInterface",
    [usdj.address],
    { client: { wallet: deployer } },
  );

  await tx(
    periphery.write.updateStakingRewardRate([10_000n * usdjDecimals], {
      account: deployer.account,
    }),
  );

  await tx(
    periphery.write.setMinimumInitialStake([10n * usdjDecimals], {
      account: deployer.account,
    }),
  );

  const vaultAddress = (await periphery.read.vault()) as Address;
  const surecoinAddress = (await periphery.read.surecoin()) as Address;

  const vault = await hre.viem.getContractAt("Vault", vaultAddress);
  const surecoin = await hre.viem.getContractAt("SureCoin", surecoinAddress);

  const fakeController = await hre.viem.getContractAt(
    "InsuranceController",
    zeroAddress,
  );

  console.log(`USDJ : ${usdj.address}`);
  console.log(`Surity Interface : ${periphery.address}`);
  console.log(`Vault : ${vault.address}`);
  console.log(`SureCoin : ${surecoin.address}`);

  // update evmConfig
  const chain = {
    id: deployer.chain.id,
    name: deployer.chain.name,
    nativeCurrency: deployer.chain.nativeCurrency,
    rpcUrls: deployer.chain.rpcUrls,
    blockExplorers: deployer.chain.blockExplorers,
  };
  const file = `import {defineChain} from "viem"

const primaryChain = defineChain(${JSON.stringify(chain)})

const surityInterface = {adddress : "${periphery.address}" as const, abi : ${JSON.stringify(periphery.abi)} as const}
const surecoin = {adddress : "${surecoin.address}" as const, abi : ${JSON.stringify(surecoin.abi)} as const}
const vault = {adddress : "${vault.address}" as const, abi : ${JSON.stringify(vault.abi)} as const}
const usdj = {adddress : "${usdj.address}" as const, abi : ${JSON.stringify(usdj.abi)} as const}
const insuranceController = {abi : ${JSON.stringify(fakeController.abi)} as const}

export default {primaryChain, surityInterface, surecoin, vault, usdj, insuranceController}
`;

  fs.writeFileSync("./evmConfig.ts", file);
  console.log("\n\nUPDATED EVM CONFIG");
}

main()
  .then(() => {
    console.log("\nDEPLOYED SUCCESSFULLY");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
