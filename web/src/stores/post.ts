import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as postService from '@/api/services/posts.ts';
import type { IPost, ICreatePost, IUpdatePost } from '@/types/post/PostTypes';

export const usePostStore = defineStore('post', () => {
  const posts = ref<IPost[]>([]);
  const loading = ref(false);

  async function loadPosts(brandId: number, state?: string) {
    loading.value = true;
    try {
      const { data: res } = await postService.getPosts(brandId, state);
      posts.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function addPost(data: ICreatePost) {
    const { data: res } = await postService.createPost(data);
    posts.value.unshift(res.data);
    return res.data as IPost;
  }

  async function editPost(id: number, data: IUpdatePost) {
    const { data: res } = await postService.updatePost(id, data);
    const idx = posts.value.findIndex(p => p.id === id);
    if (idx !== -1) posts.value[idx] = res.data;
    return res.data as IPost;
  }

  async function removePost(id: number) {
    await postService.deletePost(id);
    posts.value = posts.value.filter(p => p.id !== id);
  }

  return {
    posts,
    loading,
    loadPosts,
    addPost,
    editPost,
    removePost,
  };
});
