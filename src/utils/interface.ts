// 分页通用接口
export interface PaginationProps {
  pageNo: number
  pageSize: number
}
// 分页返回类型
export interface PaginationType {
  count: number
  page: number
  page_size: number
  total_pages: number
}

// 通用返回接口(分页)
export interface ResponseListType<D> {
  total: number
  list: Array<D>
}

// 通用返回接口(分页了，但又没有分页)
export interface ResponseItemType<D> {
  code: string
  message: string
  result: {
    total: number
    list: D
  }
}

// 通用返回接口
export interface ResponseType<D> {
  status: string
  data: D
}

// 通用返回接口（有数据）
export interface ResponseDataType<D> {
  success: boolean
  message: string
  data: D
}

// 通用接口封装函数(分页) 建议用这个
export interface InterListFunction<D extends object, T> {
  (req: D & Partial<PaginationProps>): Promise<ResponseListType<T>>
}

// 通用接口封装函数(不分页) 建议用这个
export interface InterFunction<D extends object, T> {
  (req?: D): Promise<T>
}

// 通用接口封装函数(不分页)有data 建议用这个
export interface InterDataFunction<D extends object, T> {
  (req?: D): Promise<ResponseDataType<T>>
}

// 通用接口封装函数(分页了，但又没有分页) 建议用这个
export interface InterItemFunction<D extends object, T> {
  (req: D & Partial<PaginationProps>): Promise<ResponseItemType<T>>
}

// 返回类型封装
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InterDataType<T extends (...args: any) => any> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any
) => Promise<infer U>
  ? U
  : ReturnType<T>

// 返回列表类型封装
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InterListType<T extends (...args: any) => any> = (
  ReturnType<T> extends Promise<infer U> ? U : never
) extends { list: infer V }
  ? V
  : never

// 返回类型封装(分页了，但又没有分页)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InterItemType<T extends (...args: any) => any> = (
  ReturnType<T> extends Promise<infer U> ? U : never
) extends { data: infer V }
  ? V
  : never

// 获取参数类型封装
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InterReqType<T extends (...args: any) => any> = Parameters<T>[0]

// 获取参数类型封装(分页)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InterReqListType<T extends (...args: any) => any> = Omit<
  Parameters<T>[0],
  'pageSize' | 'pageNo' | 'page' | 'page_size'
>
