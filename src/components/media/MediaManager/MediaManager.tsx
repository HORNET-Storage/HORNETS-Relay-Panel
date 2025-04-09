import React, { useState, useEffect } from 'react';
import * as S from './MediaManager.styles';
import MediaItem from './MediaItem/MediaItem';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useResponsive } from '@app/hooks/useResponsive';
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
import MediaViewer from './MediaViewer/MediaViewer';
import useMedia from '@app/hooks/useMedia';
import { Spin } from 'antd';

export type MediaFile = {
  id: string;
  path: string;
  name: string;
  size: number;
  type: string;
  createdAt: Date;
  content: string;
  thumbnail: string;
};

const MediaManager: React.FC = () => {
  const { isTablet, isDesktop, is4k } = useResponsive();
  const { mediaItems, loading, error, hasMore, fetchMore, reset } = useMedia();

  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [selectedFileForViewer, setSelectedFileForViewer] = useState<MediaFile | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectionModeActive, setSelectionModeActive] = useState<boolean>(false);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  const files: MediaFile[] = mediaItems.map(item => ({
    id: item.hash,
    path: `/api/files/${item.hash}`,
    name: item.name,
    size: parseInt(item.metadata?.size || '0'),
    type: item.type,
    content: item.content || '',
    createdAt: new Date(parseInt(item.metadata?.timestamp || Date.now().toString())),
    thumbnail: `data:${item.type};base64,${item.content}`
  }));

  useEffect(() => {
    if (error) console.error('Error loading media:', error);
  }, [error]);

  const handleSelect = (file: MediaFile) => {
    if (!selectionModeActive) {
      setSelectedFileForViewer(file);
      setViewerVisible(true);
      return;
    }
    setSelectedFiles(prev => 
      prev.some(f => f.id === file.id) 
        ? prev.filter(f => f.id !== file.id)
        : [...prev, file]
    );
  };

  const handleSelectAll = () => {
    setSelectedFiles(selectedFiles.length === files.length ? [] : [...files]);
  };

  const handleSelectButton = () => {
    setSelectionModeActive(!selectionModeActive);
    setSelectedFiles([]);
  };

  useEffect(() => {
    setIsAllSelected(selectedFiles.length === files.length && files.length > 0);
  }, [selectedFiles, files]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight <= 100 && hasMore && !loading) {
      fetchMore();
    }
  };

  const getMediaItemColumnSize = () => isTablet ? (isDesktop ? 4 : 6) : 12;

  return (
    <S.MediaManagerContainer>
      <BaseRow>
        <BaseCol span={isTablet ? 10 : 24}>
          <S.BreadcrumbWrapper isTablet={isTablet}>
            <S.Breadcrumb $is4kScreen={is4k}>
              <BreadcrumbItem>Media</BreadcrumbItem>
            </S.Breadcrumb>
          </S.BreadcrumbWrapper>
        </BaseCol>
        <BaseCol span={isTablet ? 14 : 24}>
          <BaseRow>
            <S.ButtonsContainer>
              <S.ToolBarButton 
                $is4kScreen={is4k} 
                size={is4k ? 'large' : 'middle'}
                disabled={selectedFiles.length === 0}
              >
                Delete
              </S.ToolBarButton>
              <S.ToolBarButton
                $isActive={selectionModeActive}
                onClick={handleSelectButton}
                $is4kScreen={is4k}
                size={is4k ? 'large' : 'middle'}
              >
                {`Select (${selectedFiles.length})`}
              </S.ToolBarButton>
              <S.ToolBarButton
                $isActive={isAllSelected}
                $is4kScreen={is4k}
                size={is4k ? 'large' : 'middle'}
                onClick={handleSelectAll}
                disabled={files.length === 0}
              >
                Select All
              </S.ToolBarButton>
            </S.ButtonsContainer>
          </BaseRow>
        </BaseCol>
      </BaseRow>
      <S.ScrollContainer onScroll={handleScroll}>
        <BaseRow gutter={[32, 24]}>
          {files.map((item) => (
            <BaseCol key={item.id} span={getMediaItemColumnSize()}>
              <MediaItem 
                file={item} 
                selected={selectedFiles.some(f => f.id === item.id)} 
                onClick={() => handleSelect(item)} 
              />
            </BaseCol>
          ))}
        </BaseRow>
        {loading && (
          <S.SpinnerWrapper>
            <Spin size="large" />
          </S.SpinnerWrapper>
        )}
        {!loading && !hasMore && files.length > 0 && (
          <S.MessageWrapper>
            No more items to load
          </S.MessageWrapper>
        )}
        {!loading && files.length === 0 && (
          <S.MessageWrapper>
            No media files found
          </S.MessageWrapper>
        )}
      </S.ScrollContainer>
      <MediaViewer 
        visible={viewerVisible} 
        onClose={() => {
          setViewerVisible(false);
          setSelectedFileForViewer(null);
        }} 
        file={selectedFileForViewer} 
        files={files}
      />
    </S.MediaManagerContainer>
  );
};

