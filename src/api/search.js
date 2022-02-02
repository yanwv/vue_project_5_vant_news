import request from '../utils/request'
export const getSearchSuggestions = (q) => request({
  methods: 'GET',
  url: '/suggestion',
  params: {
    q
  }
})

export const getSearchResult = (params) => request({
  method: "GET",
  url: '/search',
  params
})