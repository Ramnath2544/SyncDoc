import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Spinner,
  Modal,
  TextInput,
  Label,
  Dropdown,
  Badge,
  DropdownItem,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'flowbite-react';
import {
  HiPlus,
  HiDocumentText,
  HiDotsVertical,
  HiPencil,
  HiTrash,
  HiClock,
} from 'react-icons/hi';

export default function DashboardPage() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [renameModal, setRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameLoading, setRenameLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('/api/documents', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) setDocuments(data);
      } catch (err) {
        console.error('Failed to fetch documents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/documents/${data._id}`);
      }
    } catch (err) {
      console.error('Failed to create document:', err);
    } finally {
      setCreating(false);
    }
  };

  const openRename = (doc) => {
    setRenameTarget(doc);
    setRenameValue(doc.title);
    setRenameModal(true);
  };

  const handleRename = async () => {
    if (!renameValue.trim()) return;
    setRenameLoading(true);
    try {
      const res = await fetch(`/api/documents/${renameTarget._id}/title`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: renameValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setDocuments((prev) =>
          prev.map((d) => (d._id === data._id ? data : d)),
        );
        setRenameModal(false);
      }
    } catch (err) {
      console.error('Failed to rename:', err);
    } finally {
      setRenameLoading(false);
    }
  };

  const openDelete = (doc) => {
    setDeleteTarget(doc);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/documents/${deleteTarget._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d._id !== deleteTarget._id));
        setDeleteModal(false);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOwner = (doc) =>
    doc.owner?._id === currentUser?._id || doc.owner === currentUser?._id;

  const getRole = (doc) => {
    if (isOwner(doc)) return 'owner';
    const collab = doc.collaborators?.find(
      (c) =>
        c.userId?._id === currentUser?._id || c.userId === currentUser?._id,
    );
    return collab?.role || 'viewer';
  };

  const roleBadgeColor = { owner: 'blue', editor: 'green', viewer: 'gray' };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
              My Documents
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Welcome back,{' '}
              <span className='font-medium text-blue-600 dark:text-blue-400'>
                {currentUser?.username}
              </span>{' '}
              👋
            </p>
          </div>
          <Button
            gradientDuoTone='cyanToBlue'
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? (
              <>
                <Spinner size='sm' className='mr-2' />
                Creating...
              </>
            ) : (
              <>
                <HiPlus className='mr-2 text-lg' />
                New Document
              </>
            )}
          </Button>
        </div>

        {loading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className='h-36 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse'
              />
            ))}
          </div>
        )}

        {!loading && documents.length === 0 && (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <HiDocumentText className='text-7xl text-gray-300 dark:text-gray-600 mb-4' />
            <h2 className='text-xl font-semibold text-gray-600 dark:text-gray-400'>
              No documents yet
            </h2>
            <p className='text-sm text-gray-400 dark:text-gray-500 mt-1 mb-6'>
              Create your first document to get started
            </p>
            <Button gradientDuoTone='cyanToBlue' onClick={handleCreate}>
              <HiPlus className='mr-2' />
              Create Document
            </Button>
          </div>
        )}

        {/* Document Cards Grid */}
        {!loading && documents.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {documents.map((doc) => {
              const role = getRole(doc);
              return (
                <Card
                  key={doc._id}
                  className='cursor-pointer hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 group'
                >
                  {/* Card Top: Title + Menu */}
                  <div className='flex items-start justify-between gap-2'>
                    <div
                      className='flex-1 min-w-0'
                      onClick={() => navigate(`/documents/${doc._id}`)}
                    >
                      <div className='flex items-center gap-2 mb-1'>
                        <HiDocumentText className='text-blue-500 text-xl flex-shrink-0' />
                        <h3 className='font-semibold text-gray-800 dark:text-white truncate text-sm'>
                          {doc.title}
                        </h3>
                      </div>
                      {/* Role Badge */}
                      <Badge
                        color={roleBadgeColor[role]}
                        size='sm'
                        className='w-fit capitalize'
                      >
                        {role}
                      </Badge>
                    </div>

                    {/* 3-dot Menu */}
                    <Dropdown
                      arrowIcon={false}
                      inline
                      label={
                        <span className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'>
                          <HiDotsVertical className='text-lg' />
                        </span>
                      }
                    >
                      {(role === 'owner' || role === 'editor') && (
                        <DropdownItem
                          icon={HiPencil}
                          onClick={() => openRename(doc)}
                        >
                          Rename
                        </DropdownItem>
                      )}
                      {/* Delete — owner only */}
                      {role === 'owner' && (
                        <DropdownItem
                          icon={HiTrash}
                          onClick={() => openDelete(doc)}
                          className='text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        >
                          Delete
                        </DropdownItem>
                      )}
                      {/* Viewer gets open only */}
                      <DropdownItem
                        icon={HiDocumentText}
                        onClick={() => navigate(`/documents/${doc._id}`)}
                      >
                        Open
                      </DropdownItem>
                    </Dropdown>
                  </div>

                  {/* Card Footer: Last updated */}
                  <div
                    className='flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-2'
                    onClick={() => navigate(`/documents/${doc._id}`)}
                  >
                    <HiClock />
                    <span>Updated {formatDate(doc.updatedAt)}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal show={renameModal} onClose={() => setRenameModal(false)} size='md'>
        <ModalHeader>Rename Document</ModalHeader>
        <ModalBody>
          <div className='flex flex-col gap-3'>
            <Label htmlFor='rename' value='New title' />
            <TextInput
              id='rename'
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder='Enter new title...'
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            gradientDuoTone='cyanToBlue'
            onClick={handleRename}
            disabled={renameLoading}
          >
            {renameLoading ? <Spinner size='sm' /> : 'Save'}
          </Button>
          <Button color='gray' onClick={() => setRenameModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal show={deleteModal} onClose={() => setDeleteModal(false)} size='md'>
        <ModalHeader>Delete Document</ModalHeader>
        <ModalBody>
          <p className='text-gray-600 dark:text-gray-300'>
            Are you sure you want to delete{' '}
            <span className='font-semibold text-gray-800 dark:text-white'>
              '{deleteTarget?.title}'
            </span>
            ? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color='failure'
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? <Spinner size='sm' /> : 'Yes, Delete'}
          </Button>
          <Button color='gray' onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