export default MediaManager;


// import React, { useState, useEffect } from 'react';
// import * as S from './MediaManager.styles';
// import MediaItem from './MediaItem/MediaItem';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import { useResponsive } from '@app/hooks/useResponsive';
// import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
// import MediaViewer from './MediaViewer/MediaViewer';
// import useMedia from '@app/hooks/useMedia';
// import { Spin } from 'antd';

// export type MediaFile = {
//   id: string;
//   path: string;
//   name: string;
//   size: number;
//   type: string;
//   createdAt: Date;
//   thumbnail: string;
// };

// const MediaManager: React.FC = () => {
//   const { isTablet, isDesktop, is4k } = useResponsive();
//   const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
//   const [selectedFileForViewer, setSelectedFileForViewer] = useState<MediaFile | null>(null);
//   const [viewerVisible, setViewerVisible] = useState(false);
//   const [selectionModeActive, setSelectionModeActive] = useState<boolean>(false);
//   const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

//   const [path, setPath] = useState<string>('/media/images');
//   const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>(
//     path.length <= 0 ? ['/'] : path.split('/')
//   );

//   // Use our updated media hook
//   const {
//     mediaItems,
//     loading,
//     error,
//     hasMore,
//     fetchMore,
//     reset
//   } = useMedia({
//     pageSize: 20,
//     mediaType: 'all',
//   });

//   // Convert the new API response format to MediaFile format
//   const files: MediaFile[] = mediaItems.map(item => ({
//     id: item.hash, // Using pub_key as hash from the API
//     path: `/api/files/${item.hash}`, // Updated path to match new API
//     name: item.name,
//     size: parseInt(item.metadata?.size || '0'),
//     type: item.type,
//     createdAt: new Date(parseInt(item.metadata?.timestamp || Date.now().toString())),
//     thumbnail: `/api/files/${item.hash}/thumbnail` // Assuming there's a thumbnail endpoint
//   }));

//   useEffect(() => {
//     if (error) {
//       console.error('Error loading media:', error);
//     }
//   }, [error]);

//   // Reset selection when media items change
//   useEffect(() => {
//     setSelectedFiles([]);
//     setSelectionModeActive(false);
//     setIsAllSelected(false);
//   }, [path]);

//   const handleSelect = (file: MediaFile) => {
//     if (!selectionModeActive) {
//       setSelectedFileForViewer(file);
//       setViewerVisible(true);
//       return;
//     }

//     if (selectedFiles.some((selectedFile) => selectedFile.id === file.id)) {
//       setSelectedFiles(selectedFiles.filter((selectedFile) => selectedFile.id !== file.id));
//     } else {
//       setSelectedFiles([...selectedFiles, file]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectedFiles.length === files.length) {
//       setSelectedFiles([]);
//     } else {
//       setSelectedFiles([...files]);
//     }
//   };

//   const isSelected = (file: MediaFile) => {
//     return selectedFiles.some((selectedFile) => selectedFile.id === file.id);
//   };

//   const handleSelectButton = () => {
//     setSelectionModeActive(!selectionModeActive);
//     if (!selectionModeActive) {
//       setSelectedFiles([]);
//     }
//   };

//   useEffect(() => {
//     setIsAllSelected(selectedFiles.length === files.length && files.length > 0);
//   }, [selectedFiles, files]);

