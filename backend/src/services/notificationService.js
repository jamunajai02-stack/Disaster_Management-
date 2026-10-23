const Notification = require('../models/Notification');

async function createNotification({ userId, title, message, type = 'SYSTEM' }) {
  return Notification.create({ userId, title, message, type });
}

async function notifyUsers(userIds, payload) {
  if (!userIds.length) return [];
  const docs = userIds.map((userId) => ({ userId, ...payload }));
  return Notification.insertMany(docs);
}

module.exports = { createNotification, notifyUsers };
