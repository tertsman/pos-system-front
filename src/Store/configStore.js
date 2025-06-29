import { create } from 'zustand'


export const configStore = create((set) => ({
  config:{
      category:[],
      role:[],
      supplier:[],
      user:[],
      purchase_status:[],
      brand:[],
      employee:[],
      customer:[]
  },
  setConfig: (params) => set((state) => ({
    config:params
  })),
}))