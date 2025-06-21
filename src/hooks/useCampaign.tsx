import { useSuiClientQuery } from '@mysten/dapp-kit'
import { SuiObjectData } from '@mysten/sui/client';

const useCampaign = ({ id }: { id: string }) => {
  const { data: response, refetch: refetch, error, isPending } = useSuiClientQuery(
        "getObject", {
            id,
            options: {
                showContent: true
            }
        }
    )

    function parse(data: SuiObjectData | null | undefined) {
        if (data == null || data == undefined) return null;
        if (data?.content?.dataType !== "moveObject") return null;

        const { id, title, description, startTime, endTime, goal, treasury, donations, ...others } = data.content.fields as any;
        return {
            id,
            title,
            description,
            startTime: Number(startTime),
            endTime: Number(endTime),
            goal: Number(goal),
            treasury: Number(treasury),
            donations: Number(donations),
            ...others
        }
    }

    return {parse, response, isPending, refetch, error}
}

export default useCampaign