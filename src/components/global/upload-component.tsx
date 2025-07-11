import React from 'react'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
type Props = {
    contentId: string
    onContentChange: (contentId: string, newContent: string | string[] | string[][]) => void
}
// WIP: add openai image
const UploadComponent = ({contentId,onContentChange}: Props) => {
    const handleChangeEvent = (e: {cdnUrl: string | string[] | string [][]}) => {
        onContentChange(contentId, e.cdnUrl)
    }
  return (
    <div>
        <FileUploaderRegular sourceList='local, url, dropbox'onFileUploadSuccess={handleChangeEvent} classNameUploader='uc-light' key={process.env.UPLOADCARE_SECRET_KEY} pubkey={process.env.UPLOADCARE_PUBLIC_KEY as string} multiple={false} maxLocalFileSizeBytes={10000000}  />
    </div>
  )
}

export default UploadComponent 