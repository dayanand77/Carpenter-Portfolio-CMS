import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { compressImage, getEffectiveCoverImage } from '../../shared/data/mockData';
import { useCategories } from '../../shared/contexts/CategoriesContext';
import { useSubcategories } from '../../shared/contexts/SubcategoriesContext';
import { useGalleries } from '../../shared/contexts/GalleriesContext';
import { addFirestoreSubcategory, updateFirestoreSubcategory, deleteFirestoreSubcategory, deleteFirestoreGallery } from '../../shared/services/firebase';

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-2">
          <h4 className="font-heading font-semibold text-stone-850 text-base">{title}</h4>
          <p className="text-stone-500 text-sm">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-stone-250 hover:bg-stone-50 text-stone-650 font-semibold text-xs uppercase tracking-wider transition-colors">Cancel</button>
          <button type="button" onClick={onConfirm} className="px-5 py-2.5 rounded-lg bg-red-650 hover:bg-red-750 text-white font-semibold text-xs uppercase tracking-wider transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ image, onClose }) {
  if (!image) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="relative max-w-3xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors">Close</button>
        <img src={image} alt="Preview" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain" />
      </div>
    </div>
  );
}

function ImageThumbnail({ src, isCover, onMoveLeft, onMoveRight, onPreview, onSetCover, onDelete, isFirst, isLast, index, onDragStart, onDragOver, onDrop, onDragEnd, isDragOver, onTouchStart, onTouchMove, onTouchEnd }) {
  return (
    <div
      data-thumb-index={index}
      draggable
      onDragStart={(e) => onDragStart?.(index, e)}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(index, e); }}
      onDrop={(e) => { e.preventDefault(); onDrop?.(index, e); }}
      onDragEnd={onDragEnd}
      onTouchStart={(e) => onTouchStart?.(index, e)}
      onTouchMove={(e) => onTouchMove?.(index, e)}
      onTouchEnd={(e) => onTouchEnd?.(index, e)}
      className={`relative aspect-square border rounded-lg overflow-hidden bg-white shadow-xs group cursor-grab active:cursor-grabbing transition-shadow duration-200 ${isDragOver ? 'border-amber-500 ring-2 ring-amber-500 shadow-md' : 'border-stone-200'}`}
    >
      <img src={src} alt="" className="w-full h-full object-cover pointer-events-none" />
      {isCover && (
        <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-md pointer-events-none">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>Cover</span>
        </div>
      )}
      <div className="absolute top-1 right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 z-10">
        <span className="p-1 rounded text-white/80 bg-black/40 backdrop-blur-sm cursor-grab active:cursor-grabbing" title="Drag to reorder">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
        </span>
      </div>
      <div className="md:hidden absolute top-1 right-1 flex items-center gap-0.5 z-10">
        <span className="p-1.5 rounded text-white/80 bg-black/40 backdrop-blur-sm cursor-grab active:cursor-grabbing" title="Touch and hold to drag">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/90 via-stone-900/70 to-transparent pt-6 pb-1 px-1 flex items-end justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:opacity-0">
        <button type="button" onClick={onMoveLeft} disabled={isFirst} className="p-1.5 rounded text-white hover:text-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Move left">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button type="button" onClick={onPreview} className="p-1.5 rounded text-white hover:text-amber-400 transition-colors" title="Preview">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        </button>
        {!isCover && (
          <button type="button" onClick={onSetCover} className="p-1.5 rounded text-white hover:text-amber-400 transition-colors" title="Set as cover">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </button>
        )}
        <button type="button" onClick={onDelete} className="p-1.5 rounded text-white hover:text-red-400 transition-colors" title="Delete">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
        <button type="button" onClick={onMoveRight} disabled={isLast} className="p-1.5 rounded text-white hover:text-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Move right">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/90 via-stone-900/70 to-transparent pt-6 pb-1 px-1 flex items-end justify-center gap-0.5 md:hidden">
        <button type="button" onClick={onMoveLeft} disabled={isFirst} className="p-2 rounded text-white/80 hover:text-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Move left">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button type="button" onClick={onPreview} className="p-2 rounded text-white/80 hover:text-amber-400 transition-colors" title="Preview">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        </button>
        {!isCover && (
          <button type="button" onClick={onSetCover} className="p-2 rounded text-white/80 hover:text-amber-400 transition-colors" title="Set as cover">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </button>
        )}
        <button type="button" onClick={onDelete} className="p-2 rounded text-white/80 hover:text-red-400 transition-colors" title="Delete">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
        <button type="button" onClick={onMoveRight} disabled={isLast} className="p-2 rounded text-white/80 hover:text-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Move right">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function SubcategoriesPage() {
  const { subcategories: ctxSubs, loading: ctxLoading, error: ctxError, refreshSubcategories } = useSubcategories();
  const { categories } = useCategories();
  const { getGalleryImages, getGalleryImageCount, saveGallery } = useGalleries();
  const [subcategories, setSubcategories] = useState([]);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (!ctxLoading) {
      const sorted = [...ctxSubs].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      setSubcategories(sorted);
      setPageReady(true);
    }
  }, [ctxSubs, ctxLoading]);

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Create Subcategory States
  const [newSubId, setNewSubId] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubParent, setNewSubParent] = useState(categories[0]?.id || '');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubCover, setNewSubCover] = useState('/assets/images/door_single.png');
  const [formOpen, setFormOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Subcategory States
  const [editingSub, setEditingSub] = useState(null);
  const [editUploading, setEditUploading] = useState(false);

  // Image management states
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, imageIndex: -1 });
  const [previewImage, setPreviewImage] = useState(null);

  // Drag state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const touchDragRef = useRef(null);

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const enrichSubImage = useCallback((sub) => {
    const slug = sub.slug || sub.id;
    const images = getGalleryImages(slug);
    return { ...sub, id: slug, galleryImages: images, coverIndex: 0, imageCount: images.length };
  }, [getGalleryImages]);

  const grouped = useMemo(() => {
    const map = {};
    categories.forEach(c => {
      const subs = subcategories
        .filter(s => s.categoryId === c.id)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map(enrichSubImage);
      if (subs.length > 0) map[c.id] = { category: c, subs };
    });
    return map;
  }, [subcategories, categories, enrichSubImage]);

  const filteredGrouped = useMemo(() => {
    if (!searchTerm.trim()) return grouped;
    const term = searchTerm.toLowerCase();
    const result = {};
    Object.entries(grouped).forEach(([catId, group]) => {
      const matched = group.subs.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term) ||
        (s.description || '').toLowerCase().includes(term) ||
        group.category.name.toLowerCase().includes(term)
      );
      if (matched.length > 0) {
        result[catId] = { category: group.category, subs: matched };
      }
    });
    return result;
  }, [grouped, searchTerm]);

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSubId || !newSubName || !newSubParent) return;
    if (subcategories.find(s => (s.slug || s.id) === newSubId)) {
      alert('Subcategory ID already exists!');
      return;
    }
    console.log("Firestore: Creating subcategory...");
    const result = await addFirestoreSubcategory({
      slug: newSubId,
      categoryId: newSubParent,
      name: newSubName,
      description: newSubDesc,
      coverImage: newSubCover,
      displayOrder: subcategories.length,
      visible: true
    });
    if (!result.success) {
      console.error("Firestore: addDoc failed", result.error);
      alert('Error creating subcategory: ' + (result.error || 'Unknown error'));
      return;
    }
    console.log("Firestore: addDoc success for", newSubId);
    await refreshSubcategories();
    setNewSubId('');
    setNewSubName('');
    setNewSubDesc('');
    setNewSubCover('/assets/images/door_single.png');
    setFormOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingSub) return;
    const rawImages = editingSub.galleryImages || [];
    const coverIdx = editingSub.coverIndex || 0;
    const finalCover = rawImages.length > 0
      ? rawImages[coverIdx] || rawImages[0]
      : editingSub.coverImage;

    const images = rawImages.map((url, idx) => ({
      id: `img${idx + 1}`,
      url,
      displayOrder: idx + 1
    }));

    const galleryResult = await saveGallery(editingSub.slug, {
      subcategoryId: editingSub.slug,
      coverImage: finalCover,
      imageCount: rawImages.length,
      images
    });
    if (!galleryResult.success) {
      console.error("Firestore: gallery save failed", galleryResult.error);
    }

    console.log("Firestore: Updating subcategory...");
    const result = await updateFirestoreSubcategory(editingSub.slug, {
      name: editingSub.name,
      slug: editingSub.slug,
      categoryId: editingSub.categoryId,
      visible: editingSub.visible,
      displayOrder: editingSub.displayOrder,
      coverImage: finalCover,
      imageCount: rawImages.length
    });
    if (!result.success) {
      console.error("Firestore: update failed", result.error);
      alert('Error saving subcategory: ' + (result.error || 'Unknown error'));
      return;
    }
    console.log("Firestore: update success for", editingSub.slug);
    await refreshSubcategories();
    setEditingSub(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete subcategory "${id}"?`)) {
      console.log("Firestore: Deleting subcategory...");
      const result = await deleteFirestoreSubcategory(id);
      if (!result.success) {
        console.error("Firestore: delete failed", result.error);
        alert('Error deleting subcategory: ' + (result.error || 'Unknown error'));
        return;
      }
      console.log("Firestore: delete success for", id);
      await deleteFirestoreGallery(id);
      await refreshSubcategories();
    }
  };

  const toggleVisibility = async (sub) => {
    const updated = { ...sub, visible: sub.visible === undefined ? false : !sub.visible };
    console.log("Firestore: Toggling visibility...");
    const result = await updateFirestoreSubcategory(sub.slug || sub.id, {
      name: updated.name,
      slug: updated.slug || updated.id,
      categoryId: updated.categoryId,
      visible: updated.visible,
      displayOrder: updated.displayOrder,
      coverImage: updated.coverImage,
      imageCount: getGalleryImageCount(updated.slug || updated.id)
    });
    if (!result.success) {
      console.error("Firestore: visibility toggle failed", result.error);
      alert('Error updating visibility: ' + (result.error || 'Unknown error'));
      return;
    }
    console.log("Firestore: visibility toggle success for", sub.slug || sub.id);
    await refreshSubcategories();
  };

  const openEdit = (sub) => {
    const slug = sub.slug || sub.id;
    const images = getGalleryImages(slug);
    setEditingSub({
      ...sub,
      id: slug,
      galleryImages: images,
      coverIndex: 0
    });
    setFormOpen(false);
  };

  const onFileDrop = async (e, isEdit = false) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (!file) return;
    try {
      if (isEdit) setEditUploading(true);
      else setIsUploading(true);
      const base64 = await compressImage(file);
      if (isEdit) {
        setEditingSub(prev => ({ ...prev, coverImage: base64 }));
      } else {
        setNewSubCover(base64);
      }
    } catch {
      alert('Error loading image. Try compressing a smaller file.');
    } finally {
      setIsUploading(false);
      setEditUploading(false);
    }
  };

  // Gallery image management handlers (works on editingSub)
  const handleMultipleFiles = async (e) => {
    e.preventDefault();
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0 || !editingSub) return;
    setIsUploadingImages(true);
    const newBase64s = [];
    for (let i = 0; i < files.length; i++) {
      try {
        newBase64s.push(await compressImage(files[i]));
      } catch (err) {
        console.error("Error compressing image:", err);
      }
    }
    setEditingSub(prev => ({
      ...prev,
      galleryImages: [...newBase64s, ...(prev.galleryImages || [])]
    }));
    setIsUploadingImages(false);
  };

  const moveImage = (index, direction) => {
    if (!editingSub) return;
    const arr = [...(editingSub.galleryImages || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= arr.length) return;
    [arr[index], arr[targetIdx]] = [arr[targetIdx], arr[index]];
    let newCover = editingSub.coverIndex || 0;
    if (newCover === index) newCover = targetIdx;
    else if (newCover === targetIdx) newCover = index;
    setEditingSub(prev => ({ ...prev, galleryImages: arr, coverIndex: newCover }));
  };

  const setCoverImage = (index) => {
    if (!editingSub) return;
    setEditingSub(prev => ({ ...prev, coverIndex: index }));
  };

  const requestDeleteImage = (index) => {
    setConfirmDelete({ open: true, imageIndex: index });
  };

  const confirmDeleteImage = () => {
    const { imageIndex } = confirmDelete;
    if (!editingSub || imageIndex < 0) return;
    const arr = [...(editingSub.galleryImages || [])];
    arr.splice(imageIndex, 1);
    let coverIdx = editingSub.coverIndex || 0;
    if (coverIdx >= arr.length) coverIdx = Math.max(0, arr.length - 1);
    else if (coverIdx > imageIndex) coverIdx--;
    setEditingSub(prev => ({ ...prev, galleryImages: arr, coverIndex: coverIdx }));
    setConfirmDelete({ open: false, imageIndex: -1 });
  };

  const reorderImages = (from, to) => {
    if (from === to || !editingSub) return;
    setEditingSub(prev => {
      const arr = [...(prev.galleryImages || [])];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      let newCover = prev.coverIndex || 0;
      if (from === newCover) newCover = to;
      else if (from < newCover && to >= newCover) newCover--;
      else if (from > newCover && to <= newCover) newCover++;
      return { ...prev, galleryImages: arr, coverIndex: newCover };
    });
  };

  const handleDragStart = (idx, e) => {
    setDraggedIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragOver = (idx) => {
    if (draggedIndex === null || draggedIndex === idx) return;
    setDragOverIndex(idx);
  };

  const handleDrop = (idx) => {
    if (draggedIndex === null || draggedIndex === idx) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    reorderImages(draggedIndex, idx);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleTouchStart = (idx, e) => {
    const touch = e.touches[0];
    touchDragRef.current = { from: idx, startX: touch.clientX, startY: touch.clientY, moved: false };
  };

  const handleTouchMove = (idx, e) => {
    if (!touchDragRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - touchDragRef.current.startX;
    const dy = touch.clientY - touchDragRef.current.startY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) touchDragRef.current.moved = true;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const thumb = element?.closest('[data-thumb-index]');
    if (thumb) {
      const overIdx = parseInt(thumb.dataset.thumbIndex, 10);
      setDragOverIndex(overIdx);
    }
  };

  const handleTouchEnd = () => {
    if (!touchDragRef.current) return;
    if (touchDragRef.current.moved && dragOverIndex !== null && dragOverIndex !== touchDragRef.current.from) {
      reorderImages(touchDragRef.current.from, dragOverIndex);
    }
    touchDragRef.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (!pageReady || ctxLoading) {
    return (
      <div className="flex flex-col gap-8 animate-fadeIn text-xs md:text-sm">
        <div className="flex items-center justify-center py-20 text-stone-400 text-sm">
          <svg className="animate-spin w-5 h-5 mr-3 text-amber-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading subcategories...
        </div>
      </div>
    );
  }

  if (ctxError) {
    return (
      <div className="flex flex-col gap-8 animate-fadeIn text-xs md:text-sm">
        <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-4">
          <p className="text-sm text-red-600">Failed to load subcategories: {ctxError}</p>
          <button onClick={refreshSubcategories} className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fadeIn text-xs md:text-sm">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg md:text-xl font-medium text-stone-850">Subcategories Configuration</h3>
          <p className="text-stone-500 text-xs mt-1">Manage subcategories, upload gallery images, set cover photos, and organize by category.</p>
        </div>
        <button
          onClick={() => {
            setEditingSub(null);
            setFormOpen(!formOpen);
          }}
          className="px-4 py-2.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1"
        >
          <span>{formOpen ? 'Cancel' : 'Add Subcategory'}</span>
        </button>
      </div>

      {/* Add Form */}
      {formOpen && !editingSub && (
        <form onSubmit={handleCreate} className="bg-white border border-stone-200 p-6 rounded-lg shadow-xs flex flex-col gap-4 max-w-xl animate-fadeIn">
          <h4 className="font-heading font-medium text-stone-850 text-sm uppercase tracking-wider">Register New Subcategory</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Subcategory ID / Slug</label>
              <input type="text" value={newSubId} onChange={(e) => setNewSubId(e.target.value.toLowerCase().replace(/\s+/g, '-'))} className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800" placeholder="e.g. single-door" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Subcategory Name</label>
              <input type="text" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800" placeholder="e.g. Single Door" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Parent Category</label>
              <select value={newSubParent} onChange={(e) => setNewSubParent(e.target.value)} className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800" required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Short Description</label>
              <input type="text" value={newSubDesc} onChange={(e) => setNewSubDesc(e.target.value)} className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800" placeholder="e.g. Handmade White Oak sliding doors" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Subcategory Cover Image</label>
            <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => onFileDrop(e, false)} className="border-2 border-dashed border-stone-200 rounded-lg p-5 flex flex-col items-center justify-center gap-3 bg-stone-50/50 hover:bg-stone-50 transition-colors relative">
              {isUploading ? (
                <div className="text-stone-500 text-xs">Compressing image...</div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded border border-stone-200 overflow-hidden bg-white shadow-inner">
                    <img src={newSubCover} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <span className="text-amber-600 font-semibold cursor-pointer hover:underline">Upload file</span>
                    <input type="file" accept="image/*" onChange={(e) => onFileDrop(e, false)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <p className="text-[10px] text-stone-400 mt-1">Drag and drop file here</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <button type="submit" className="px-4 py-2.5 rounded bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors w-fit mt-2">Create Subcategory</button>
        </form>
      )}

      {/* Edit Form Panel */}
      {editingSub && (
        <form onSubmit={handleEditSubmit} className="bg-white border border-amber-600/30 p-6 rounded-lg shadow-md flex flex-col gap-4 max-w-2xl animate-fadeIn">
          <h4 className="font-heading font-medium text-amber-700 text-sm uppercase tracking-wider">Edit Subcategory: {editingSub.name}</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Subcategory Name</label>
              <input type="text" value={editingSub.name} onChange={(e) => setEditingSub({ ...editingSub, name: e.target.value })} className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800" required />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="editSubVisible" checked={editingSub.visible !== false} onChange={(e) => setEditingSub({ ...editingSub, visible: e.target.checked })} className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500" />
              <label htmlFor="editSubVisible" className="text-xs font-semibold text-stone-500 uppercase tracking-wider cursor-pointer">Show on Customer Site</label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Parent Category Reference</label>
              <select value={editingSub.categoryId} onChange={(e) => setEditingSub({ ...editingSub, categoryId: e.target.value })} className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800" required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Description</label>
              <input type="text" value={editingSub.description || ''} onChange={(e) => setEditingSub({ ...editingSub, description: e.target.value })} className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800" />
            </div>
          </div>

          {/* Gallery Image Management */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Gallery Images (Multiple Uploads)</label>
            <div onDragOver={(e) => e.preventDefault()} onDrop={handleMultipleFiles} className="border-2 border-dashed border-stone-200 rounded-lg p-5 flex flex-col items-center justify-center gap-2 bg-stone-50/50 hover:bg-stone-50 transition-colors relative">
              <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-amber-600 font-semibold cursor-pointer hover:underline">Select images</span>
              <input type="file" multiple accept="image/*" onChange={handleMultipleFiles} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="text-[10px] text-stone-400">Drag & Drop multiple images. Use the star icon to choose your cover photo.</p>
            </div>

            {(editingSub.galleryImages && editingSub.galleryImages.length > 0) && (
              <div className="mt-1">
                <p className="text-[10px] text-stone-400 mb-1.5">{editingSub.galleryImages.length} image{editingSub.galleryImages.length !== 1 ? 's' : ''}. Cover image marked with <span className="text-amber-500 font-semibold">&#9733;</span>.</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 mt-3">
                  {editingSub.galleryImages.map((img, idx) => (
                    <ImageThumbnail
                      key={idx}
                      src={img}
                      index={idx}
                      isCover={(editingSub.coverIndex || 0) === idx}
                      isFirst={idx === 0}
                      isLast={idx === editingSub.galleryImages.length - 1}
                      isDragOver={dragOverIndex === idx}
                      onMoveLeft={() => moveImage(idx, -1)}
                      onMoveRight={() => moveImage(idx, 1)}
                      onPreview={() => setPreviewImage(img)}
                      onSetCover={() => setCoverImage(idx)}
                      onDelete={() => requestDeleteImage(idx)}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    />
                  ))}
                </div>
              </div>
            )}
            {isUploadingImages && (
              <div className="text-stone-500 font-semibold text-xs mt-1 animate-pulse">Compressing image files...</div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button type="submit" className="px-4 py-2.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors w-fit">Save Changes</button>
            <button type="button" onClick={() => setEditingSub(null)} className="px-4 py-2.5 rounded border border-stone-250 hover:bg-stone-50 text-stone-650 font-semibold text-xs uppercase tracking-wider transition-colors w-fit">Cancel</button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-lg shadow-xs flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search subcategories..." className="w-full pl-9 pr-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800" />
        </div>
        <span className="text-stone-400 font-light text-xs">{Object.values(filteredGrouped).reduce((sum, g) => sum + g.subs.length, 0)} subcategories</span>
      </div>

      {/* Category-grouped Accordions */}
      <div className="flex flex-col gap-4">
        {Object.values(filteredGrouped).length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-stone-400 text-sm">No Subcategories Found</div>
        ) : (
          Object.values(filteredGrouped).map(({ category, subs }) => {
            const totalImages = subs.reduce((sum, s) => sum + (s.galleryImages?.length || 0), 0);
            const isExpanded = expandedCategories.has(category.id);
            return (
              <div key={category.id} className="bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
                <button onClick={() => toggleCategory(category.id)} className="w-full flex items-center justify-between px-5 py-4 bg-stone-50 hover:bg-stone-100 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <svg className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded overflow-hidden border border-stone-200 bg-stone-100">
                        <img src={category.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-heading font-medium text-stone-850 text-sm">{category.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-stone-500">
                    <span>{subs.length} subcategor{subs.length !== 1 ? 'ies' : 'y'}</span>
                    <span className="font-semibold text-amber-700">{totalImages} image{totalImages !== 1 ? 's' : ''}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="divide-y divide-stone-100">
                    {subs.map(sub => {
                      const imageCount = sub.galleryImages?.length || 0;
                      return (
                        <div key={sub.id} className="flex items-center gap-4 px-5 py-3 hover:bg-stone-50/50 transition-colors">
                          <div className="w-10 h-10 rounded overflow-hidden border border-stone-200 bg-stone-100 shadow-inner shrink-0">
                            <img src={getEffectiveCoverImage(sub)} alt={sub.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-stone-850 text-sm truncate">{sub.name}</div>
                            <div className="text-stone-400 font-mono text-[10px]">{sub.id}</div>
                          </div>
                          <div className="text-xs text-stone-500 shrink-0 text-center">
                            <div><span className="font-semibold text-amber-700">{imageCount}</span> image{imageCount !== 1 ? 's' : ''}</div>
                            <div className="text-[10px] text-stone-400 mt-0.5">Updated {formatDate(sub.updatedAt)}</div>
                          </div>
                          <button onClick={() => toggleVisibility(sub)} className="shrink-0 text-stone-600 hover:text-stone-800" title={sub.visible !== false ? "Hide Subcategory" : "Show Subcategory"}>
                            {sub.visible !== false ? (
                              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            ) : (
                              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L17.772 17.772m0 0a9.965 9.965 0 01-2.909 1.332M9.172 9.172a3 3 0 014.242 4.242" /></svg>
                            )}
                          </button>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => openEdit(sub)} className="text-amber-600 hover:text-amber-700 font-semibold uppercase tracking-wider text-xs">Edit</button>
                            <button onClick={() => handleDelete(sub.id)} className="text-red-650 hover:text-red-700 font-semibold uppercase tracking-wider text-xs">Delete</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ConfirmModal open={confirmDelete.open} title="Delete Image?" message="This action cannot be undone. The image will be permanently removed." onConfirm={confirmDeleteImage} onCancel={() => setConfirmDelete({ open: false, imageIndex: -1 })} />
      <PreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
}
