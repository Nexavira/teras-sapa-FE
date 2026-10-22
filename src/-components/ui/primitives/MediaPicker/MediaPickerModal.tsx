import React, { useEffect, useMemo, useState } from 'react'

import styled from '@emotion/styled'
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CloudUploadIcon,
  Copy01Icon,
  Delete02Icon,
  File01Icon,
  Image01Icon,
  InformationCircleIcon,
  Link01Icon,
  Search01Icon,
  Tick02Icon,
} from 'hugeicons-react'

import {
  useDeleteMedia,
  useGetMedia,
  useUpdateMedia,
  useUploadMedia,
} from '#/services/media'
import type { MediaItem } from '#/types/media.type'

import { theme } from '../../theme'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { Card } from '../Card'
import { Divider } from '../Divider'
import { IconButton } from '../IconButton'
import { Typography } from '../Typography'

export interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaItem) => void
  initialSelectedUrl?: string
  title?: string
  accept?: string
}

type TabType = 'library' | 'upload' | 'url'

const formatBytes = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const formatDate = (dateString: string): string => {
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

// Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ModalContainer = styled(Card)`
  width: 980px;
  max-width: 96vw;
  height: 85vh;
  max-height: 820px;
  background-color: ${theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
`

const ModalHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${theme.colors.white};
`

const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const HeaderIconBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${theme.colors.primary.LIGHTER};
  color: ${theme.colors.primary.DEFAULT};
  display: grid;
  place-items: center;
`

const TabsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 24px;
  border-bottom: 1px solid ${theme.colors.border};
  background-color: #fafafa;
`

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? theme.colors.primary.DEFAULT : 'transparent')};
  color: ${({ $active }) =>
    $active ? theme.colors.primary.DEFAULT : theme.colors.text.secondary};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${theme.colors.primary.DEFAULT};
    background-color: rgba(0, 168, 107, 0.04);
  }
`

const ModalBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
`

const LibraryView = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Toolbar = styled.div`
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
`

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 360px;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: ${theme.colors.muted};
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 38px;
    padding: 0 12px 0 38px;
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
    background: ${theme.colors.paper};
    color: ${theme.colors.text.primary};
    font-size: 0.88rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: ${theme.colors.primary.DEFAULT};
      background: ${theme.colors.white};
      box-shadow: 0 0 0 3px rgba(0, 168, 107, 0.12);
    }
  }
`

const GridContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  align-content: start;
  background-color: #fafbfc;
`

const ImageCard = styled.div<{ $selected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.white};
  border: 2px solid
    ${({ $selected }) =>
      $selected ? theme.colors.primary.DEFAULT : theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 0 0 3px rgba(0, 168, 107, 0.2), 0 4px 12px rgba(0, 0, 0, 0.08)'
      : '0 1px 3px rgba(0, 0, 0, 0.04)'};

  &:hover {
    border-color: ${({ $selected }) =>
      $selected ? theme.colors.primary.DEFAULT : theme.colors.gray[400]};
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.07);
  }
`

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: ${theme.colors.paper};
  display: grid;
  place-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }

  ${ImageCard}:hover & img {
    transform: scale(1.04);
  }
`

const CardCheckBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${theme.colors.primary.DEFAULT};
  color: ${theme.colors.white};
  display: grid;
  place-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 2;
`

const CardFooter = styled.div`
  padding: 8px 10px;
  background: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const CardFileName = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardMeta = styled.span`
  font-size: 0.7rem;
  color: ${theme.colors.text.secondary};
`

// Sidebar / Detail pane
const DetailPane = styled.div`
  width: 320px;
  border-left: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
  gap: 18px;

  @media (max-width: 820px) {
    display: none;
  }
`

const PreviewBox = styled.div`
  width: 100%;
  height: 190px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.paper};
  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const MetaRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const MetaLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${theme.colors.text.secondary};
`

const MetaInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  font-size: 0.85rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  background: ${theme.colors.paper};
  color: ${theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.DEFAULT};
    background: ${theme.colors.white};
  }
`

const MetaInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${theme.colors.paper};
  font-size: 0.78rem;
`

