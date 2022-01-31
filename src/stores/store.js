import { createStore, applyMiddleware } from 'redux'
import reducer from '../reducer'

import logger from 'redux-logger'
import promise from 'redux-promise-middleware'

const store = createStore(reducer, applyMiddleware(logger, promise))

export default store
