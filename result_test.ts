export type RoleListPage = InterListFunction<
  { keyword?: string },
  { id: string; name: string; description: string }
>

export type RoleAdd = InterFunction<
  { name: string; description?: string },
  { id: string }
>

export type RoleUpdate = InterFunction<
  { id: string; name?: string; description?: string },
  { success: boolean }
>

export type RoleDelete = InterFunction<
  { id: string },
  { success: boolean }
>

export const RoleApi = {
  RoleListPage: (data) => {
    return request.post({ url: '/api/role/list', data })
  },
  RoleAdd: (data) => {
    return request.post({ url: '/api/role/add', data })
  },
  RoleUpdate: (data) => {
    return request.post({ url: '/api/role/update', data })
  },
  RoleDelete: (data) => {
    return request.post({ url: '/api/role/delete', data })
  }
}