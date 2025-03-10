export class Response<T> {
  success?: boolean | true;
  result?: T;
  message?: string | 'Success';
}

export type ResponseBody<T> = Response<T>;
