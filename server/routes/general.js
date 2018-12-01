const express = require('express');
const router = express.Router();
const testRouter = express.Router();

testRouter.get('/', (req, res, next) => {
    return res.status(200).json({ status: "ok" });
});

router.use('/test', testRouter);

module.exports = router;
