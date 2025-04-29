export interface Call {
  type: string;
  date: Date;
  trunk: number;
  callTime: number;
}

export interface QueueCall extends Call {
  queue: string;
  callerId: number;
  exitReason: string;
}

export interface InboundCall extends Call {
  source: string;
  disposition: string;
}

export interface OutboundCall extends Call {
  destination: string;
  disposition: string;
}
