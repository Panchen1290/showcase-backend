export interface Log {
  type: string;
  startTime: Date | boolean;
  endTime: Date | boolean;
  duration: number;
  disposition: string;
}

export interface QueuePauseLog extends Log {
  queue: string;
}
