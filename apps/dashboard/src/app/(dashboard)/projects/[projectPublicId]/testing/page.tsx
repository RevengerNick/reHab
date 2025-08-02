// apps/dashboard/src/app/(dashboard)/projects/[projectPublicId]/testing/page.tsx
"use client";
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const GET_CHANNELS_QUERY = gql`
  query GetChannelsForTest($publicId: ID!) {
    channels(publicId: $publicId) {
      id
      name
      type
      provider
    }
  }
`;

const TEST_SEND_MUTATION = gql`
  mutation TestSend($input: TestSendInput!) {
    testSend(input: $input) {
      success
    }
  }
`;



export default function TestingPage() {
  const params = useParams();
  const projectPublicId = params.projectPublicId as string;

  const [channel, setChannel] = useState('EMAIL');
  const [recipient, setRecipient] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState('');

  const { data: channelsData, loading: channelsLoading } = useQuery(GET_CHANNELS_QUERY, {
    variables: { publicId: projectPublicId },
    skip: !projectPublicId,
  });

  const [testSend, { loading: sending }] = useMutation(TEST_SEND_MUTATION, {
    onCompleted: () => toast.success("Тестовая задача отправлена!"),
    onError: (error) => toast.error("Ошибка", { description: error.message }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    testSend({ variables: { input: { channelId: selectedChannelId, to: recipient } } });
  };
  
  if (channelsLoading) return <p>Загрузка каналов...</p>;


  return (
    <div>
      <h1 className="text-3xl font-bold">Песочница</h1>
      <p className="mt-2 text-slate-600">Выберите настроенный канал и отправьте тестовое уведомление.</p>
      <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-6">
        <div className="space-y-2">
          <Label>Канал</Label>
          <Select value={selectedChannelId} onValueChange={setSelectedChannelId}>
            <SelectTrigger><SelectValue placeholder="Выберите канал..." /></SelectTrigger>
            <SelectContent>
              {channelsData?.channels.map((channel: any) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name} ({channel.provider})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipient">Получатель</Label>
          <Input
            id="recipient"
            placeholder={channel === 'EMAIL' ? 'test@example.com' : '+79991234567'}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={sending || !selectedChannelId}>
          {sending ? 'Отправка...' : 'Отправить тестовое уведомление'}
        </Button>
        <iframe width="110" height="200" src="https://www.myinstants.com/instant/rebiata-my-razgoniaemsia-52319/embed/" frameBorder="0" scrolling="no"></iframe>
      </form>
    </div>
  );
}