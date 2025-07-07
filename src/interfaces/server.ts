export interface Server {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly last_accessed: string;
}

export interface ServerDetails extends Server {
  readonly api_key: string;
}
