interface ISms {
  provider: string;
  twilio?: ITwilio;
}

interface ITwilio {
  accountSid: string;
  authToken: string;
  messagingServiceSid: string;
}

export interface ICommunication {
  sms: ISms;
}
