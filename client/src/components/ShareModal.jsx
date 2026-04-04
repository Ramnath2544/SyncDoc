import { useState } from 'react';
import {
  Modal,
  TextInput,
  Label,
  Button,
  Select,
  Spinner,
  Avatar,
  Badge,
  ModalFooter,
  ModalBody,
  ModalHeader,
} from 'flowbite-react';
import { HiMail, HiTrash, HiUserAdd } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function ShareModal({
  show,
  onClose,
  document,
  onDocumentUpdate,
}) {
  const { currentUser } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const isOwner =
    document?.owner?._id === currentUser?._id ||
    document?.owner === currentUser?._id;

  const handleInvite = async () => {
    setInviteError('');
    if (!email.trim()) return setInviteError('Please enter an email address.');

    setInviteLoading(true);
    try {
      const res = await fetch(`/api/documents/${document._id}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteError(data.message || 'Failed to invite user.');
      } else {
        onDocumentUpdate(data);
        setEmail('');
        setRole('viewer');
      }
    } catch {
      setInviteError('Something went wrong. Please try again.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(
        `/api/documents/${document._id}/collaborators/${userId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ role: newRole }),
        },
      );
      const data = await res.json();
      if (res.ok) onDocumentUpdate(data);
    } catch (err) {
      console.error('Failed to update role:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (userId) => {
    setRemovingId(userId);
    try {
      const res = await fetch(
        `/api/documents/${document._id}/collaborators/${userId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      const data = await res.json();
      if (res.ok) onDocumentUpdate(data);
    } catch (err) {
      console.error('Failed to remove collaborator:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const roleBadgeColor = { owner: 'blue', editor: 'green', viewer: 'gray' };

  return (
    <Modal show={show} onClose={onClose} size='lg'>
      <ModalHeader>Share '{document?.title || 'Document'}'</ModalHeader>

      <ModalBody className='flex flex-col gap-5'>
        {isOwner && (
          <div className='flex flex-col gap-3'>
            <Label value='Invite by email' />
            <div className='flex gap-2'>
              <TextInput
                type='email'
                icon={HiMail}
                placeholder='collaborator@example.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInviteError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                className='flex-1'
              />
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='w-32'
              >
                <option value='viewer'>Viewer</option>
                <option value='editor'>Editor</option>
              </Select>
              <Button
                gradientDuoTone='cyanToBlue'
                onClick={handleInvite}
                disabled={inviteLoading}
                className='flex-shrink-0'
              >
                {inviteLoading ? (
                  <Spinner size='sm' />
                ) : (
                  <>
                    <HiUserAdd className='mr-1' />
                    Invite
                  </>
                )}
              </Button>
            </div>
            {inviteError && (
              <p className='text-sm text-red-500'>{inviteError}</p>
            )}
          </div>
        )}

        <div className='border-t border-gray-200 dark:border-gray-700' />

        <div className='flex flex-col gap-3'>
          <Label value='People with access' />

          <div className='flex items-center justify-between gap-3 py-1'>
            <div className='flex items-center gap-3 min-w-0'>
              <Avatar
                img={document?.owner?.profilePicture}
                rounded
                size='sm'
                placeholderInitials={document?.owner?.username?.[0]?.toUpperCase()}
              />
              <div className='min-w-0'>
                <p className='text-sm font-medium text-gray-800 dark:text-white truncate'>
                  {document?.owner?.username}
                  {document?.owner?._id === currentUser?._id && (
                    <span className='text-xs text-gray-400 ml-1'>(you)</span>
                  )}
                </p>
                <p className='text-xs text-gray-500 truncate'>
                  {document?.owner?.email}
                </p>
              </div>
            </div>
            <Badge color='blue' className='flex-shrink-0'>
              Owner
            </Badge>
          </div>

          {document?.collaborators?.length === 0 && (
            <p className='text-sm text-gray-400 dark:text-gray-500 text-center py-3'>
              No collaborators yet. Invite someone above!
            </p>
          )}

          {document?.collaborators?.map((collab) => {
            const user = collab.userId;
            const uid = user?._id || user;
            const isSelf = uid === currentUser?._id;

            return (
              <div
                key={uid}
                className='flex items-center justify-between gap-3 py-1'
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <Avatar
                    img={user?.profilePicture}
                    rounded
                    size='sm'
                    placeholderInitials={user?.username?.[0]?.toUpperCase()}
                  />
                  <div className='min-w-0'>
                    <p className='text-sm font-medium text-gray-800 dark:text-white truncate'>
                      {user?.username}
                      {isSelf && (
                        <span className='text-xs text-gray-400 ml-1'>
                          (you)
                        </span>
                      )}
                    </p>
                    <p className='text-xs text-gray-500 truncate'>
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2 flex-shrink-0'>
                  {isOwner ? (
                    <>
                      <Select
                        value={collab.role}
                        onChange={(e) => handleRoleChange(uid, e.target.value)}
                        disabled={updatingId === uid}
                        sizing='sm'
                        className='w-28'
                      >
                        <option value='viewer'>Viewer</option>
                        <option value='editor'>Editor</option>
                      </Select>

                      <button
                        onClick={() => handleRemove(uid)}
                        disabled={removingId === uid}
                        className='p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40'
                        title='Remove collaborator'
                      >
                        {removingId === uid ? (
                          <Spinner size='xs' />
                        ) : (
                          <HiTrash className='text-base' />
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <Badge
                        color={roleBadgeColor[collab.role]}
                        className='capitalize'
                      >
                        {collab.role}
                      </Badge>
                      {isSelf && (
                        <button
                          onClick={() => handleRemove(uid)}
                          disabled={removingId === uid}
                          className='p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40'
                          title='Leave document'
                        >
                          {removingId === uid ? (
                            <Spinner size='xs' />
                          ) : (
                            <HiTrash className='text-base' />
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color='gray' onClick={onClose}>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
}
