import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Certificate from "../models/Certificate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isLocalMode } from "../utils/dataMode.js";
import {
  findCertificateByUserAndCourse,
  findCourseById,
  findCourseBySlug,
  findProgress,
  listCourses as listLocalCourses,
  saveCourse,
  saveProgress
} from "../utils/localStore.js";
import { createCertificateForProgress } from "./certificate.controller.js";

const makeCourseFree = (course) => ({ ...course, price: 0, premium: false });
const makeCoursePayloadFree = (payload) => ({ ...payload, price: 0, premium: false });
const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const clampScore = (value) => Math.max(0, Math.min(100, Number(value) || 0));
const normalizeProgressPatch = (body, course, existing = {}) => {
  const validModuleIds = new Set((course.modules || []).map((module) => module._id.toString()));
  const watchedModules = Array.isArray(body.watchedModules)
    ? [...new Set(body.watchedModules.map(String).filter((id) => validModuleIds.has(id)))]
    : existing.watchedModules || [];

  return {
    watchedModules,
    assignmentsDone: Boolean(body.assignmentsDone ?? existing.assignmentsDone),
    quizPassed: Boolean(body.quizPassed ?? existing.quizPassed),
    finalPassed: Boolean(body.finalPassed ?? existing.finalPassed),
    quizScore: clampScore(body.quizScore ?? existing.quizScore),
    finalScore: clampScore(body.finalScore ?? existing.finalScore)
  };
};

export const listCourses = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const courses = (await listLocalCourses(req.query.category)).map(makeCourseFree);
    return res.json({ courses });
  }

  const filter = { published: true };
  if (req.query.category) filter.category = req.query.category;
  const courses = (await Course.find(filter).sort({ createdAt: -1 }).lean()).map(makeCourseFree);
  res.json({ courses });
});

export const getCourse = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const course = await findCourseBySlug(req.params.slug);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    const progress = req.user ? await findProgress(req.user._id, course._id) : null;
    return res.json({ course: makeCourseFree(course), progress });
  }

  const course = await Course.findOne({ slug: req.params.slug }).lean();
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  const progress = req.user ? await Progress.findOne({ userId: req.user._id, courseId: course._id }) : null;
  res.json({ course: makeCourseFree(course), progress });
});

export const createCourse = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const course = await saveCourse(makeCoursePayloadFree({ ...req.body, slug: req.body.slug || slugify(req.body.title) }));
    return res.status(201).json({ course });
  }

  const course = await Course.create(makeCoursePayloadFree(req.body));
  res.status(201).json({ course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const existing = await findCourseById(req.params.id);
    if (!existing) {
      res.status(404);
      throw new Error("Course not found");
    }
    const course = await saveCourse(makeCoursePayloadFree({ ...existing, ...req.body, _id: req.params.id }));
    return res.json({ course });
  }

  const course = await Course.findByIdAndUpdate(req.params.id, makeCoursePayloadFree(req.body), { new: true });
  res.json({ course });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const existing = await findCourseById(req.params.id);
    if (!existing) {
      res.status(404);
      throw new Error("Course not found");
    }
    await saveCourse({ ...existing, published: false });
    return res.json({ message: "Course unpublished" });
  }

  await Course.findByIdAndUpdate(req.params.id, { published: false });
  res.json({ message: "Course unpublished" });
});

export const updateProgress = asyncHandler(async (req, res) => {
  if (isLocalMode()) {
    const course = await findCourseById(req.params.courseId);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    const existingProgress = await findProgress(req.user._id, course._id);
    const merged = {
      ...existingProgress,
      ...normalizeProgressPatch(req.body, course, existingProgress),
      userId: req.user._id,
      courseId: course._id
    };

    const watchedCount = merged.watchedModules?.length || 0;
    merged.percentage = Math.min(
      100,
      course.modules.length ? Math.round((watchedCount / course.modules.length) * 100) : 100
    );
    merged.completed =
      merged.percentage === 100 &&
      merged.assignmentsDone &&
      merged.quizPassed &&
      merged.finalPassed;
    const savedProgress = await saveProgress(merged);

    let certificate = await findCertificateByUserAndCourse(req.user._id, course._id);
    if (savedProgress.completed && !certificate) {
      certificate = await createCertificateForProgress(req.user, course, savedProgress);
    }
    return res.json({ progress: savedProgress, certificate });
  }

  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  let progress = await Progress.findOne({ userId: req.user._id, courseId: course._id });
  const patch = normalizeProgressPatch(req.body, course, progress || {});
  if (!progress) {
    progress = new Progress({ userId: req.user._id, courseId: course._id });
  }
  Object.assign(progress, patch);

  const watchedCount = progress.watchedModules?.length || 0;
  const watchedPercent = course.modules.length ? Math.round((watchedCount / course.modules.length) * 100) : 100;
  progress.percentage = Math.min(100, watchedPercent);
  progress.completed = progress.percentage === 100 && progress.assignmentsDone && progress.quizPassed && progress.finalPassed;
  await progress.save();

  let certificate = await Certificate.findOne({ userId: req.user._id, courseId: course._id });
  if (progress.completed && !certificate) certificate = await createCertificateForProgress(req.user, course, progress);

  res.json({ progress, certificate });
});
