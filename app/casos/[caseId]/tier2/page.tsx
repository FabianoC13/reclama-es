import Tier2Flow from '@/components/tier2/Tier2Flow';

export default function Tier2Page({ params }: { params: { caseId: string } }) {
  return <Tier2Flow caseId={params.caseId} />;
}