//   useEffect(() => {
//     setBreadcrumbItems(path.length <= 0 ? ['/'] : path.split('/'));
//   }, [path]);

//   const handleCloseViewer = () => {
//     setViewerVisible(false);
//     setSelectedFileForViewer(null);
//   };

//   const handleDelete = async () => {
//     // Implement delete functionality here
//     // You'll need to call your API to delete the selected files
//     // After successful deletion, call reset() to refresh the list
//   };

//   const getMediaItemColumnSize = () => {
//     if (isTablet) {
//       if (isDesktop) return 4;
//       return 6;
//     } else {
//       return 12;
//     }
//   };

//   // Enhanced scroll handler for infinite loading
//   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
//     const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
//     const scrollThreshold = 100; // pixels before bottom
    
//     if (scrollHeight - scrollTop - clientHeight <= scrollThreshold) {
//       if (hasMore && !loading) {
//         fetchMore();
//       }
//     }
//   };

//   return (
//     <S.MediaManagerContainer>
//       <BaseRow>
//         <BaseCol span={isTablet ? 10 : 24}>
//           <S.BreadcrumbWrapper isTablet={isTablet}>
//             <S.Breadcrumb $is4kScreen={is4k}>
//               {breadcrumbItems.map((item, index) => (
//                 <BreadcrumbItem key={index}>{item}</BreadcrumbItem>
//               ))}
//             </S.Breadcrumb>
//           </S.BreadcrumbWrapper>
//         </BaseCol>
//         <BaseCol span={isTablet ? 14 : 24}>
//           <BaseRow>
//             <S.ButtonsContainer>
//               <S.ToolBarButton 
//                 $is4kScreen={is4k} 
//                 size={is4k ? 'large' : 'middle'}
//                 disabled={selectedFiles.length === 0}
//                 onClick={handleDelete}
//               >
//                 Delete
//               </S.ToolBarButton>
//               <S.ToolBarButton
//                 $isActive={selectionModeActive}
//                 onClick={handleSelectButton}
//                 $is4kScreen={is4k}
//                 size={is4k ? 'large' : 'middle'}
//               >
//                 {`Select (${selectedFiles.length})`}
//               </S.ToolBarButton>
//               <S.ToolBarButton
//                 $isActive={isAllSelected}
//                 $is4kScreen={is4k}
//                 size={is4k ? 'large' : 'middle'}
//                 onClick={handleSelectAll}
//                 disabled={files.length === 0}
//               >
//                 Select All
//               </S.ToolBarButton>
//             </S.ButtonsContainer>
//           </BaseRow>
//         </BaseCol>
//       </BaseRow>
//       <S.ScrollContainer onScroll={handleScroll}>
//         <BaseRow gutter={[32, 24]}>
//           {files.map((item) => (
//             <BaseCol key={item.id} span={getMediaItemColumnSize()}>
//               <MediaItem 
//                 file={item} 
//                 selected={isSelected(item)} 
//                 onClick={() => handleSelect(item)} 
//               />
//             </BaseCol>
//           ))}
//         </BaseRow>
//         {loading && (
//           <S.SpinnerWrapper>
//             <Spin size="large" />
//           </S.SpinnerWrapper>
//         )}
//         {!loading && !hasMore && files.length > 0 && (
//           <S.MessageWrapper>
//             No more items to load
//           </S.MessageWrapper>
//         )}
//         {!loading && files.length === 0 && (
//           <S.MessageWrapper>
//             No media files found
//           </S.MessageWrapper>
//         )}
//       </S.ScrollContainer>
//       <MediaViewer 
//         visible={viewerVisible} 
//         onClose={handleCloseViewer} 
//         file={selectedFileForViewer} 
//         files={files}
//       />
//     </S.MediaManagerContainer>
//   );
// };

// export default MediaManager;



// import React, { useState, useEffect } from 'react';
// import * as S from './MediaManager.styles';
// import MediaItem from './MediaItem/MediaItem';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import { useResponsive } from '@app/hooks/useResponsive';
// import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
// import MediaViewer from './MediaViewer/MediaViewer';
// import useMedia from '@app/hooks/useMedia';
// import { Spin } from 'antd';

// export type MediaFile = {
//   id: string;
//   path: string;
//   name: string;
//   size: number;
//   type: string;
//   createdAt: Date;
//   thumbnail: string;
// };

