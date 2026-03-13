const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors()); 
app.use(express.json());

// 1. CẤU HÌNH KẾT NỐI MYSQL TỪ SMARTERASP
const dbConfig = {
    host: 'mysql8002.site4now.net', // Server từ ảnh
    user: 'ac6a21_thienba',         // Login ID từ ảnh
    password: '22042004B@o',  
    database: 'db_ac6a21_thienba' 
};

// Khởi tạo Pool kết nối (giúp chịu tải nhiều người thi cùng lúc)
const pool = mysql.createPool(dbConfig);

// 2. API Lấy danh sách bảng xếp hạng (GET)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Leaderboard ORDER BY Score DESC, TimeTaken ASC');
        res.json(rows);
    } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        res.status(500).send("Lỗi kết nối CSDL");
    }
});

// 3. API Lưu kết quả thi mới (POST)
app.post('/api/leaderboard', async (req, res) => {
    try {
        const { FullName, Phone, Area, Score, TimeTaken } = req.body;
        
        const query = `INSERT INTO Leaderboard (FullName, Phone, Area, Score, TimeTaken) VALUES (?, ?, ?, ?, ?)`;
        const values = [FullName, Phone, Area, Score, TimeTaken];
        
        await pool.query(query, values);
        
        res.status(201).json({ message: "Lưu kết quả thành công!" });
    } catch (err) {
        console.error("Lỗi lưu dữ liệu:", err);
        res.status(500).send("Lỗi lưu dữ liệu");
    }
});

// Bật server
app.listen(3000, () => {
    console.log('Backend đang chạy tại: http://localhost:3000');
});