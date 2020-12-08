import Main from '../views/Main'
import Movie from '../views/Movie'

const index = [
  {
    path: '/',
    component: Main
  },
  {
    path: '/movie/:id',
    component: Movie,
  }
]

export default index;