/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  email: string;
}

export interface ListUsersRequest {
  pageSize: number;
  pageToken: string;
  filter: ListUsersRequest_ListUsersFilter | undefined;
}

export interface ListUsersRequest_ListUsersFilter {}

export interface ListUsersResponse {
  users: User[];
  nextPageToken: string;
}

export interface GetUserRequest {
  id: string;
}

export interface GetUserResponse {
  user: User | undefined;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  email: string;
}

export interface CreateUserResponse {
  user: User | undefined;
}

export interface UpdateUserRequest {
  id: string;
  user: UserInput | undefined;
}

export interface UpdateUserResponse {
  user: User | undefined;
}

export interface DeleteUserRequest {
  id: string;
}

export interface DeleteUserResponse {
  success: boolean;
}

export interface AuthenticateRequest {
  email: string;
  password: string;
}

export interface AuthenticateResponse {
  user: User | undefined;
}

export interface UserServiceClient {
  /** Users */

  listUsers(request: ListUsersRequest): Observable<ListUsersResponse>;

  getUser(request: GetUserRequest): Observable<GetUserResponse>;

  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;

  updateUser(request: UpdateUserRequest): Observable<UpdateUserResponse>;

  deleteUser(request: DeleteUserRequest): Observable<DeleteUserResponse>;

  authenticate(request: AuthenticateRequest): Observable<AuthenticateResponse>;
}

export interface UserServiceController {
  /** Users */

  listUsers(
    request: ListUsersRequest,
  ):
    | Promise<ListUsersResponse>
    | Observable<ListUsersResponse>
    | ListUsersResponse;

  getUser(
    request: GetUserRequest,
  ): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse;

  createUser(
    request: CreateUserRequest,
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse;

  updateUser(
    request: UpdateUserRequest,
  ):
    | Promise<UpdateUserResponse>
    | Observable<UpdateUserResponse>
    | UpdateUserResponse;

  deleteUser(
    request: DeleteUserRequest,
  ):
    | Promise<DeleteUserResponse>
    | Observable<DeleteUserResponse>
    | DeleteUserResponse;

  authenticate(
    request: AuthenticateRequest,
  ):
    | Promise<AuthenticateResponse>
    | Observable<AuthenticateResponse>
    | AuthenticateResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'listUsers',
      'getUser',
      'createUser',
      'updateUser',
      'deleteUser',
      'authenticate',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_SERVICE_NAME = 'UserService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
