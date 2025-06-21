import { useNetworkVariable } from '@/config/networkconfig';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectData } from '@mysten/sui/client';

const useDashboard = () => {
  const dashboardID = useNetworkVariable("crowdfundingDashboard")

  const { data, isPending } = useSuiClientQuery(
    "getObject", {
        id: dashboardID,
        options: {
            showContent: true
        }
    }
  )

  function parse(data: SuiObjectData | null | undefined) {
      if (data == null || data == undefined) return null;
      if (data.content?.dataType != "moveObject") return null;

      return data.content.fields as {
          id: any,
          campaigns: string[]
      };
  }

  return { parse, data, isPending }
}

export default useDashboard