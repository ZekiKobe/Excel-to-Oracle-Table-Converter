import { useState } from 'react'
import { uploadExcelFile } from './api'
import Header from './components/Header'
import UploadCard from './components/UploadCard'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

function App() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [tableName, setTableName] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUploadStatus(null)
    setMessage('')
  }

  const handleUpload = async () => {
    const trimmedTableName = tableName.trim()

    if (!trimmedTableName) {
      setUploadStatus('error')
      setMessage('Please enter an Oracle table name.')
      return
    }

    const tableNamePattern = /^[A-Za-z_][A-Za-z0-9_]*$/
    if (!tableNamePattern.test(trimmedTableName)) {
      setUploadStatus('error')
      setMessage('Table name must start with a letter or underscore and contain only letters, numbers, and underscores.')
      return
    }

    if (!file) {
      setUploadStatus('error')
      setMessage('Please select a file to upload')
      return
    }

    // Check file extension
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus('error')
      setMessage('Please upload only .xlsx or .xls files')
      return
    }

    setUploading(true)
    setUploadStatus(null)
    setMessage('')
    setUploadProgress(0)

    try {
      const data = await uploadExcelFile(file, trimmedTableName, (percent) => {
        setUploadProgress(percent)
      })
      setUploadStatus('success')
      setMessage(data.message)
      // Reset file input
      setFile(null)
      document.getElementById('fileInput').value = ''
    } catch (error) {
      setUploadStatus('error')
      setMessage(error.message || 'Network error: Failed to connect to the server')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="max-w-6xl w-full grid gap-8 md:grid-cols-[1.2fr,1fr] items-stretch">
          {/* Upload Card */}
          <UploadCard
            file={file}
            tableName={tableName}
            uploading={uploading}
            uploadStatus={uploadStatus}
            message={message}
            uploadProgress={uploadProgress}
            onTableNameChange={(e) => setTableName(e.target.value)}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
          />

          {/* Side Information Panel */}
          <Sidebar />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App