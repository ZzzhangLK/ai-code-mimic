// 获取用户列表
export type UserListGet = InterFunction<
    {
        page: number
        size: number
        keyword?: string
    },
    PageResult<{
        id: string
        name: string
        email: string
    }>
>

export const UserApi = {
    UserListGet: (params) => {
        return request.get({ url: '/api/users', params })
    },
}


// 创建用户
export type UserCreatePost = InterFunction<
    {
        name: string
        email: string
        age: number
    },
    {
        id: string
        name: string
        email: string
    }
>

export const UserApi = {
    UserCreatePost: (data) => {
        return request.post({ url: '/api/users', data })
    },
}


// 更新用户信息
export type UserUpdatePut = InterFunction<
    {
        id: string
        name?: string
        email?: string
        age?: number
    },
    {
        id: string
        name: string
        email: string
        age: number
    }
>

export const UserApi = {
    UserUpdatePut: (data) => {
        return request.put({ url: `/api/users/${data.id}`, data })