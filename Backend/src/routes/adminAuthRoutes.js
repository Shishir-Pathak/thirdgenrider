import express from "express";

const router = express.Router();


router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Admin route working"
    });
});


router.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return res.json({
            success: true,
            message: "Login successful",
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
    });
});


export default router;