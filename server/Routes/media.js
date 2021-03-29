const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/project/:path', function(req, res) {
    const _path = `/ProjectImages/${req.params.path}`;
    let imagePath = path.normalize(__dirname + `/../../public${_path}`);
    try {
        if (fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(404);
    }
});

router.get('/user/:path', function(req, res) {
    const _path = `/UserImages/${req.params.path}`;
    let imagePath = path.normalize(__dirname + `/../../public${_path}`);
    try {
        if (fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(404);
    }
});

router.get('/images/:path', function(req, res) {
    const _path = `/images/${req.params.path}`;
    let imagePath = path.normalize(__dirname + `/../../public${_path}`);
    try {
        if (fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(404);
    }
});

router.get('/files/:path', function(req, res) {
    const _path = `/files/${req.params.path}`;
    let filePath = path.normalize(__dirname + `/../../public/static${_path}`);
    try {
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(404);
    }
});

module.exports = router;
