# MongoDB Troubleshooting

## Error: `bad auth` / `authentication failed`

Your network can reach Atlas, but the **username or password in `backend/.env` is wrong**.

**Fix:**
1. MongoDB Atlas → **Database Access**
2. Edit user `pavani_k` → **Edit Password** → set a new password
3. Atlas → **Connect** → **Drivers** → copy the **full connection string**
4. Paste into `backend/.env` as `MONGODB_URI=...`
5. Run: `npm run test:mongo`

## Error: IP whitelist / could not connect

**Fix:** Network Access → add your IP or `0.0.0.0/0` (demo day only)

## Error: college WiFi blocks port 27017

Try **mobile hotspot**, or use embedded mode (below).

---

## Review fallback — no Atlas needed

If Atlas still fails before your review:

```powershell
cd backend
npm install
npm run seed:embedded
npm run dev:embedded
```

This uses an **in-memory MongoDB** on your PC. Re-run `seed:embedded` each time you restart the backend.

Then login: `admin@demo.sdrp` / `Demo@123`

---

## Local MongoDB Community (optional)

Install [MongoDB Community Server](https://www.mongodb.com/try/download/community), then:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/sdrp
```

Run `mongod`, then `npm run seed` and `npm run dev`.
