import db from '../config/db.js';

// Upload Document
export const uploadDocument = (req, res) => {
  const { file } = req;
  const { fileNo, fileVersion, status = 'Pending', category, filename } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${encodeURIComponent(file.originalname)}`;
  const queryDoc = 'INSERT INTO documents (fileNo, filename, fileVersion, category, status, fileUrl, department, designation, shift) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(queryDoc, [fileNo, filename, fileVersion, category, status, fileUrl, req.user.department, req.user.designation, req.user.shift], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'File uploaded successfully', fileUrl });
  });
};

// Get All Documents (Admin)
export const getAllDocuments = (req, res) => {
  const query = 'SELECT * FROM documents';

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get Documents by Department (Supervisor, Worker)
export const getDocumentsByDepartment = (req, res) => {
  const query = 'SELECT * FROM documents WHERE department = ?';

  db.query(query, [req.user.department], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Delete Document by ID (Admin, Supervisor)
export const deleteDocument = (req, res) => {
  const query = 'DELETE FROM documents WHERE id = ? AND department = ?';

  db.query(query, [req.params.id, req.user.department], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: 'Document deleted successfully' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  });
};

// Update Document by ID (Admin, Supervisor)
export const updateDocument = (req, res) => {
  const { filename, fileVersion, category, status, fileNo } = req.body;
  const query = 'UPDATE documents SET filename = ?, fileVersion = ?, category = ?, status = ?, fileNo = ? WHERE id = ? AND department = ?';

  db.query(query, [filename, fileVersion, category, status, fileNo, req.params.id, req.user.department], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows > 0) {
      res.json({ message: 'Document updated successfully' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  });
};
