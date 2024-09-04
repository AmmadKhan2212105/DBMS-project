import express from 'express';
const router = express.Router();
import { sql } from '../db.js';

// Route for Data Sheet Query
router.get('/datasheet', async (req, res) => {
    const { regno } = req.query;
    try {
        const dataSheet = await sql`
            SELECT m.*, m.marks AS marks, r.Semester, r.Year, r.Class, r.cid, c.title, c.theory, c.lab, g.grade, g.gpa
            FROM cmarks m 
            INNER JOIN recap r ON m.rid = r.rid
            INNER JOIN course c ON r.cid=c.cid 
            INNER JOIN grade g ON m.marks BETWEEN g.start AND g.end   
            WHERE m.regno =  ${regno} AND hid = 246
        `;
        res.status(200).json(dataSheet);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route for Semester GPA Query
router.get('/datasheet', async (req, res) => {
    const { regno, semester, year } = req.query;
    try {
        const dataSheet = await sql`
            SELECT m.*, r.Semester, r.Year, r.Class, r.cid, c.title, c.theory, c.lab, g.grade, g.gpa
            FROM cmarks m 
            INNER JOIN recap r ON m.rid = r.rid
            INNER JOIN course c ON c.cid = r.cid
            INNER JOIN grade g ON m.marks BETWEEN g.start AND g.end
            WHERE m.regno = ${regno} AND r.Semester = ${semester} AND r.Year = ${year} AND hid = 246
        `;
        res.status(200).json(dataSheet);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/semestergpa', async (req, res) => {
    const { regno, semester, year } = req.query;
    try {
        const semesterGpa = await sql`
            SELECT CAST(ROUND(SUM((c.theory + c.lab) * g.gpa) / SUM(theory + lab), 3) AS DECIMAL(9, 3)) AS "Semester GPA"
            FROM cmarks m 
            INNER JOIN recap r ON m.rid = r.rid
            INNER JOIN course c ON c.cid = r.cid
            INNER JOIN grade g ON m.marks BETWEEN g.start AND g.end
            WHERE m.regno = ${regno} AND r.Semester = ${semester} AND r.Year = ${year} AND hid = 246
            GROUP BY m.regno
        `;
        res.status(200).json(semesterGpa[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/cgpa', async (req, res) => {
    const { regno } = req.query;
    try {
        const cgpa = await sql`
            SELECT CAST(ROUND(SUM((c.theory + c.lab) * g.gpa) / SUM(theory + lab), 3) AS DECIMAL(9, 3)) AS "CGPA"
            FROM cmarks m 
            INNER JOIN recap r ON m.rid = r.rid
            INNER JOIN course c ON c.cid = r.cid
            INNER JOIN grade g ON marks BETWEEN g.start AND g.end
            WHERE g.start > 59 AND m.regno = ${regno} AND hid = 246
            GROUP BY m.regno
        `;
        res.status(200).json(cgpa[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


export default router;
