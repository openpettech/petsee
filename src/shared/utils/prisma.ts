type ConnectInput<T = any> = { id: string; options: T };
type ConnectInputWithProject<T = any> = ConnectInput<T> & { projectId: string };

export const createConnectObject = <T = any>(
  id: string | undefined,
  options?: T,
): { connect: ConnectInput<T> } | object =>
  id ? { connect: { id, ...options } } : {};

export const createConnectArrayObject = <T = any>(
  ids: string[] | undefined,
  options?: T,
): { connect: ConnectInputWithProject<T>[] } | object =>
  ids?.length ? { connect: ids.map((id) => ({ id, ...options })) } : {};
