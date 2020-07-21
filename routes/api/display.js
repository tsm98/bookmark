const express = require('express');
const router = express.Router();
const Bookmark = require('../../models/Bookmark');
const Tag = require('../../models/Tag');

//@route    GET api/display/bookmarks
//@desc     get all bookmarks
router.get('/bookmarks', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    if (!bookmarks) {
      return res.status(404).send('No Bookmarks added yet');
    }
    res.json(bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    GET api/display/tags
//@desc     get all tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.find();
    if (!tags) {
      return res.status(404).send('No Tags added yet');
    }
    res.json(tags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
