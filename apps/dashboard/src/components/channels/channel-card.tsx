"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { gql, useMutation } from "@apollo/client";
import { ChannelFormDialog } from "./channel-form-dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ChannelType } from "@/types";

// Мутация для обновления статуса isEnabled
const UPDATE_CHANNEL_STATUS_MUTATION = gql`
  mutation UpdateChannelStatus($updateChannelDto: UpdateChannelDto!) {
    updateChannel(updateChannelDto: $updateChannelDto) {
      id
      isEnabled
    }
  }
`;

interface ChannelDetails {
  name: string;
  icon: string;
}

const CHANNEL_DETAILS: Record<ChannelType, ChannelDetails> = {
  [ChannelType.EMAIL]: { name: "Email", icon: "✉️" },
  [ChannelType.SMS]: { name: "SMS", icon: "📱" },
  [ChannelType.TELEGRAM]: { name: "Telegram", icon: "📱" }
};

export function ChannelCard({ channel, onChannelUpdated }: { 
  channel: { type: ChannelType; isEnabled: boolean; id: string; project: { publicId: string } }; 
  onChannelUpdated: () => void 
}) {
  const channelDetails = CHANNEL_DETAILS[channel.type] || { name: channel.type, icon: "⚙️" };

  const [updateStatus, { loading }] = useMutation(UPDATE_CHANNEL_STATUS_MUTATION, {
    onCompleted: (data) => {
      toast.success(`Канал ${channelDetails.name} ${data.updateChannel.isEnabled ? 'включен' : 'выключен'}.`);
      onChannelUpdated(); // Обновляем данные на странице
    },
    onError: (error) => toast.error("Ошибка!", { description: error.message }),
  });

  const handleStatusChange = (isEnabled: boolean) => {
    // Для мутации нам нужен ID канала и ID проекта (для Guard'а)
    // Мы предполагаем, что channel.project.publicId доступен. Если нет - нужно будет добавить его в запрос
    updateStatus({
      variables: {
        updateChannelDto: { 
          id: channel.id,
          isEnabled: isEnabled,
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <span className="text-2xl">{channelDetails.icon}</span>
          {channelDetails.name}
        </CardTitle>
        <Switch
          checked={channel.isEnabled}
          onCheckedChange={handleStatusChange}
          disabled={loading}
        />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-500">
          {channel.isEnabled ? "Канал активен и готов к отправке." : "Канал выключен."}
        </p>
        <div className="mt-4">
          {/* Этот компонент будет содержать кнопку и диалог для редактирования */}
          <ChannelFormDialog
            isEditing={true}
            publicId={channel.project.publicId} // Передаем ID проекта
            channelToEdit={channel}
            onCompleted={onChannelUpdated}
          >
            <Button variant="outline">Редактировать</Button>
          </ChannelFormDialog>
        </div>
      </CardContent>
    </Card>
  );
}