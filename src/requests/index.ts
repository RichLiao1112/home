import { ICard, IHead } from '@/services/home';

export const apiUpsertCard = (payload: ICard) => {
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

export const apiUpdateHead = (payload: IHead) => {
  return fetch('/api/head', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiUpdateHead]', err));
};

export const apiUploadImg = (payload: { file: File }) => {
  return fetch('/api/media', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: payload.file,
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiUpdateHead]', err));
};
