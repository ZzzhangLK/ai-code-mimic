import request from '@/config/axios'
import { InterFunction, InterListFunction } from '@/utils/interface'

// 获得案例库分类树
export type CaseLibraryCategoryTreeGet = InterFunction<
  {
    name?: string
  },
  {
    id: number
    pid: number
    name: string
    children: {
      id: number
      pid: number
      name: string
      children: {
        id: number
        pid: number
        name: string
        children: Array<unknown>
      }[]
    }[]
  }[]
>
//创建案例库分类
export type CaseLibraryCategoryTreeCreate = InterFunction<
  {
    id?: number
    pid?: number
    name?: string
  },
  {}
>
// 更新案例库分类
export type CaseLibraryCategoryTreePut = InterFunction<
  {
    id?: number
    pid?: number
    name?: string
  },
  {}
>
// 删除案例库分类
export type CaseLibraryCategoryTreeDelete = InterFunction<{ id: number }, {}>
// 获得案例库分页
export type CaseLibraryCategoryPage = InterListFunction<
  { callId?: string; categoryId?: string; learningLaunchFlag?: boolean },
  {
    id: string
    callId: string
    caseBrief: string
    caseAnalysis: string
    caseInsight: string
    categoryId: string
    updater: string
    updateTime: string
    learningLaunchCount: number
  }
>
// 更新案例库
export type CaseLibraryCategoryUpdate = InterFunction<
  {
    id?: string
    callId?: string
    caseBrief?: string
    caseAnalysis?: string
    caseInsight?: string
    categoryId?: string
  },
  {}
>
// 删除案例库
export type CaseLibraryCategoryDelete = InterFunction<{ id: string }, {}>
//获得案例库-学习发起记录分页
export type CaseLearningLaunchPage = InterListFunction<
  {
    libraryId: string
  },
  {
    id: number
    launchTime: string
    launchUserName: string
    deadlineTime: string
    requiredCount: number
    completedCount: number
  }
>
// 获得案例库-学习参与明细分页
export type CaseLearningParticipatePage = InterListFunction<
  {
    launchId?: string
    libraryId: string
    completeStatus?: number
  },
  {
    id: number
    launchTime: string
    launchUserName: string
    deadlineTime: string
    userNo: string
    userName: string
    completeStatus: number
    learningTime: string
    learningFeedback: string
  }
>
// 再次发起学习
export type CaseLearningParticipateRelaunch = InterFunction<
  {
    ids: number[]
  },
  {}
>
//根据案例库ID获取案例库学习统计信息（总要求学习人数、总完成学习人数）
export type CaseLibraryCategoryGetLearningStatistics = InterFunction<
  { libraryId: string },
  { totalRequiredCount: number; totalCompletedCount: number }
>
//创建案例库-学习发起记录
export type CaseLearningLaunchCreate = InterFunction<
  {
    libraryId?: string
    deadlineTime?: string
    userNos?: string
  },
  {}
>

// 案例库接口
export const CaseLibraryApi: {
  CaseLibraryCategoryTreeGet: CaseLibraryCategoryTreeGet
  CaseLibraryCategoryTreeCreate: CaseLibraryCategoryTreeCreate
  CaseLibraryCategoryTreePut: CaseLibraryCategoryTreePut
  CaseLibraryCategoryTreeDelete: CaseLibraryCategoryTreeDelete
  CaseLibraryCategoryPage: CaseLibraryCategoryPage
  CaseLibraryCategoryUpdate: CaseLibraryCategoryUpdate
  CaseLibraryCategoryDelete: CaseLibraryCategoryDelete
  CaseLearningLaunchPage: CaseLearningLaunchPage
  CaseLearningParticipatePage: CaseLearningParticipatePage
  CaseLearningParticipateRelaunch: CaseLearningParticipateRelaunch
  CaseLibraryCategoryGetLearningStatistics: CaseLibraryCategoryGetLearningStatistics
  CaseLearningLaunchCreate: CaseLearningLaunchCreate
} = {
  //获得案例库分类树
  CaseLibraryCategoryTreeGet: (params) => {
    return request.get({ url: `/hnaircode/case-library-category/tree`, params })
  },
  //创建案例库分类
  CaseLibraryCategoryTreeCreate: (data) => {
    return request.post({ url: `/hnaircode/case-library-category/create`, data })
  },
  // 更新案例库分类
  CaseLibraryCategoryTreePut: (data) => {
    return request.put({ url: `/hnaircode/case-library-category/update`, data })
  },
  // 删除案例库分类
  CaseLibraryCategoryTreeDelete: (params) => {
    return request.delete({ url: `/hnaircode/case-library-category/delete`, params })
  },
  // 获得案例库分页
  CaseLibraryCategoryPage: (data) => {
    return request.post({ url: `/hnaircode/case-library/page`, data })
  },
  // 更新案例库
  CaseLibraryCategoryUpdate: (data) => {
    return request.put({ url: `/hnaircode/case-library/update`, data })
  },
  // 删除案例库
  CaseLibraryCategoryDelete: (params) => {
    return request.delete({ url: `/hnaircode/case-library/delete`, params })
  },
  // 获得案例库-学习发起记录分页
  CaseLearningLaunchPage: (data) => {
    return request.post({ url: `/hnaircode/case-learning-launch/page`, data })
  },
  // 获得案例库-学习参与明细分页
  CaseLearningParticipatePage: (data) => {
    return request.post({ url: `/hnaircode/case-learning-participant/page`, data })
  },
  // 再次发起学习
  CaseLearningParticipateRelaunch: (data) => {
    return request.post({ url: `/hnaircode/case-learning-participant/relaunchLearning`, data })
  },
  // 根据案例库ID获取案例库学习统计信息（总要求学习人数、总完成学习人数）
  CaseLibraryCategoryGetLearningStatistics: (params) => {
    return request.get({ url: `/hnaircode/case-learning-launch/getTotalCountByLibraryId`, params })
  },
  //创建案例库-学习发起记录
  CaseLearningLaunchCreate: (data) => {
    return request.post({ url: `/hnaircode/case-learning-launch/create`, data })
  }
}
