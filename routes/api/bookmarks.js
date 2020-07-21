const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Bookmark = require('../../models/Bookmark');

//@route    POST /api/bookmarks
//@desc     Add bookmark
router.post(
  '/',
  [
    check('title', 'Please enter valid Title').not().isEmpty(),
    check('publisher', 'Please enter valid Publisher').not().isEmpty(),
    check('url', 'Please enter valid URL').isURL(),
  ],
  async (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, publisher, url } = req.body;
      const bm = await Bookmark.findOne({ url });
      if (bm) {
        res.status(401).send('Bookmark for this url already exists');
      }
      const newBookmark = new Bookmark({
        title,
        publisher,
        url,
      });
      const bookmark = await newBookmark.save();
      res.json(bookmark);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    DELETE /api/bookmarks/:id
//@desc     Delete bookmark
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id });
    if (!bookmark) {
      return res.status(404).send('Bookmark not found');
    }
    await bookmark.remove();
    res.status(200).send('Bookmark Deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT /api/bookmarks/:id
//@desc     Update a bookmark
router.put('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id });
    if (!bookmark) {
      return res.status(404).send('Bookmark not found');
    }

    const { title, publisher, url } = req.body;
    const updatedBookmark = {};
    if (title) updatedBookmark.title = title;
    if (publisher) updatedBookmark.publisher = publisher;
    if (url) updatedBookmark.url = url;
    updatedBookmark.time_updated = new Date().getTime();
    const updated = await Bookmark.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updatedBookmark },
      { new: true }
    );
    res.json(updated);
    await updated.save();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
