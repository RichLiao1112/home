import { ICard, ICategory, ILayout } from '@/services/home';
import { ISearchIcon } from '@/services/media';

export const apiUpsertCard = (
  payload: ICard & { key?: string; categoryId?: string }
) => {
  return fetch('/api/card', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiUpsertCard]', err));
};

export const apiDeleteCard = (payload: { id: ICard['id']; key?: string }) => {
  return fetch(`/api/card/${payload.id}?key=${payload.key}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiDeleteCard]', err));
};

export const apiUpdateUI = (payload: ILayout & { key?: string }) => {
  return fetch('/api/ui', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiUpdateHead]', err));
};

export const apiSearchIcon = (payload: ISearchIcon) => {
  return fetch(`/api/icon?q=${payload.q}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiSearchIcon]', err));
};

export const apiQueryPngSvgMedia = (payload: ISearchIcon) => {
  return fetch(`/api/media?q=${payload.q}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiQueryPngSvgMedia]', err));
};

export const apiQueryDBFiles = () => {
  return fetch(`/api/db`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiQueryDBFiles]', err));
};

export const apitUpsertDBFile = (payload: { key: string }) => {
  return fetch(`/api/db`, {
    method: 'PUT',
    body: JSON.stringify({ data: payload }),
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiQueryDBFiles]', err));
};

export const apiDeleteDBFile = (payload: { key: string }) => {
  return fetch(`/api/db`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiDeleteDBFile]', err));
};

// export const apiSelectDBFile = (payload: { key: string }) => {
//   return fetch(`/api/db`, {
//     method: 'POST',
//     headers: {
//       'Content-type': 'application/json',
//     },
//     body: JSON.stringify({ data: payload }),
//   })
//     .then((res) => res.json())
//     .catch((err) => console.warn('[apiSelectDBFile]', err));
// };

export const apiGetAllDBData = () => {
  return fetch(`/api/db/all`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiGetAllDBData]', err));
};

export const apiRefreshMediaDir = () => {
  return fetch(`/api/upload`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiRefreshMediaDir]', err));
};

export const apiMoveCard = (payload: {
  id: ICard['id'];
  key: string;
  index: number;
  categoryId?: string;
}) => {
  return fetch(
    `/api/card/${payload.id}?key=${payload.key}&index=${
      payload.index
    }&categoryId=${payload.categoryId || ''}`,
    {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.warn('[apiMoveCard]', err));
};

export const apiGetHHENV = () => {
  return fetch(`/api/env`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiGetHHENV]', err));
};

export const apiUpsertCategory = (payload: ICategory & { key?: string }) => {
  return fetch('/api/category', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiUpsertCategory]', err));
};

export const apiDeleteCategory = (payload: {
  id: ICategory['id'];
  key?: string;
}) => {
  return fetch(`/api/category/${payload.id}?key=${payload.key}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiDeleteCategory]', err));
};

export const apiUnsplashCollectionList = () => {
  return fetch(`/api/unsplash/collections`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiUnsplashCollectionList]', err));
};

export const apiUnsplashCollectionPhotos = (payload: {
  collectionId: string;
}) => {
  return fetch(`/api/unsplash/collections`, {
    method: 'POST',
    body: JSON.stringify({ data: payload }),
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiUnsplashCollectionPhotos]', err));
};
