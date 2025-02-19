import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import {
  DEVNET_CROWDFUNDING_CAP,
  DEVNET_CROWDFUNDING_PACKAGEID,
  TESTNET_CROWDFUNDING_CAP,
  TESTNET_CROWDFUNDING_PACKAGEID,
  MAINNET_CROWDFUNDING_CAP,
  MAINNET_CROWDFUNDING_PACKAGEID
} from "./lib/constants";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        crowdfundingPackageID: DEVNET_CROWDFUNDING_PACKAGEID,
        crowdfundingCap: DEVNET_CROWDFUNDING_CAP
      }
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        crowdfundingPackageID: TESTNET_CROWDFUNDING_PACKAGEID,
        crowdfundingCap: TESTNET_CROWDFUNDING_CAP
      }
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        crowdfundingPackageID: MAINNET_CROWDFUNDING_PACKAGEID,
        crowdfundingCap: MAINNET_CROWDFUNDING_CAP
      }
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