// const MediaManager: React.FC = () => {
//   const { isTablet, isDesktop, is4k } = useResponsive();
//   const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
//   const [selectedFileForViewer, setSelectedFileForViewer] = useState<MediaFile | null>(null);
//   const [viewerVisible, setViewerVisible] = useState(false);
//   const [selectionModeActive, setSelectionModeActive] = useState<boolean>(false);
//   const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

//   const [path, setPath] = useState<string>('/media/images');
//   const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>(
//     path.length <= 0 ? ['/'] : path.split('/')
//   );

//   // Use our media hook
//   const {
//     mediaItems,
//     loading,
//     error,
//     hasMore,
//     fetchMore,
//   } = useMedia({
//     pageSize: 20,
//     mediaType: 'all'
//     // npub: currentUser?.npub,
//   });

//   // Convert mediaItems to MediaFile format
//   const files: MediaFile[] = mediaItems.map(item => ({
//     id: item.hash,
//     path: `/api/media/content/${item.hash}`,
//     name: item.name,
//     size: parseInt(item.metadata?.size || '0'),
//     type: item.type,
//     createdAt: new Date(parseInt(item.metadata?.timestamp || Date.now().toString())),
//     thumbnail: `/api/media/content/${item.hash}` // You might want to add a thumbnail endpoint
//   }));

//   useEffect(() => {
//     if (error) {
//       console.error('Error loading media:', error);
//     }
//   }, [error]);

//   const handleSelect = (file: MediaFile) => {
//     if (!selectionModeActive) {
//       setSelectedFileForViewer(file);
//       setViewerVisible(true);
//       return;
//     }

//     if (selectedFiles.some((selectedFile) => selectedFile.id === file.id)) {
//       setSelectedFiles(selectedFiles.filter((selectedFile) => selectedFile.id !== file.id));
//       return;
//     }
//     setSelectedFiles([...selectedFiles, file]);
//   };

//   const handleSelectAll = () => {
//     if (selectedFiles.length === files.length) {
//       setSelectedFiles([]);
//       return;
//     }
//     setSelectedFiles(files);
//   };

//   const isSelected = (file: MediaFile) => {
//     return selectedFiles.some((selectedFile) => selectedFile.id === file.id);
//   };

//   const handleSelectButton = () => {
//     setSelectionModeActive(!selectionModeActive);
//   };

//   useEffect(() => {
//     if (selectedFiles.length === files.length) {
//       setIsAllSelected(true);
//       return;
//     }
//     setIsAllSelected(false);
//   }, [selectedFiles, files]);

//   useEffect(() => {
//     setBreadcrumbItems(path.length <= 0 ? ['/'] : path.split('/'));
//   }, [path]);

//   const handleCloseViewer = () => {
//     setViewerVisible(false);
//     setSelectedFileForViewer(null);
//   };

//   const getMediaItemColumnSize = () => {
//     if (isTablet) {
//       if (isDesktop) return 4;
//       return 6;
//     } else {
//       return 12;
//     }
//   };

//   // Scroll handler for infinite loading
//   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
//     const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
//     if (scrollHeight - scrollTop <= clientHeight * 1.5) {
//       if (hasMore && !loading) {
//         fetchMore();
//       }
//     }
//   };

