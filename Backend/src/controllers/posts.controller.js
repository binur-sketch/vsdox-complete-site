import {
  createPost as createPostService,
  deletePost as deletePostService,
  getAllPosts as getAllPostsService,
  getPostBySlug as getPostBySlugService,
  getPostPreview as getPostPreviewService,
  getPublishedPosts as getPublishedPostsService,
  getRevisions as getRevisionsService,
  publishPost as publishPostService,
  updatePost as updatePostService,
  withdrawPost as withdrawPostService,
} from '../services/posts.service.js';

const handleError = (res, err) => {
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Request failed' });
};

export const getPublishedPosts = async (req, res) => {
  try {
    const data = await getPublishedPostsService(req.query);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const post = await getPostBySlugService(req.params.slug);
    res.json(post);
  } catch (err) {
    handleError(res, err);
  }
};

export const getPostPreview = async (req, res) => {
  try {
    const preview = await getPostPreviewService(req.params.id);
    res.json(preview);
  } catch (err) {
    handleError(res, err);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await getAllPostsService(req.query);
    res.json(posts);
  } catch (err) {
    handleError(res, err);
  }
};

export const createPost = async (req, res) => {
  try {
    const post = await createPostService(req.body, req.user.id);
    res.status(201).json({
      message: 'Post created',
      post,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await updatePostService(req.params.id, req.body, req.user.id);
    res.json({
      message: 'Post updated',
      post,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const publishPost = async (req, res) => {
  try {
    const post = await publishPostService(req.params.id);
    res.json({ message: 'Post published', post });
  } catch (err) {
    handleError(res, err);
  }
};

export const withdrawPost = async (req, res) => {
  try {
    const post = await withdrawPostService(req.params.id);
    res.json({ message: 'Post withdrawn to draft', post });
  } catch (err) {
    handleError(res, err);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await deletePostService(req.params.id);
    res.json({ message: `"${post.title}" has been deleted`, id: post.id });
  } catch (err) {
    handleError(res, err);
  }
};

export const getRevisions = async (req, res) => {
  try {
    const revisions = await getRevisionsService(req.params.id);
    res.json(revisions);
  } catch (err) {
    handleError(res, err);
  }
};

