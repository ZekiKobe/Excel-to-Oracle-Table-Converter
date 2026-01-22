function UploadCard({
  file,
  tableName,
  uploading,
  uploadStatus,
  message,
  uploadProgress,
  onTableNameChange,
  onFileChange,
  onUpload,
}) {
  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-amhara-blue/10 overflow-hidden">
      <div className="bg-gradient-to-r from-amhara-blue to-amhara-blue/90 px-8 py-5">
        <p className="text-xs uppercase tracking-[0.2em] text-amhara-yellow/80 mb-1">
          Upload interface
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-amhara-yellow leading-tight">
          Upload Excel data into Oracle
        </h2>
        <p className="mt-2 text-sm text-amhara-yellow/80 max-w-xl">
          Use your approved Excel template (.xlsx / .xls). We will validate the columns and insert
          the records directly into the core database.
        </p>
      </div>

      <div className="p-8 space-y-7">
        {/* Table name input */}
        <div className="space-y-2 text-left">
          <label htmlFor="tableName" className="block text-sm font-medium text-gray-800">
            Oracle table name
          </label>
          <input
            id="tableName"
            type="text"
            value={tableName}
            onChange={onTableNameChange}
            placeholder="e.g. DW_EXCEL_UPLOAD"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-amhara-blue focus:border-amhara-blue"
          />
          <p className="text-xs text-gray-500">
            Only letters, numbers, and underscores. Must start with a letter or underscore.
          </p>
        </div>

        {/* Upload Box */}
        <div>
          <div className="relative border border-dashed border-amhara-blue/40 rounded-2xl p-8 text-center transition-all duration-300 hover:border-amhara-yellow hover:bg-amhara-yellow/5 cursor-pointer">
            <input
              type="file"
              id="fileInput"
              accept=".xlsx,.xls"
              onChange={onFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-4">
              <div className="mx-auto bg-amhara-blue/5 p-4 rounded-2xl w-16 h-16 flex items-center justify-center ring-1 ring-amhara-blue/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amhara-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm md:text-base">
                  {file ? file.name : 'Choose Excel file (.xlsx or .xls)'}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {file ? 'Click to change file' : 'Drag & drop or click to browse from your device'}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Maximum file size depends on network and server configuration.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Button + Helper Text */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <button
            onClick={onUpload}
            disabled={uploading || !file}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-sm md:text-base shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={
              uploading || !file
                ? {
                    backgroundColor: '#E5E7EB',
                    color: '#4B5563',
                    cursor: 'not-allowed',
                  }
                : {
                    backgroundColor: '#0033A1',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }
            }
          >
            {uploading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Excel to Oracle'
            )}
          </button>

          <p className="text-xs md:text-sm text-gray-500">
            The upload may take a moment for large files. Please don’t close this window while processing.
          </p>
        </div>

        {/* Status Messages */}
        {uploading && (
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs md:text-sm text-amhara-blue mb-1">
              <span className="font-medium">Uploading file...</span>
              <span className="font-semibold">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-amhara-blue/10 overflow-hidden">
              <div
                className="h-2 bg-amhara-blue transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="bg-amhara-yellow/15 border border-amhara-yellow/60 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center text-amhara-blue">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium text-sm md:text-base">{message}</span>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium text-sm md:text-base">{message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadCard


