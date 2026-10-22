export interface MediaItem {
  uuid: string
  name: string
  url: string
  size: number
  mimeType: string
  width?: number
  height?: number
  alt?: string
  createdAt: string
  updatedAt: string
}

export interface GetMediaParams {
  search?: string
  mimeType?: string
}

export interface UploadMediaPayload {
  file?: File
  name?: string
  url?: string
  alt?: string
  size?: number
  mimeType?: string
  width?: number
  height?: number
}

export interface UpdateMediaPayload {
  name?: string
  alt?: string
}
