const { register, login,  updateData, deleteData } = require('../Controller/userController');
const verifytoken = require('../middlewares/verifyToken');
const router = require('express').Router();



router.post("/register", register);
router.post("/login", login);
router.put("/update/:id", verifytoken, updateData);
router.delete("/delete/:id", verifytoken, deleteData);




module.exports = router