//   return (
//     <S.MediaManagerContainer>
//       <BaseRow>
//         <BaseCol span={isTablet ? 10 : 24}>
//           <S.BreadcrumbWrapper isTablet={isTablet}>
//             <S.Breadcrumb $is4kScreen={is4k}>
//               {breadcrumbItems.map((item, index) => (
//                 <BreadcrumbItem key={index}>{item}</BreadcrumbItem>
//               ))}
//             </S.Breadcrumb>
//           </S.BreadcrumbWrapper>
//         </BaseCol>
//         <BaseCol span={isTablet ? 14 : 24}>
//           <BaseRow>
//             <S.ButtonsContainer>
//               <S.ToolBarButton 
//                 $is4kScreen={is4k} 
//                 size={is4k ? 'large' : 'middle'}
//                 disabled={selectedFiles.length === 0}
//               >
//                 Delete
//               </S.ToolBarButton>
//               <S.ToolBarButton
//                 $isActive={selectionModeActive}
//                 onClick={handleSelectButton}
//                 $is4kScreen={is4k}
//                 size={is4k ? 'large' : 'middle'}
//               >
//                 {`Select (${selectedFiles.length})`}
//               </S.ToolBarButton>
//               <S.ToolBarButton
//                 $isActive={isAllSelected}
//                 $is4kScreen={is4k}
//                 size={is4k ? 'large' : 'middle'}
//                 onClick={handleSelectAll}
//                 disabled={files.length === 0}
//               >
//                 Select All
//               </S.ToolBarButton>
//             </S.ButtonsContainer>
//           </BaseRow>
//         </BaseCol>
//       </BaseRow>
//       <S.ScrollContainer onScroll={handleScroll}>
//         <BaseRow gutter={[32, 24]}>
//           {files.map((item) => (
//             <BaseCol key={item.id} span={getMediaItemColumnSize()}>
//               <MediaItem 
//                 file={item} 
//                 selected={isSelected(item)} 
//                 onClick={() => handleSelect(item)} 
//               />
//             </BaseCol>
//           ))}
//         </BaseRow>
//         {loading && (
//           <S.SpinnerWrapper>
//             <Spin size="large" />
//           </S.SpinnerWrapper>
//         )}
//         {!loading && !hasMore && files.length > 0 && (
//           <S.MessageWrapper>
//             No more items to load
//           </S.MessageWrapper>
//         )}
//         {!loading && files.length === 0 && (
//           <S.MessageWrapper>
//             No media files found
//           </S.MessageWrapper>
//         )}
//       </S.ScrollContainer>
//       <MediaViewer 
//         visible={viewerVisible} 
//         onClose={handleCloseViewer} 
//         file={selectedFileForViewer} 
//         files={files}
//       />
//     </S.MediaManagerContainer>
//   );
// };

// export default MediaManager;

// import React, { useState, useEffect } from 'react';
// import * as S from './MediaManager.styles';
// import MediaItem from './MediaItem/MediaItem';
// const dummyThumbnail = 'https://via.placeholder.com/150';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import { useResponsive } from '@app/hooks/useResponsive';
// import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';
// import MediaViewer from './MediaViewer/MediaViewer';
// export type MediaFile = {
//   id: string;
//   path: string;
//   name: string;
//   size: number;
//   type: string;
//   createdAt: Date;
//   thumbnail: string;
// };
// const MediaManager: React.FC = () => {
//   const { isTablet, isDesktop, is4k } = useResponsive();
//   const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
//   const [files, setFiles] = useState<MediaFile[]>(dummyItems);
//   const [selectedFileForViewer, setSelectedFileForViewer] = useState<MediaFile | null>(null); // Store file for viewing
//   const [viewerVisible, setViewerVisible] = useState(false); // Control modal visibility

//   const [path, setPath] = useState<string>('/media/images');
//   const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>(path.length <= 0 ? ['/'] : path.split('/'));

//   const [selectionModeActive, setSelectionModeActive] = useState<boolean>(false);
//   const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

//   const handleSelect = (file: MediaFile) => {
//     if (!selectionModeActive) {
//       setSelectedFileForViewer(file);
//       setViewerVisible(true);
//       return;
//     }

//     if (selectedFiles.some((selectedFile) => selectedFile.id === file.id)) {
//       setSelectedFiles(selectedFiles.filter((selectedFile) => selectedFile.id !== file.id));
//       return;
//     }
//     setSelectedFiles([...selectedFiles, file]);
//   };

//   const handleSelectAll = () => {
//     if (selectedFiles.length === files.length) {
//       setSelectedFiles([]);
//       return;
//     }
//     setSelectedFiles(files);
//   };

//   const isSelected = (file: MediaFile) => {
//     return selectedFiles.some((selectedFile) => selectedFile.id === file.id);
//   };

//   const handleSelectButton = () => {
//     setSelectionModeActive(!selectionModeActive);
//   };

//   useEffect(() => {
//     if (selectedFiles.length === files.length) {
//       setIsAllSelected(true);
//       return;
//     }
//     setIsAllSelected(false);
//   }, [selectedFiles, files]);

