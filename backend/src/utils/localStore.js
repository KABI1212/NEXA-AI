import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defaultCourses } from "./courseCatalog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "../../data");
const dataFile = path.join(dataDir, "local-db.json");

function createId() {
  return randomUUID();
}

function now() {
  return new Date().toISOString();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createCourseModule(title, duration, assignment = "", videoUrl = "", notesUrl = "") {
  return { _id: createId(), title, duration, assignment, videoUrl, notesUrl };
}

function buildDefaultCourses() {
  return defaultCourses.map((course) => ({
    ...course,
    _id: createId(),
    modules: course.modules.map((module) => createCourseModule(module.title, module.duration, module.assignment, module.videoUrl, module.notesUrl)),
    published: true,
    createdAt: now(),
    updatedAt: now()
  }));
}

async function defaultStore() {
  const password = await bcrypt.hash(process.env.LOCAL_ADMIN_PASSWORD || "Admin@12345", 12);
  return {
    users: [
      {
        _id: createId(),
        name: "Nexa Admin",
        email: "admin@nexa.ai",
        phone: "9999999999",
        password,
        role: "admin",
        verified: true,
        active: true,
        aiUses: 0,
        onboarding: null,
        createdAt: now(),
        updatedAt: now()
      }
    ],
    courses: buildDefaultCourses(),
    progress: [],
    certificates: [],
    reports: [],
    tickets: []
  };
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    const store = await defaultStore();
    await fs.writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw);
}

async function writeStore(store) {
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}

let writeQueue = Promise.resolve();

async function updateStore(mutator) {
  const run = async () => {
    const store = await readStore();
    const result = await mutator(store);
    await writeStore(store);
    return result;
  };
  writeQueue = writeQueue.then(run, run);
  return writeQueue;
}

function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

function withTimestamps(record, existing) {
  const timestamp = now();
  return {
    ...record,
    createdAt: existing?.createdAt || record.createdAt || timestamp,
    updatedAt: timestamp
  };
}

export async function findUserByEmail(email) {
  const store = await readStore();
  const user = store.users.find((item) => item.email === email);
  return user ? clone(user) : null;
}

export async function findUserById(id) {
  const store = await readStore();
  const user = store.users.find((item) => item._id === id);
  return user ? clone(user) : null;
}

export async function saveUser(user) {
  return updateStore((store) => {
    const index = store.users.findIndex((item) => item._id === user._id);
    const existing = index >= 0 ? store.users[index] : null;
    const nextUser = withTimestamps(
      {
        active: true,
        aiUses: 0,
        onboarding: null,
        ...existing,
        ...user,
        _id: user._id || createId()
      },
      existing
    );
    if (index >= 0) store.users[index] = nextUser;
    else store.users.push(nextUser);
    return clone(nextUser);
  });
}

export async function listUsers() {
  const store = await readStore();
  return sortByCreatedAtDesc(store.users).map(clone);
}

export async function countUsers() {
  const store = await readStore();
  return store.users.length;
}

export async function listCourses(category) {
  const store = await readStore();
  const courses = store.courses.filter((course) => course.published !== false && (!category || course.category === category));
  return sortByCreatedAtDesc(courses).map(clone);
}

export async function findCourseBySlug(slug) {
  const store = await readStore();
  const course = store.courses.find((item) => item.slug === slug && item.published !== false);
  return course ? clone(course) : null;
}

export async function findCourseById(id) {
  const store = await readStore();
  const course = store.courses.find((item) => item._id === id);
  return course ? clone(course) : null;
}

export async function saveCourse(course) {
  return updateStore((store) => {
    const index = store.courses.findIndex((item) => item._id === course._id);
    const existing = index >= 0 ? store.courses[index] : null;
    const modules = (course.modules || existing?.modules || []).map((module) => ({
      _id: module._id || createId(),
      title: module.title || "",
      videoUrl: module.videoUrl || "",
      duration: module.duration || "",
      notesUrl: module.notesUrl || "",
      assignment: module.assignment || ""
    }));
    const nextCourse = withTimestamps(
      {
        price: 0,
        premium: false,
        published: true,
        modules: [],
        quiz: [],
        finalTest: [],
        ...existing,
        ...course,
        modules,
        _id: course._id || createId()
      },
      existing
    );
    if (index >= 0) store.courses[index] = nextCourse;
    else store.courses.push(nextCourse);
    return clone(nextCourse);
  });
}

