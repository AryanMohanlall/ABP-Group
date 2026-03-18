import { createAction } from "redux-actions";
import { IProjectItem, IProjectStateContext } from "./context";

type ProjectStatePayload = Partial<IProjectStateContext>;

export enum ProjectStateEnums {
  PROJECT_FETCH_ALL_PENDING = "PROJECT_FETCH_ALL_PENDING",
  PROJECT_FETCH_ALL_SUCCESS = "PROJECT_FETCH_ALL_SUCCESS",
  PROJECT_FETCH_ALL_ERROR = "PROJECT_FETCH_ALL_ERROR",
  PROJECT_FETCH_ONE_PENDING = "PROJECT_FETCH_ONE_PENDING",
  PROJECT_FETCH_ONE_SUCCESS = "PROJECT_FETCH_ONE_SUCCESS",
  PROJECT_FETCH_ONE_ERROR = "PROJECT_FETCH_ONE_ERROR",
  PROJECT_CREATE_PENDING = "PROJECT_CREATE_PENDING",
  PROJECT_CREATE_SUCCESS = "PROJECT_CREATE_SUCCESS",
  PROJECT_CREATE_ERROR = "PROJECT_CREATE_ERROR",
  PROJECT_UPDATE_PENDING = "PROJECT_UPDATE_PENDING",
  PROJECT_UPDATE_SUCCESS = "PROJECT_UPDATE_SUCCESS",
  PROJECT_UPDATE_ERROR = "PROJECT_UPDATE_ERROR",
  PROJECT_DELETE_PENDING = "PROJECT_DELETE_PENDING",
  PROJECT_DELETE_SUCCESS = "PROJECT_DELETE_SUCCESS",
  PROJECT_DELETE_ERROR = "PROJECT_DELETE_ERROR",
}

export const fetchAllPending = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_FETCH_ALL_PENDING,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const fetchAllSuccess = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_FETCH_ALL_SUCCESS,
  ({ items, totalCount }: { items: IProjectItem[]; totalCount: number }) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    items,
    totalCount,
  }),
);

export const fetchAllError = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_FETCH_ALL_ERROR,
  () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const fetchOnePending = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_FETCH_ONE_PENDING,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const fetchOneSuccess = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_FETCH_ONE_SUCCESS,
  (selected: IProjectItem) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    selected,
  }),
);

export const fetchOneError = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_FETCH_ONE_ERROR,
  () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const createPending = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_CREATE_PENDING,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const createSuccess = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_CREATE_SUCCESS,
  () => ({ isPending: false, isSuccess: true, isError: false }),
);

export const createError = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_CREATE_ERROR,
  () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const updatePending = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_UPDATE_PENDING,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const updateSuccess = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_UPDATE_SUCCESS,
  () => ({ isPending: false, isSuccess: true, isError: false }),
);

export const updateError = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_UPDATE_ERROR,
  () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const deletePending = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_DELETE_PENDING,
  () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const deleteSuccess = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_DELETE_SUCCESS,
  () => ({ isPending: false, isSuccess: true, isError: false }),
);

export const deleteError = createAction<Partial<IProjectStateContext>>(
  ProjectStateEnums.PROJECT_DELETE_ERROR,
  () => ({ isPending: false, isSuccess: false, isError: true }),
);