//   useEffect(() => {
//     setBreadcrumbItems(path.length <= 0 ? ['/'] : path.split('/'));
//   }, [path]);

//   const handleCloseViewer = () => {
//     setViewerVisible(false);
//     setSelectedFileForViewer(null);
//   };

//   const getMediaItemColumnSize = () => {
//     if (isTablet) {
//       if (isDesktop) return 4;
//       return 6;
//     } else {
//       return 12;
//     }
//   };

//   return (
//     <S.MediaManagerContainer>
//       <BaseRow>
//         <BaseCol span={isTablet ? 10 : 24}>
//           <S.BreadcrumbWrapper isTablet={isTablet}>
//             <S.Breadcrumb $is4kScreen={is4k}>
//               {breadcrumbItems.map((item, index) => (
//                 <BreadcrumbItem key={index}>{item}</BreadcrumbItem>
//               ))}
//             </S.Breadcrumb>
//           </S.BreadcrumbWrapper>
//         </BaseCol>
//         <BaseCol span={isTablet ? 14 : 24}>
//           <BaseRow>
//             <S.ButtonsContainer>
//               <S.ToolBarButton $is4kScreen={is4k} size={is4k ? 'large' : 'middle'}>
//                 Delete
//               </S.ToolBarButton>
//               <S.ToolBarButton
//                 $isActive={selectionModeActive}
//                 onClick={handleSelectButton}
//                 $is4kScreen={is4k}
//                 size={is4k ? 'large' : 'middle'}
//               >{`Select (${selectedFiles.length})`}</S.ToolBarButton>
//               <S.ToolBarButton
//                 $isActive={isAllSelected}
//                 $is4kScreen={is4k}
//                 size={is4k ? 'large' : 'middle'}
//                 onClick={handleSelectAll}
//               >
//                 Select All
//               </S.ToolBarButton>
//             </S.ButtonsContainer>
//           </BaseRow>
//         </BaseCol>
//       </BaseRow>
//       <S.MediaItemsContainer>
//         <BaseRow gutter={[32, 24]}>
//           {dummyItems.map((item) => (
//             <BaseCol key={item.id} span={getMediaItemColumnSize()}>
//               <MediaItem file={item} selected={isSelected(item)} onClick={() => handleSelect(item)} />
//             </BaseCol>
//           ))}
//         </BaseRow>
//       </S.MediaItemsContainer>
//       <MediaViewer visible={viewerVisible} onClose={handleCloseViewer} file={selectedFileForViewer} files={files} />
//     </S.MediaManagerContainer>
//   );
// };

