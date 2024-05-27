import { ICard, ILayout } from '@/services/home';

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

export const apiDeleteCard = (id: ICard['id']) => {
  return fetch(`/api/card/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[apiUpsertCard]', err));
};

export const apiUpdateUI = (payload: ILayout) => {
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
