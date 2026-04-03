export const DEFAULT_AVATAR_URL =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

export function avatarUrl(profilePicture) {
  if (profilePicture && String(profilePicture).trim() !== '') {
    return profilePicture;
  }
  return DEFAULT_AVATAR_URL;
}
