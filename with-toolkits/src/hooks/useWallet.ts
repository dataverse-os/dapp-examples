import { Methods, SignMethod } from "@dataverse/core-connector";
import { useConfig } from "../context/configContext";
import { useUser } from "../context/userContext";

export function useWallet() {
  const { coreConnector } = useConfig();
  const { userInfo, updateUserInfo } = useUser();

  const connectWallet = async () => {
    const { wallet, address } = await coreConnector.connectWallet();
    updateUserInfo({ address, wallet });
    return {
      address,
      wallet,
    };
  };

  const switchNetwork = async (chainId: number) => {
    const res = await coreConnector.runOS({
      method: Methods.switchNetwork,
      params: chainId,
    });
    return res;
  };

  const sign = async (params: { method: SignMethod; params: any[] }) => {
    const res = await coreConnector.runOS({
      method: Methods.sign,
      params,
    });
    return res;
  };

  const contractCall = async (params: {
    contractAddress: string;
    abi: any[];
    method: string;
    params: any[];
  }) => {
    const res = await coreConnector.runOS({
      method: Methods.contractCall,
      params,
    });
    return res;
  };

  const ethereumRequest = async (params: { method: string; params?: any }) => {
    const res = await coreConnector.runOS({
      method: Methods.ethereumRequest,
      params,
    });
    return res;
  };

  const getPKP = async () => {
    const res = await coreConnector.runOS({
      method: Methods.getPKP,
    });
    return res;
  };

  const executeLitAction = async (params: {
    code: string;
    jsParams: object;
  }) => {
    const res = await coreConnector.runOS({
      method: Methods.executeLitAction,
      params,
    });
    return res;
  };

  return {
    wallet: userInfo.wallet,
    address: userInfo.address,
    connectWallet,
    switchNetwork,
    sign,
    contractCall,
    ethereumRequest,
    getPKP,
    executeLitAction,
  };
}
