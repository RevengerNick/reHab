export enum ChannelType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    TELEGRAM = 'TELEGRAM'
  }
  
  export interface Channel {
    id: string;
    type: ChannelType;
    isEnabled: boolean;     
    config: object;
    project: {
      publicId: string;
    };
  }