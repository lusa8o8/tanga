import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const getListAdminBooksQueryKey = (params?: any) => ['adminBooks', params];
export const useListAdminBooks = (params?: any, options?: any) => {
  return useQuery<any[]>({
    queryKey: getListAdminBooksQueryKey(params),
    queryFn: async () => {
      const qs = params ? '?' + new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
      ).toString() : '';
      const res = await fetch(`/api/admin/books${qs}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    ...options?.query
  });
};

export const useCreateBook = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create book');
      return res.json();
    }
  });
};

export const useUpdateBook = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await fetch(`/api/admin/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update book');
      return res.json();
    }
  });
};

export const useDeleteBook = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/admin/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete book');
      return res.json();
    }
  });
};

export const getListAdminAuthorsQueryKey = (params?: any) => ['adminAuthors', params];
export const useListAdminAuthors = (params?: any, options?: any) => {
  return useQuery<any[]>({
    queryKey: getListAdminAuthorsQueryKey(params),
    queryFn: async () => {
      const qs = params ? '?' + new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
      ).toString() : '';
      const res = await fetch(`/api/admin/authors${qs}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    ...options?.query
  });
};

export const useCreateAuthor = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create author');
      return res.json();
    }
  });
};

export const useUpdateAuthor = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await fetch(`/api/admin/authors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update author');
      return res.json();
    }
  });
};

export const useDeleteAuthor = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/admin/authors/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete author');
      return res.json();
    }
  });
};

export const useGetAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });
};

export const useGetBook = (slug: string, options?: any) => {
  return useQuery({
    queryKey: ['book', slug],
    queryFn: async () => {
      const res = await fetch(`/api/books/${slug}`);
      if (!res.ok) return null;
      return res.json();
    },
    ...options?.query
  });
};

export const useGetAuthor = (slug: string, options?: any) => {
  return useQuery({
    queryKey: ['author', slug],
    queryFn: async () => {
      const res = await fetch(`/api/authors/${slug}`);
      if (!res.ok) return null;
      return res.json();
    },
    ...options?.query
  });
};

export const getListAdminLanguagesQueryKey = (params?: any) => ['adminLanguages', params];
export const useListAdminLanguages = (params?: any, options?: any) => {
  return useQuery<any[]>({
    queryKey: getListAdminLanguagesQueryKey(params),
    queryFn: async () => {
      const res = await fetch('/api/admin/languages');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    ...options?.query
  });
};

export const useCreateLanguage = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create language');
      return res.json();
    }
  });
};

export const useDeleteLanguage = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/admin/languages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete language');
      return res.json();
    }
  });
};

export const getListAdminCategoriesQueryKey = (params?: any) => ['adminCategories', params];
export const useListAdminCategories = (params?: any, options?: any) => {
  return useQuery<any[]>({
    queryKey: getListAdminCategoriesQueryKey(params),
    queryFn: async () => {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    ...options?.query
  });
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create category');
      return res.json();
    }
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      return res.json();
    }
  });
};

export const getListAdminInquiriesQueryKey = (params?: any) => ['adminInquiries', params];
export const useListAdminInquiries = (params?: any, options?: any) => {
  return useQuery<any[]>({
    queryKey: getListAdminInquiriesQueryKey(params),
    queryFn: async () => {
      const res = await fetch('/api/admin/inquiries');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    ...options?.query
  });
};

export const useUpdateInquiry = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update inquiry');
      return res.json();
    }
  });
};

export const useDeleteInquiry = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete inquiry');
      return res.json();
    }
  });
};

