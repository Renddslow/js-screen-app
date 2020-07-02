import { ServerResponse as HttpServerResponse } from 'http';

export interface APIError {
  id?: string;
  status: number;
  code: string;
  title: string;
  detail?: string;
}

export interface Response {
  data?: {
    id?: string;
    type: string;
    attributes?: Record<string, any>;
  };
  errors?: Array<APIError>;
}

export interface ServerResponse {
  HttpServerResponse;
  json: (value: Response, status?: number) => void;
}
