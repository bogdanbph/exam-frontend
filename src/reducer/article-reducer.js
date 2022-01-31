const INITIAL_STATE = {
    articleList: [],
    count: 0,
    error: null,
    fetching: false,
    fetched: false
  }
  
  export default function reducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'GET_ARTICLE_PENDING':
      case 'ADD_ARTICLE_PENDING':
      case 'SAVE_ARTICLE_PENDING':
      case 'DELETE_ARTICLE_PENDING':
        return { ...state, error: null, fetching: true, fetched: false }
      case 'GET_ARTICLE_FULFILLED':
      case 'ADD_ARTICLE_FULFILLED':
      case 'SAVE_ARTICLE_FULFILLED':
      case 'DELETE_ARTICLE_FULFILLED':
        return { ...state, articleList: action.payload.records, count: action.payload.count, error: null, fetching: false, fetched: true }
      case 'GET_ARTICLE_REJECTED':
      case 'ADD_ARTICLE_REJECTED':
      case 'SAVE_ARTICLE_REJECTED':
      case 'DELETE_ARTICLE_REJECTED':
        return { ...state, articleList: [], error: action.payload, fetching: false, fetched: true }
      default:
        return state
    }
  }
  