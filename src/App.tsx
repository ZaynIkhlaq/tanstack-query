import './App.css'
import { PostsList } from './components/posts-lists'
import { CreatePostForm } from './components/create-post-form'

function App() {
  return (
    <div className="App">
      <h1>Tanstack Demo App</h1>
      {/* Create Post Form - appears above the posts list */}
      <CreatePostForm />
      {/* Posts List - displays fetched posts with pagination */}
      <PostsList />
    </div>
  )
}

export default App