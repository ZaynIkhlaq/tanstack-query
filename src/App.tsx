import './App.css'
import { PostsList } from './components/posts-lists'
import { CreatePostForm } from './components/create-post-form'

function App() {
  return (
    <div className="App">
      <h1>Tanstack Demo App</h1>
      <div style={{ margin: '12px 0' }}>
        <button
          onClick={() => (window.location.href = '/dev.html')}
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          Open dev page
        </button>
      </div>
      {/* Create Post Form - appears above the posts list */}
      <CreatePostForm />
      {/* Posts List - displays fetched posts with pagination */}
      <PostsList />
    </div>
  )
}

export default App