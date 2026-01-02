import multer from 'multer'

const storage = multer.memoryStorage()

export const uploadExcel = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true)
    } else {
      cb(null, false) // 👈 rechaza sin romper tipado
    }
  },
})
