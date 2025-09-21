import { use } from 'react';
import UserProfileContent from './UserProfileContent';

interface UserProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = use(params);
  
  return <UserProfileContent userId={resolvedParams.id} />;
}