// Dropzone Upload Area
const UploadView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 24px;
  background: #fafbfc;
`

const DropzoneBox = styled.div<{ $isDragging: boolean }>`
  width: 100%;
  max-width: 580px;
  padding: 48px 32px;
  border: 2px dashed
    ${({ $isDragging }) =>
      $isDragging ? theme.colors.primary.DEFAULT : theme.colors.border};
  border-radius: 14px;
  background: ${({ $isDragging }) =>
    $isDragging ? 'rgba(0, 168, 107, 0.05)' : theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary.DEFAULT};
    background: rgba(0, 168, 107, 0.02);
  }
`

const UploadIconCircle = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: ${theme.colors.primary.LIGHTER};
  color: ${theme.colors.primary.DEFAULT};
  display: grid;
  place-items: center;
  margin-bottom: 6px;
`

// URL Import View
const UrlView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 24px;
  background: #fafbfc;
`

const UrlBox = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
`

// Footer
const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SelectedPreviewFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  img {
    width: 38px;
    height: 38px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid ${theme.colors.border};
  }
`

const EmptyLibraryState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 12px;
  color: ${theme.colors.text.secondary};
`

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialSelectedUrl,
  title = 'Pustaka Media & Konten',
  accept = 'image/*',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('library')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit details state
  const [editingName, setEditingName] = useState('')
  const [editingAlt, setEditingAlt] = useState('')

  // URL import state
  const [importUrl, setImportUrl] = useState('')
  const [importName, setImportName] = useState('')
  const [importAlt, setImportAlt] = useState('')

  // Services
  const { data: mediaItems = [], isLoading } = useGetMedia({
    search: searchQuery,
  })
  const uploadMediaMutation = useUploadMedia()
  const updateMediaMutation = useUpdateMedia()
  const deleteMediaMutation = useDeleteMedia()

  // Pre-select initial media if exists
  useEffect(() => {
    if (initialSelectedUrl && mediaItems.length > 0 && !selectedMedia) {
      const match = mediaItems.find((item) => item.url === initialSelectedUrl)
      if (match) {
        setSelectedMedia(match)
      }
    }
  }, [initialSelectedUrl, mediaItems, selectedMedia])

  // Sync editing inputs when selected item changes
  useEffect(() => {
    if (selectedMedia) {
      setEditingName(selectedMedia.name)
      setEditingAlt(selectedMedia.alt || '')
      setIsDeleting(false)
    }
  }, [selectedMedia])

  if (!isOpen) return null

  const handleSelectCard = (item: MediaItem) => {
    if (selectedMedia?.uuid === item.uuid) {
      // Toggle or keep selected
      setSelectedMedia(item)
    } else {
      setSelectedMedia(item)
    }
  }

  const handleConfirmSelect = () => {
    if (selectedMedia) {
      onSelect(selectedMedia)
      onClose()
    }
  }

  const handleSaveDetails = async () => {
    if (!selectedMedia) return
    try {
      const updated = await updateMediaMutation.mutateAsync({
        uuid: selectedMedia.uuid,
        payload: {
          name: editingName,
          alt: editingAlt,
        },
      })
      setSelectedMedia(updated)
    } catch (err) {
      console.error('Failed to update media info:', err)
    }
  }

  const handleDeleteCurrent = async () => {
    if (!selectedMedia) return
    try {
      await deleteMediaMutation.mutateAsync(selectedMedia.uuid)
      setSelectedMedia(null)
      setIsDeleting(false)
    } catch (err) {
      console.error('Failed to delete media item:', err)
    }
  }

  const handleCopyUrl = () => {
    if (!selectedMedia) return
    navigator.clipboard.writeText(selectedMedia.url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      await uploadFiles(files)
    }
  }

  const uploadFiles = async (files: Array<File>) => {
    try {
      for (const file of files) {
        const uploaded = await uploadMediaMutation.mutateAsync({ file })
        setSelectedMedia(uploaded)
      }
      setActiveTab('library')
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const handleImportByUrl = async () => {
    if (!importUrl) return
    try {
      const uploaded = await uploadMediaMutation.mutateAsync({
        url: importUrl,
        name: importName || 'imported-image.jpg',
        alt: importAlt || importName || 'Imported Content',
      })
      setSelectedMedia(uploaded)
      setImportUrl('')
      setImportName('')
      setImportAlt('')
      setActiveTab('library')
    } catch (err) {
      console.error('URL import failed:', err)
    }
  }

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <ModalHeader>
          <HeaderTitleGroup>
            <HeaderIconBadge>
              <Image01Icon size={22} />
            </HeaderIconBadge>
            <div>
              <Typography
                variant="title"
                style={{ fontSize: '1.15rem', fontWeight: 700 }}
              >
                {title}
              </Typography>
              <Typography variant="caption" color="secondary">
                Pilih dari galeri, unggah berkas baru, atau kelola aset media
                toko
              </Typography>
            </div>
          </HeaderTitleGroup>
          <IconButton
            size="sm"
            variant="ghost"
            onClick={onClose}
            aria-label="Tutup modal"
          >
            <Cancel01Icon size={18} />
          </IconButton>
        </ModalHeader>

        {/* Navigation Tabs */}
        <TabsBar>
          <TabButton
            type="button"
            $active={activeTab === 'library'}
            onClick={() => setActiveTab('library')}
          >
            <Image01Icon size={16} />
            Galeri Media
            <Badge
              size="sm"
              variant={activeTab === 'library' ? 'primary' : 'neutral'}
            >
              {mediaItems.length}
            </Badge>
          </TabButton>
          <TabButton
            type="button"
            $active={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
          >
            <CloudUploadIcon size={16} />
            Unggah Berkas Baru
          </TabButton>
          <TabButton
            type="button"
            $active={activeTab === 'url'}
            onClick={() => setActiveTab('url')}
          >
            <Link01Icon size={16} />
            Impor dari URL
          </TabButton>
        </TabsBar>

        {/* Body Content */}
        <ModalBody>
          {activeTab === 'library' && (
            <>
              <LibraryView>
                <Toolbar>
                  <SearchWrapper>
                    <Search01Icon size={16} />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama atau alt text..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </SearchWrapper>

                  <Button
                    size="sm"
                    variant="outline"
                    color="neutral"
                    onClick={() => setActiveTab('upload')}
                  >
                    <CloudUploadIcon size={15} style={{ marginRight: 6 }} />
                    Unggah Baru
                  </Button>
                </Toolbar>

                <GridContainer>
                  {isLoading ? (
                    <EmptyLibraryState>
                      <Typography variant="body" color="secondary">
                        Memuat media...
                      </Typography>
                    </EmptyLibraryState>
                  ) : mediaItems.length === 0 ? (
                    <EmptyLibraryState>
                      <Image01Icon size={44} color={theme.colors.muted} />
                      <Typography
                        variant="body"
                        style={{
                          fontWeight: 600,
                          color: theme.colors.text.primary,
                        }}
                      >
                        {searchQuery
                          ? 'Tidak ada gambar yang cocok dengan pencarian'
                          : 'Belum ada gambar yang diunggah'}
                      </Typography>
                      <Typography variant="caption" color="secondary">
                        {searchQuery
                          ? 'Coba gunakan kata kunci pencarian yang lain'
                          : 'Mulai unggah gambar produk, banner toko, atau logo Anda sekarang'}
                      </Typography>
                      {searchQuery ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSearchQuery('')}
                        >
                          Hapus Pencarian
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="solid"
                          color="primary"
                          onClick={() => setActiveTab('upload')}
                        >
                          Unggah Gambar Sekarang
                        </Button>
                      )}
                    </EmptyLibraryState>
                  ) : (
                    mediaItems.map((item) => {
                      const isSelected = selectedMedia?.uuid === item.uuid
                      return (
                        <ImageCard
                          key={item.uuid}
                          $selected={isSelected}
                          onClick={() => handleSelectCard(item)}
                          title={item.name}
                        >
                          <ThumbnailWrapper>
                            <img src={item.url} alt={item.alt || item.name} />
                            {isSelected && (
                              <CardCheckBadge>
                                <Tick02Icon size={14} />
                              </CardCheckBadge>
                            )}
                          </ThumbnailWrapper>
                          <CardFooter>
                            <CardFileName>{item.name}</CardFileName>
                            <CardMeta>
                              {item.width && item.height
                                ? `${item.width}×${item.height} • `
                                : ''}
                              {formatBytes(item.size)}
                            </CardMeta>
                          </CardFooter>
                        </ImageCard>
                      )
                    })
                  )}
                </GridContainer>
              </LibraryView>

              {/* Sidebar Detail / Inspector */}
              {selectedMedia && (
                <DetailPane>
                  <Typography
                    variant="title"
                    style={{ fontSize: '0.95rem', fontWeight: 700 }}
                  >
                    Detail Informasi Gambar
                  </Typography>

                  <PreviewBox>
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.alt || selectedMedia.name}
                    />
                  </PreviewBox>

                  <MetaRow>
                    <MetaLabel>Nama Berkas</MetaLabel>
                    <MetaInput
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Nama berkas..."
                    />
                  </MetaRow>

                  <MetaRow>
                    <MetaLabel>Alt Text (SEO & Aksesibilitas)</MetaLabel>
                    <MetaInput
                      value={editingAlt}
                      onChange={(e) => setEditingAlt(e.target.value)}
                      placeholder="Deskripsi singkat gambar..."
                    />
                  </MetaRow>

                  <Button
                    size="sm"
                    variant="outline"
                    color="neutral"
                    onClick={handleSaveDetails}
                    disabled={updateMediaMutation.isPending}
                  >
                    {updateMediaMutation.isPending
                      ? 'Menyimpan...'
                      : 'Simpan Perubahan'}
                  </Button>

                  <Divider />

                  <MetaInfoGrid>
                    <div>
                      <MetaLabel>Dimensi</MetaLabel>
                      <div style={{ marginTop: 2, fontWeight: 600 }}>
                        {selectedMedia.width && selectedMedia.height
                          ? `${selectedMedia.width} × ${selectedMedia.height} px`
                          : 'Asli'}
                      </div>
                    </div>
                    <div>
                      <MetaLabel>Ukuran Berkas</MetaLabel>
                      <div style={{ marginTop: 2, fontWeight: 600 }}>
                        {formatBytes(selectedMedia.size)}
                      </div>
                    </div>
                    <div>
                      <MetaLabel>Format</MetaLabel>
                      <div style={{ marginTop: 2, fontWeight: 600 }}>
                        {selectedMedia.mimeType
                          .replace('image/', '')
                          .toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <MetaLabel>Diunggah</MetaLabel>
                      <div style={{ marginTop: 2, fontWeight: 600 }}>
                        {formatDate(selectedMedia.createdAt)}
                      </div>
                    </div>
                  </MetaInfoGrid>

                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    <Button
                      size="sm"
                      variant="outline"
                      color="neutral"
                      style={{ flex: 1 }}
                      onClick={handleCopyUrl}
                    >
                      {isCopied ? (
                        <>
                          <CheckmarkCircle02Icon
                            size={14}
                            style={{ marginRight: 6 }}
                          />
                          Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy01Icon size={14} style={{ marginRight: 6 }} />
                          Salin URL
                        </>
                      )}
                    </Button>

                    {!isDeleting ? (
                      <IconButton
                        size="sm"
                        variant="outline"
                        color="error"
                        title="Hapus media dari pustaka"
                        onClick={() => setIsDeleting(true)}
                      >
                        <Delete02Icon size={16} />
                      </IconButton>
                    ) : (
                      <Button
                        size="sm"
                        variant="solid"
                        color="error"
                        onClick={handleDeleteCurrent}
                        disabled={deleteMediaMutation.isPending}
                      >
                        {deleteMediaMutation.isPending ? '...' : 'Hapus?'}
                      </Button>
                    )}
                  </div>
                </DetailPane>
              )}
            </>
          )}

          {activeTab === 'upload' && (
            <UploadView>
              <input
                id="media-file-upload-input"
                type="file"
                accept={accept}
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <DropzoneBox
                $isDragging={isDragging}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => {
                  document.getElementById('media-file-upload-input')?.click()
                }}
              >
                <UploadIconCircle>
                  <CloudUploadIcon size={34} />
                </UploadIconCircle>
                <div>
                  <Typography
                    variant="title"
                    style={{ fontSize: '1.15rem', fontWeight: 700 }}
                  >
                    Klik atau tarik berkas gambar ke sini
                  </Typography>
                  <Typography
                    variant="body"
                    color="secondary"
                    style={{ marginTop: 4, fontSize: '0.88rem' }}
                  >
                    Mendukung format PNG, JPG, JPEG, WEBP, GIF hingga 15 MB
                  </Typography>
                </div>
                <Button
                  size="md"
                  variant="solid"
                  color="primary"
                  style={{ marginTop: 8 }}
                  disabled={uploadMediaMutation.isPending}
                >
                  {uploadMediaMutation.isPending
                    ? 'Sedang Mengunggah...'
                    : 'Pilih Berkas dari Komputer'}
                </Button>
              </DropzoneBox>
            </UploadView>
          )}

          {activeTab === 'url' && (
            <UrlView>
              <UrlBox>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Link01Icon size={22} color={theme.colors.primary.DEFAULT} />
                  <div>
                    <Typography
                      variant="title"
                      style={{ fontSize: '1.05rem', fontWeight: 700 }}
                    >
                      Impor Gambar dari Tautan URL
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Masukkan URL gambar langsung dari internet atau Unsplash
                    </Typography>
                  </div>
                </div>

                <MetaRow>
                  <MetaLabel>Tautan / URL Gambar</MetaLabel>
                  <MetaInput
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                  />
                </MetaRow>

                <MetaRow>
                  <MetaLabel>Nama Gambar (Opsional)</MetaLabel>
                  <MetaInput
                    type="text"
                    placeholder="e.g. promo-banner-autumn.jpg"
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                  />
                </MetaRow>

                <MetaRow>
                  <MetaLabel>Alt Text (Opsional)</MetaLabel>
                  <MetaInput
                    type="text"
                    placeholder="e.g. Autumn promotional banner"
                    value={importAlt}
                    onChange={(e) => setImportAlt(e.target.value)}
                  />
                </MetaRow>

                {importUrl && (
                  <PreviewBox style={{ height: 140 }}>
                    <img
                      src={importUrl}
                      alt="Pratinjau URL"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = ''
                      }}
                    />
                  </PreviewBox>
                )}

                <Button
                  size="md"
                  variant="solid"
                  color="primary"
                  onClick={handleImportByUrl}
                  disabled={!importUrl || uploadMediaMutation.isPending}
                >
                  {uploadMediaMutation.isPending
                    ? 'Sedang Mengimpor...'
                    : 'Tambahkan ke Galeri Media'}
                </Button>
              </UrlBox>
            </UrlView>
          )}
        </ModalBody>

        {/* Footer */}
        <ModalFooter>
          {selectedMedia ? (
            <SelectedPreviewFooter>
              <img src={selectedMedia.url} alt={selectedMedia.name} />
              <div>
                <Typography
                  variant="body"
                  style={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    lineHeight: 1.2,
                  }}
                >
                  {selectedMedia.name}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {selectedMedia.width && selectedMedia.height
                    ? `${selectedMedia.width}×${selectedMedia.height} px • `
                    : ''}
                  {formatBytes(selectedMedia.size)}
                </Typography>
              </div>
            </SelectedPreviewFooter>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <InformationCircleIcon size={16} color={theme.colors.muted} />
              <Typography variant="caption" color="secondary">
                Pilih salah satu gambar di atas untuk menggunakannya
              </Typography>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              size="md"
              variant="outline"
              color="neutral"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              size="md"
              variant="solid"
              color="primary"
              disabled={!selectedMedia}
              onClick={handleConfirmSelect}
            >
              Gunakan Gambar Ini
            </Button>
          </div>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  )
}