export async function replaceCourses(courses) {
  return updateStore((store) => {
    store.courses = courses.map((course) =>
      withTimestamps(
        {
          price: 0,
          premium: false,
          published: true,
          ...course,
          _id: course._id || createId(),
          modules: (course.modules || []).map((module) => ({
            _id: module._id || createId(),
            title: module.title || "",
            videoUrl: module.videoUrl || "",
            duration: module.duration || "",
            notesUrl: module.notesUrl || "",
            assignment: module.assignment || ""
          }))
        },
        null
      )
    );
    store.progress = [];
    store.certificates = [];
    return clone(store.courses);
  });
}

export async function countPublishedCourses() {
  const store = await readStore();
  return store.courses.filter((course) => course.published !== false).length;
}

export async function findProgress(userId, courseId) {
  const store = await readStore();
  const progress = store.progress.find((item) => item.userId === userId && item.courseId === courseId);
  return progress ? clone(progress) : null;
}

export async function listProgressByUser(userId) {
  const store = await readStore();
  return sortByCreatedAtDesc(store.progress.filter((item) => item.userId === userId)).map(clone);
}

export async function saveProgress(progress) {
  return updateStore((store) => {
    const index = store.progress.findIndex((item) => item.userId === progress.userId && item.courseId === progress.courseId);
    const existing = index >= 0 ? store.progress[index] : null;
    const nextProgress = withTimestamps(
      {
        watchedModules: [],
        assignmentsDone: false,
        quizPassed: false,
        finalPassed: false,
        quizScore: 0,
        finalScore: 0,
        percentage: 0,
        completed: false,
        ...existing,
        ...progress,
        _id: progress._id || existing?._id || createId()
      },
      existing
    );
    if (index >= 0) store.progress[index] = nextProgress;
    else store.progress.push(nextProgress);
    return clone(nextProgress);
  });
}

export async function listCertificatesByUser(userId) {
  const store = await readStore();
  return sortByCreatedAtDesc(store.certificates.filter((item) => item.userId === userId)).map(clone);
}

export async function listCertificates() {
  const store = await readStore();
  return sortByCreatedAtDesc(store.certificates).map(clone);
}

export async function findCertificateByUserAndCourse(userId, courseId) {
  const store = await readStore();
  const certificate = store.certificates.find((item) => item.userId === userId && item.courseId === courseId);
  return certificate ? clone(certificate) : null;
}

export async function findCertificateById(id) {
  const store = await readStore();
  const certificate = store.certificates.find((item) => item._id === id);
  return certificate ? clone(certificate) : null;
}

export async function findCertificateByCode(certificateId) {
  const store = await readStore();
  const certificate = store.certificates.find((item) => item.certificateId === certificateId);
  return certificate ? clone(certificate) : null;
}

export async function saveCertificate(certificate) {
  return updateStore((store) => {
    const index = store.certificates.findIndex((item) => item._id === certificate._id || item.certificateId === certificate.certificateId);
    const existing = index >= 0 ? store.certificates[index] : null;
    const nextCertificate = withTimestamps(
      {
        verified: true,
        ceoName: "Kabilesh",
        issueDate: new Date().toISOString(),
        completionDate: new Date().toISOString(),
        ...existing,
        ...certificate,
        _id: certificate._id || existing?._id || createId()
      },
      existing
    );
    if (index >= 0) store.certificates[index] = nextCertificate;
    else store.certificates.push(nextCertificate);
    return clone(nextCertificate);
  });
}

export async function countCertificates() {
  const store = await readStore();
  return store.certificates.length;
}

export async function listReportsByUser(userId) {
  const store = await readStore();
  return sortByCreatedAtDesc(store.reports.filter((item) => item.userId === userId)).map(clone);
}

export async function saveReport(report) {
  return updateStore((store) => {
    const nextReport = withTimestamps(
      {
        _id: report._id || createId(),
        ...report
      },
      null
    );
    store.reports.push(nextReport);
    return clone(nextReport);
  });
}

export async function countReports() {
  const store = await readStore();
  return store.reports.length;
}

export async function listTickets() {
  const store = await readStore();
  return sortByCreatedAtDesc(store.tickets).map(clone);
}

export async function saveTicket(ticket) {
  return updateStore((store) => {
    const nextTicket = withTimestamps(
      {
        status: "open",
        _id: ticket._id || createId(),
        ...ticket
      },
      null
    );
    store.tickets.push(nextTicket);
    return clone(nextTicket);
  });
}

export async function countOpenTickets() {
  const store = await readStore();
  return store.tickets.filter((item) => item.status !== "closed").length;
}
