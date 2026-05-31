import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { compressImage } from '../../shared/data/mockData';
import { addFirestoreCategory, updateFirestoreCategory, deleteFirestoreCategory, addFirestoreSubcategory, updateFirestoreSubcategory, deleteFirestoreSubcategory, deleteFirestoreGallery, setFirestoreGallery } from '../../shared/services/firebase';
import { useCategories } from '../../shared/contexts/CategoriesContext';
import { useSubcategories } from '../../shared/contexts/SubcategoriesContext';
import { useGalleries } from '../../shared/contexts/GalleriesContext';

export default function CategoriesPage() {
  const { categories: ctxCategories, loading: ctxLoading, error: ctxError, refreshCategories } = useCategories();
  const { subcategories: ctxSubcategories, refreshSubcategories } = useSubcategories();
  const { getGalleryImages, getGalleryImageCount, getGalleryCoverImage, saveGallery } = useGalleries();
  const [categories, setCategories] = useState([]);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (!ctxLoading) {
      const sorted = [...ctxCategories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      setCategories(sorted);
      setPageReady(true);
    }
  }, [ctxCategories, ctxLoading]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(term));
  }, [categories, searchTerm]);

  const allSubcategories = useMemo(() =>
    [...ctxSubcategories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    [ctxSubcategories]
  );

  // Create Category States
  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatCover, setNewCatCover] = useState('/assets/images/door_single.png');
  const [formOpen, setFormOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Category States
  const [editingCat, setEditingCat] = useState(null);
  const [editUploading, setEditUploading] = useState(false);

  // Inline subcategory management
  const [subInlineAddOpen, setSubInlineAddOpen] = useState(false);
  const [editingSubInline, setEditingSubInline] = useState(null);
  const [subInlineIsUploading, setSubInlineIsUploading] = useState(false);

  // Inline add subcategory form
  const [inlineSubId, setInlineSubId] = useState('');
  const [inlineSubName, setInlineSubName] = useState('');
  const [inlineSubDesc, setInlineSubDesc] = useState('');
  const [inlineSubCover, setInlineSubCover] = useState('/assets/images/door_single.png');

  // Drag and Drop ordering states
  const [draggedIndex, setDraggedIndex] = useState(null);

  const getImageCount = (sub) => getGalleryImageCount(sub.slug) || 0;
  const getSubCover = (sub) => getGalleryCoverImage(sub.slug) || sub.coverImage;

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getCategoryLastUpdated = (catId) => {
    const subs = allSubcategories.filter(s => s.categoryId === catId);
    const dates = subs.map(s => s.updatedAt).filter(Boolean).sort().reverse();
    return dates.length > 0 ? dates[0] : null;
  };

  const relatedSubs = editingCat
    ? allSubcategories.filter(s => s.categoryId === editingCat.id)
    : [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatId || !newCatName) return;

    if (categories.find(c => c.id === newCatId)) {
      alert('Category ID already exists!');
      return;
    }

    const newCat = {
      id: newCatId,
      name: newCatName,
      coverImage: newCatCover,
      description: newCatDesc,
      displayOrder: categories.length,
      visible: true
    };

    const result = await addFirestoreCategory(newCat);
    if (!result.success) {
      alert('Error creating category: ' + (result.error || 'Unknown error'));
      return;
    }
    await refreshList();

    setNewCatId('');
    setNewCatName('');
    setNewCatDesc('');
    setNewCatCover('/assets/images/door_single.png');
    setFormOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCat) return;

    const result = await updateFirestoreCategory(editingCat.id, editingCat);
    if (!result.success) {
      alert('Error saving category: ' + (result.error || 'Unknown error'));
      return;
    }
    await refreshList();
    setEditingCat(null);
  };

  const refreshList = useCallback(async () => {
    await refreshCategories();
  }, [refreshCategories]);

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete category "${id}"? This will remove it from the showroom.`)) {
      const result = await deleteFirestoreCategory(id);
      if (!result.success) {
        alert('Error deleting category: ' + (result.error || 'Unknown error'));
        return;
      }
      await refreshList();
    }
  };

  const toggleVisibility = async (cat) => {
    const updated = { ...cat, visible: cat.visible === undefined ? false : !cat.visible };
    const result = await updateFirestoreCategory(cat.id, updated);
    if (!result.success) {
      alert('Error updating visibility: ' + (result.error || 'Unknown error'));
      return;
    }
    await refreshList();
  };

  // Image Upload Compress Handler
  const onFileDrop = async (e, isEdit = false) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (!file) return;

    try {
      if (isEdit) setEditUploading(true);
      else setIsUploading(true);

      const compressedBase64 = await compressImage(file);

      if (isEdit) {
        setEditingCat(prev => ({ ...prev, coverImage: compressedBase64 }));
      } else {
        setNewCatCover(compressedBase64);
      }
    } catch {
      alert('Error compressing image. Try a smaller file.');
    } finally {
      setIsUploading(false);
      setEditUploading(false);
    }
  };

  // Subcategory inline management handlers
  const handleInlineAddSub = async (e) => {
    e.preventDefault();
    if (!inlineSubName || !editingCat) return;

    const slug = inlineSubId || inlineSubName.toLowerCase().replace(/\s+/g, '-');
    if (allSubcategories.find(s => s.slug === slug)) {
      alert('Subcategory slug already exists!');
      return;
    }

    const newSub = {
      slug,
      categoryId: editingCat.id,
      name: inlineSubName,
      coverImage: inlineSubCover,
      displayOrder: allSubcategories.length,
      visible: true
    };

    const result = await addFirestoreSubcategory(newSub);
    if (result.success) {
      await setFirestoreGallery(slug, {
        subcategoryId: slug,
        coverImage: inlineSubCover,
        imageCount: 0,
        images: []
      });
      await refreshSubcategories();
    } else {
      alert('Failed to create subcategory: ' + (result.error || 'Unknown error'));
      return;
    }

    setInlineSubId('');
    setInlineSubName('');
    setInlineSubDesc('');
    setInlineSubCover('/assets/images/door_single.png');
    setSubInlineAddOpen(false);
    setEditingCat(prev => ({ ...prev }));
  };

  const handleInlineSubFileDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (!file) return;

    try {
      setSubInlineIsUploading(true);
      const base64 = await compressImage(file);
      setInlineSubCover(base64);
    } catch {
      alert('Error loading image.');
    } finally {
      setSubInlineIsUploading(false);
    }
  };

  const handleInlineEditSubFileDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (!file) return;

    try {
      setSubInlineIsUploading(true);
      const base64 = await compressImage(file);
      setEditingSubInline(prev => ({ ...prev, coverImage: base64 }));
    } catch {
      alert('Error loading image.');
    } finally {
      setSubInlineIsUploading(false);
    }
  };

  const handleInlineEditSubSubmit = async (e) => {
    e.preventDefault();
    if (!editingSubInline) return;
    const result = await updateFirestoreSubcategory(editingSubInline.slug, editingSubInline);
    if (!result.success) {
      alert('Failed to update subcategory: ' + (result.error || 'Unknown error'));
      return;
    }
    await refreshSubcategories();
    setEditingSubInline(null);
    setEditingCat(prev => ({ ...prev }));
  };

  const handleInlineDeleteSub = async (slug) => {
    if (window.confirm(`Delete subcategory "${slug}"?`)) {
      const result = await deleteFirestoreSubcategory(slug);
      if (!result.success) {
        alert('Failed to delete subcategory: ' + (result.error || 'Unknown error'));
        return;
      }
      await deleteFirestoreGallery(slug);
      await refreshSubcategories();
      setEditingCat(prev => ({ ...prev }));
    }
  };

  const handleInlineToggleSubVisibility = async (sub) => {
    const updated = { ...sub, visible: sub.visible === undefined ? false : !sub.visible };
    const result = await updateFirestoreSubcategory(sub.slug, updated);
    if (!result.success) {
      alert('Failed to update subcategory visibility: ' + (result.error || 'Unknown error'));
      return;
    }
    await refreshSubcategories();
    setEditingCat(prev => ({ ...prev }));
  };

  // HTML5 Drag and drop reordering handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const list = [...categories];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, draggedItem);

    const ordered = list.map((item, idx) => ({
      ...item,
      displayOrder: idx
    }));

    setCategories(ordered);
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    for (let i = 0; i < categories.length; i++) {
      await updateFirestoreCategory(categories[i].id, categories[i]);
    }
  };

  if (!pageReady || ctxLoading) {
    return (
      <div className="flex flex-col gap-8 animate-fadeIn text-xs md:text-sm">
        <div className="flex items-center justify-center py-20 text-stone-400 text-sm">
          <svg className="animate-spin w-5 h-5 mr-3 text-amber-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading categories...
        </div>
      </div>
    );
  }

  if (ctxError) {
    return (
      <div className="flex flex-col gap-8 animate-fadeIn text-xs md:text-sm">
        <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-4">
          <p className="text-sm text-red-600">Failed to load categories: {ctxError}</p>
          <button onClick={refreshCategories} className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors">
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
          <h3 className="font-heading text-lg md:text-xl font-medium text-stone-850">Categories Configuration</h3>
          <p className="text-stone-500 text-xs mt-1">Manage parent category folders, visibility, cover images, and drag listings to change website orders.</p>
        </div>
        {!editingCat && (
          <button
            onClick={() => {
              setFormOpen(!formOpen);
            }}
            className="px-4 py-2.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1"
          >
            <span>{formOpen ? 'Cancel' : 'Add Category'}</span>
          </button>
        )}
      </div>

      {/* Add Form Container - only when NOT editing */}
      {formOpen && !editingCat && (
        <form onSubmit={handleCreate} className="bg-white border border-stone-200 p-6 rounded-lg shadow-xs flex flex-col gap-4 max-w-xl animate-fadeIn">
          <h4 className="font-heading font-medium text-stone-850 text-sm uppercase tracking-wider">Register New Category</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Category ID / Slug</label>
              <input
                type="text"
                value={newCatId}
                onChange={(e) => setNewCatId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800"
                placeholder="e.g. chairs"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Category Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800"
                placeholder="e.g. Chairs"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Short Description</label>
            <textarea
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800 h-20 resize-none"
              placeholder="Provide a description of the products..."
              required
            />
          </div>

          {/* Upload Dropzone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Category Cover Image</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onFileDrop(e, false)}
              className="border-2 border-dashed border-stone-200 rounded-lg p-5 flex flex-col items-center justify-center gap-3 bg-stone-50/50 hover:bg-stone-50 transition-colors relative group"
            >
              {isUploading ? (
                <div className="text-stone-500 text-xs">Compressing image...</div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded border border-stone-200 overflow-hidden bg-white shadow-inner">
                    <img src={newCatCover} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <span className="text-amber-600 font-semibold cursor-pointer hover:underline">Upload file</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileDrop(e, false)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">Drag and drop any showroom image here</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 rounded bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors w-fit mt-2"
          >
            Create Category
          </button>
        </form>
      )}

      {/* Edit Category Form + Related Subcategories */}
      {editingCat && (
        <>
          {/* Edit Category Form */}
          <form onSubmit={handleEditSubmit} className="bg-white border border-amber-600/30 p-6 rounded-lg shadow-md flex flex-col gap-4 max-w-xl animate-fadeIn">
            <h4 className="font-heading font-medium text-amber-700 text-sm uppercase tracking-wider">Editing Category: {editingCat.name}</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Category Name</label>
                <input
                  type="text"
                  value={editingCat.name}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800"
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="editVisible"
                  checked={editingCat.visible !== false}
                  onChange={(e) => setEditingCat({ ...editingCat, visible: e.target.checked })}
                  className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="editVisible" className="text-xs font-semibold text-stone-500 uppercase tracking-wider cursor-pointer">
                  Show on Customer Site
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Description</label>
              <textarea
                value={editingCat.description}
                onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                className="px-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800 h-20 resize-none"
                required
              />
            </div>

            {/* Edit Uploader */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Category Cover Image</label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onFileDrop(e, true)}
                className="border-2 border-dashed border-stone-200 rounded-lg p-5 flex flex-col items-center justify-center gap-3 bg-stone-50/50 hover:bg-stone-50 transition-colors relative"
              >
                {editUploading ? (
                  <div className="text-stone-500 text-xs">Compressing image...</div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded border border-stone-200 overflow-hidden bg-white shadow-inner">
                      <img src={editingCat.coverImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <span className="text-amber-600 font-semibold cursor-pointer hover:underline">Upload cover photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onFileDrop(e, true)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <p className="text-[10px] text-stone-400 mt-1">Drag and drop file here to replace</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="submit"
                className="px-4 py-2.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors w-fit"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingCat(null)}
                className="px-4 py-2.5 rounded border border-stone-250 hover:bg-stone-50 text-stone-650 font-semibold text-xs uppercase tracking-wider transition-colors w-fit"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Related Subcategories Section */}
          <div className="bg-white border border-stone-200/80 rounded-lg shadow-sm overflow-hidden animate-fadeIn">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <h4 className="font-heading font-medium text-stone-850 text-sm uppercase tracking-wider">Related Subcategories</h4>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {relatedSubs.length} subcategor{relatedSubs.length === 1 ? 'y' : 'ies'}
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {relatedSubs.reduce((sum, s) => sum + (getGalleryImageCount(s.slug) || 0), 0)} image{relatedSubs.reduce((sum, s) => sum + (getGalleryImageCount(s.slug) || 0), 0) !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubInlineAddOpen(!subInlineAddOpen);
                  setEditingSubInline(null);
                }}
                className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1"
              >
                {subInlineAddOpen ? 'Cancel' : 'Add Subcategory'}
              </button>
            </div>

            {/* Inline Add Subcategory Form */}
            {subInlineAddOpen && (
              <form onSubmit={handleInlineAddSub} className="p-5 border-b border-stone-200 bg-amber-50/30 flex flex-col gap-4">
                <h5 className="text-xs font-semibold text-stone-600 uppercase tracking-wider">New Subcategory under <span className="text-amber-700">{editingCat.name}</span></h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">ID / Slug</label>
                    <input
                      type="text"
                      value={inlineSubId}
                      onChange={(e) => setInlineSubId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="px-3 py-2 rounded border border-stone-250 bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800"
                      placeholder="auto from name"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Name *</label>
                    <input
                      type="text"
                      value={inlineSubName}
                      onChange={(e) => {
                        setInlineSubName(e.target.value);
                        if (!inlineSubId) {
                          setInlineSubId(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                        }
                      }}
                      className="px-3 py-2 rounded border border-stone-250 bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800"
                      placeholder="e.g. Sliding Door"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Description</label>
                    <input
                      type="text"
                      value={inlineSubDesc}
                      onChange={(e) => setInlineSubDesc(e.target.value)}
                      className="px-3 py-2 rounded border border-stone-250 bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800"
                      placeholder="Short description"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Cover Image</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleInlineSubFileDrop}
                    className="border-2 border-dashed border-stone-200 rounded-lg p-3 flex items-center gap-4 bg-white hover:bg-stone-50 transition-colors relative"
                  >
                    {subInlineIsUploading ? (
                      <div className="text-stone-500 text-xs">Compressing...</div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded border border-stone-200 overflow-hidden bg-white shadow-inner flex-shrink-0">
                          <img src={inlineSubCover} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center">
                          <span className="text-amber-600 font-semibold cursor-pointer hover:underline text-[10px]">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleInlineSubFileDrop}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-stone-900 hover:bg-stone-800 text-white font-semibold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    Create Subcategory
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubInlineAddOpen(false)}
                    className="px-4 py-2 rounded border border-stone-250 hover:bg-stone-50 text-stone-650 font-semibold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Subcategory Edit Form */}
            {editingSubInline && (
              <form onSubmit={handleInlineEditSubSubmit} className="p-5 border-b border-stone-200 bg-blue-50/30 flex flex-col gap-4">
                <h5 className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Editing Subcategory: <span className="text-amber-700">{editingSubInline.name}</span></h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      value={editingSubInline.name}
                      onChange={(e) => setEditingSubInline({ ...editingSubInline, name: e.target.value })}
                      className="px-3 py-2 rounded border border-stone-250 bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Description</label>
                    <input
                      type="text"
                      value={editingSubInline.description || ''}
                      onChange={(e) => setEditingSubInline({ ...editingSubInline, description: e.target.value })}
                      className="px-3 py-2 rounded border border-stone-250 bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <input
                      type="checkbox"
                      id="editInlineSubVisible"
                      checked={editingSubInline.visible !== false}
                      onChange={(e) => setEditingSubInline({ ...editingSubInline, visible: e.target.checked })}
                      className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="editInlineSubVisible" className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider cursor-pointer">
                      Visible
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Cover Image</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleInlineEditSubFileDrop}
                    className="border-2 border-dashed border-stone-200 rounded-lg p-3 flex items-center gap-4 bg-white hover:bg-stone-50 transition-colors relative"
                  >
                    {subInlineIsUploading ? (
                      <div className="text-stone-500 text-xs">Compressing...</div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded border border-stone-200 overflow-hidden bg-white shadow-inner flex-shrink-0">
                          <img src={editingSubInline.coverImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center">
                          <span className="text-amber-600 font-semibold cursor-pointer hover:underline text-[10px]">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleInlineEditSubFileDrop}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    Save Subcategory
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSubInline(null)}
                    className="px-4 py-2 rounded border border-stone-250 hover:bg-stone-50 text-stone-650 font-semibold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Subcategories List */}
            {relatedSubs.length === 0 && !subInlineAddOpen ? (
              <div className="p-8 text-center text-stone-400 text-sm">
                No subcategories yet. Click "Add Subcategory" to create one.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-3 pl-6 w-14">Cover</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Images</th>
                    <th className="p-3">Visible</th>
                    <th className="p-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-stone-700 divide-y divide-stone-100">
                  {relatedSubs.map((sub) => {
                    const imageCount = getImageCount(sub);
                    return (
                      <tr key={sub.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-3 pl-6">
                          <div className="w-10 h-10 rounded overflow-hidden border border-stone-200 bg-stone-100 shadow-inner">
                            <img src={getSubCover(sub)} alt={sub.name} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-stone-850 text-xs">{sub.name}</td>
                        <td className="p-3">
                          <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {imageCount} image{imageCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleInlineToggleSubVisibility(sub)}
                            className="text-stone-600 hover:text-stone-800"
                            title={sub.visible !== false ? 'Hide Subcategory' : 'Show Subcategory'}
                          >
                            {sub.visible !== false ? (
                              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L17.772 17.772m0 0a9.965 9.965 0 01-2.909 1.332M9.172 9.172a3 3 0 014.242 4.242" />
                              </svg>
                            )}
                          </button>
                        </td>
                        <td className="p-3 pr-6 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSubInlineAddOpen(false);
                              setEditingSubInline(sub);
                            }}
                            className="text-amber-600 hover:text-amber-700 font-semibold uppercase tracking-wider text-[10px]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleInlineDeleteSub(sub.slug)}
                            className="text-red-650 hover:text-red-700 font-semibold uppercase tracking-wider text-[10px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-lg shadow-xs flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search categories..." className="w-full pl-9 pr-3 py-2 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-xs text-stone-800" />
        </div>
        <span className="text-stone-400 font-light text-xs">{filteredCategories.length} categor{filteredCategories.length === 1 ? 'y' : 'ies'}</span>
      </div>

      {/* Categories Grid Table */}
      <div className="bg-white border border-stone-200/80 rounded-lg overflow-hidden shadow-sm">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-sm">No Categories Found</div>
        ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <th className="p-4 pl-6 w-10"></th>
              <th className="p-4 w-20">Cover</th>
              <th className="p-4">Name</th>
              <th className="p-4">Subcategories</th>
              <th className="p-4">Images</th>
              <th className="p-4">Last Updated</th>
              <th className="p-4">ID / Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4">Visible</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-stone-700 divide-y divide-stone-100 select-none">
            {filteredCategories.map((cat, index) => (
              <tr
                key={cat.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`hover:bg-stone-50/50 transition-colors cursor-grab active:cursor-grabbing ${
                  draggedIndex === index ? 'opacity-40 bg-amber-50' : ''
                } ${editingCat?.id === cat.id ? 'bg-amber-50/50 border-l-2 border-l-amber-500' : ''}`}
              >
                <td className="p-4 pl-6 text-stone-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M4 8h16M4 16h16" />
                  </svg>
                </td>
                <td className="p-4">
                  <div className="w-12 h-12 rounded overflow-hidden border border-stone-200 bg-stone-100 shadow-inner">
                    <img src={cat.coverImage} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-semibold text-stone-850">{cat.name}</td>
                <td className="p-4">
                  <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {allSubcategories.filter(s => s.categoryId === cat.id).length}
                  </span>
                </td>
                <td className="p-4">
                  <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {allSubcategories.filter(s => s.categoryId === cat.id).reduce((sum, s) => sum + (getGalleryImageCount(s.slug) || 0), 0)}
                  </span>
                </td>
                <td className="p-4 text-[10px] text-stone-500 whitespace-nowrap">
                  {formatDate(getCategoryLastUpdated(cat.id))}
                </td>
                <td className="p-4 text-stone-500 font-mono text-xs">{cat.id}</td>
                <td className="p-4 max-w-xs truncate text-stone-400 font-light">{cat.description}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleVisibility(cat)}
                    className="text-stone-600 hover:text-stone-800"
                    title={cat.visible !== false ? 'Hide Category' : 'Show Category'}
                  >
                    {cat.visible !== false ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L17.772 17.772m0 0a9.965 9.965 0 01-2.909 1.332M9.172 9.172a3 3 0 014.242 4.242" />
                      </svg>
                    )}
                  </button>
                </td>
                <td className="p-4 pr-6 text-right flex items-center justify-end gap-3 mt-4 h-full">
                  <button
                    onClick={() => {
                      setFormOpen(false);
                      setEditingCat(cat);
                      setSubInlineAddOpen(false);
                      setEditingSubInline(null);
                    }}
                    className="text-amber-600 hover:text-amber-700 font-semibold uppercase tracking-wider text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-650 hover:text-red-700 font-semibold uppercase tracking-wider text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

    </div>
  );
}