// export default MediaManager;
// const dummyItems: MediaFile[] = [
//   {
//     id: '1',
//     path: '/media/image1.jpg',
//     name: 'image1.jpg',
//     size: 1024,
//     type: 'image/jpeg',
//     createdAt: new Date('2023-01-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '2',
//     path: '/media/image2.jpg',
//     name: 'image2.jpg',
//     size: 2048,
//     type: 'image/jpeg',
//     createdAt: new Date('2023-02-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '3',
//     path: '/media/video1.mp4',
//     name: 'video1.mp4',
//     size: 5120,
//     type: 'video/mp4',
//     createdAt: new Date('2023-03-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '4',
//     path: '/media/audio1.mp3',
//     name: 'audio1.mp3',
//     size: 3072,
//     type: 'audio/mpeg',
//     createdAt: new Date('2023-04-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '5',
//     path: '/media/document1.pdf',
//     name: 'document1.pdf',
//     size: 10240,
//     type: 'application/pdf',
//     createdAt: new Date('2023-05-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '6',
//     path: '/media/document2.pdf',
//     name: 'document2.pdf',
//     size: 10240,
//     type: 'application/pdf',
//     createdAt: new Date('2023-05-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '7',
//     path: '/media/image3.jpg',
//     name: 'image3.jpg',
//     size: 4096,
//     type: 'image/jpeg',
//     createdAt: new Date('2023-06-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '8',
//     path: '/media/video2.mp4',
//     name: 'video2.mp4',
//     size: 8192,
//     type: 'video/mp4',
//     createdAt: new Date('2023-06-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '9',
//     path: '/media/audio2.mp3',
//     name: 'audio2.mp3',
//     size: 3072,
//     type: 'audio/mpeg',
//     createdAt: new Date('2023-07-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '10',
//     path: '/media/image4.jpg',
//     name: 'image4.jpg',
//     size: 2048,
//     type: 'image/jpeg',
//     createdAt: new Date('2023-07-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '11',
//     path: '/media/document3.pdf',
//     name: 'document3.pdf',
//     size: 10240,
//     type: 'application/pdf',
//     createdAt: new Date('2023-08-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '12',
//     path: '/media/video3.mp4',
//     name: 'video3.mp4',
//     size: 6144,
//     type: 'video/mp4',
//     createdAt: new Date('2023-08-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '13',
//     path: '/media/image5.jpg',
//     name: 'image5.jpg',
//     size: 5120,
//     type: 'image/jpeg',
//     createdAt: new Date('2023-09-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '14',
//     path: '/media/audio3.mp3',
//     name: 'audio3.mp3',
//     size: 4096,
//     type: 'audio/mpeg',
//     createdAt: new Date('2023-09-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '15',
//     path: '/media/image6.jpg',
//     name: 'image6.jpg',
//     size: 1024,
//     type: 'image/jpeg',
//     createdAt: new Date('2023-10-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '16',
//     path: '/media/document4.pdf',
//     name: 'document4.pdf',
//     size: 10240,
//     type: 'application/pdf',
//     createdAt: new Date('2023-10-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '17',
//     path: '/media/video4.mp4',
//     name: 'video4.mp4',
//     size: 5120,
//     type: 'video/mp4',
//     createdAt: new Date('2023-11-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '18',
//     path: '/media/image7.jpg',
//     name: 'image7.jpg',
//     size: 2048,
//     type: 'image/jpeg',
//     createdAt: new Date('2023-11-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '19',
//     path: '/media/audio4.mp3',
//     name: 'audio4.mp3',
//     size: 3072,
//     type: 'audio/mpeg',
//     createdAt: new Date('2023-12-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '20',
//     path: '/media/image8.jpg',
//     name: 'image8.jpg',
//     size: 5120,
//     type: 'image/jpeg',
//     createdAt: new Date('2023-12-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '21',
//     path: '/media/document5.pdf',
//     name: 'document5.pdf',
//     size: 10240,
//     type: 'application/pdf',
//     createdAt: new Date('2024-01-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '22',
//     path: '/media/video5.mp4',
//     name: 'video5.mp4',
//     size: 8192,
//     type: 'video/mp4',
//     createdAt: new Date('2024-01-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '23',
//     path: '/media/audio5.mp3',
//     name: 'audio5.mp3',
//     size: 3072,
//     type: 'audio/mpeg',
//     createdAt: new Date('2024-02-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '24',
//     path: '/media/image9.jpg',
//     name: 'image9.jpg',
//     size: 1024,
//     type: 'image/jpeg',
//     createdAt: new Date('2024-02-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '25',
//     path: '/media/document6.pdf',
//     name: 'document6.pdf',
//     size: 10240,
//     type: 'application/pdf',
//     createdAt: new Date('2024-03-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '26',
//     path: '/media/video6.mp4',
//     name: 'video6.mp4',
//     size: 5120,
//     type: 'video/mp4',
//     createdAt: new Date('2024-03-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '27',
//     path: '/media/image10.jpg',
//     name: 'image10.jpg',
//     size: 2048,
//     type: 'image/jpeg',
//     createdAt: new Date('2024-04-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '28',
//     path: '/media/audio6.mp3',
//     name: 'audio6.mp3',
//     size: 3072,
//     type: 'audio/mpeg',
//     createdAt: new Date('2024-04-15'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '29',
//     path: '/media/image11.jpg',
//     name: 'image11.jpg',
//     size: 5120,
//     type: 'image/jpeg',
//     createdAt: new Date('2024-05-01'),
//     thumbnail: dummyThumbnail,
//   },
//   {
//     id: '30',
//     path: '/media/document7.pdf',
//     name: 'document7.pdf',
//     size: 10240,
//     type: 'application/pdf',
//     createdAt: new Date('2024-05-15'),
//     thumbnail: dummyThumbnail,
//   },
// ];