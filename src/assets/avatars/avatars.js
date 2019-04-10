import { getReticulumFetchUrl } from "../../utils/phoenix-utils";

export const avatars = [
  {
    id: 'bot1',
    model: '/src/assets/avatars/AvH_V1.glb'
  },
  {
    id: 'bot2',
    model: '/src/assets/avatars/AvH_V1_Color2.glb'
  },
  {
    id: 'bot3',
    model: '/src/assets/avatars/AvM_V1.glb'
  },
  {
    id: 'bot4',
    model: '/src/assets/avatars/AvM_V1_Color2.glb'
  },
  {
    id: 'bot5',
    model: '/src/assets/avatars/AvM_V1_Color3.glb'
  },
  {
    id: 'bot6',
    model: '/src/assets/avatars/AvM_V2.glb'
  }
];

export const AVATAR_TYPES = {
  LEGACY: "legacy",
  SKINNABLE: "skinnable",
  URL: "url"
};

const legacyAvatarIds = avatars.map(a => a.id);
export function getAvatarType(avatarId) {
  if (!avatarId || legacyAvatarIds.indexOf(avatarId) !== -1) return AVATAR_TYPES.LEGACY;
  if (avatarId.startsWith("http")) return AVATAR_TYPES.URL;
  return AVATAR_TYPES.SKINNABLE;
}

export async function getAvatarSrc(avatarId) {
  switch (getAvatarType(avatarId)) {
    case AVATAR_TYPES.LEGACY:
      return `#${avatarId}`;
    case AVATAR_TYPES.SKINNABLE:
      return fetch(getReticulumFetchUrl(`/api/v1/avatars/${avatarId}`))
        .then(r => r.json())
        .then(({ avatars }) => avatars[0].gltf_url);
  }
  return avatarId;
}