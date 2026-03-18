declare module "redux-actions" {
  export type Action<Payload = unknown> = {
    type: string;
    payload?: Payload;
  };

  export type Reducer<State> = (state: State | undefined, action: Action) => State;

  export type ActionFunction<Payload = unknown> = (...args: unknown[]) => Action<Payload>;

  export function createAction<Payload = unknown>(
    type: string,
    payloadCreator?: (...args: unknown[]) => Payload
  ): ActionFunction<Payload>;

  export function handleActions<State, Payload = unknown>(
    handlers: Record<string, (state: State, action: { payload: Payload }) => State>,
    defaultState: State
  ): Reducer<State>;
}
