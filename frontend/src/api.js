export function uploadExcelFile(file, tableName, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    if (tableName) {
      formData.append('table_name', tableName)
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://localhost:8000/api/upload-excel/')

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(percent)
      }
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || '{}')
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data)
        } else {
          const message = data?.message || 'Unknown server error'
          reject(new Error(message))
        }
      } catch (e) {
        reject(new Error('Invalid server response'))
      }
    }

    xhr.onerror = () => {
      reject(new Error('Network error: Failed to connect to the server'))
    }

    xhr.send(formData)
  })
}


