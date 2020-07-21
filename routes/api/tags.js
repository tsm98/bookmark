const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Tag = require('../../models/Tag');
const Bookmark = require('../../models/Bookmark');

//@route    POST /api/tags
//@desc     Add bookmark
router.post('/', [check('title').not().isEmpty()], async (req, res) => {
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title } = req.body;
    const tg = await Tag.findOne({ title });
    if (tg) {
      res.status(401).send('Tag with this title already exists');
    }
    const newTag = new Tag({
      title,
    });
    const tag = await newTag.save();
    res.json(tag);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    DELETE /api/tags/:id
//@desc     Delete tag
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id });
    if (!tag) {
      return res.status(404).send('Tag not found');
    }
    const bookmarks = await Bookmark.find({ tags: tag._id });
    if (bookmarks) {
      bookmarks.map(async (bookmark) => {
        const removeIndex = bookmark.tags.indexOf(tag._id);
        bookmark.tags.splice(removeIndex, 1);
        await bookmark.save();
      });
    }
    // const a = await bookmarks.save();
    //res.json(a);
    await tag.remove();
    res.status(200).send('Tag Removed');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT /api/tags/:id
//@desc     Update tag
router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id });
    if (!tag) {
      return res.status(404).send('Tag not found');
    }

    const { title } = req.body;
    const updatedtag = {};
    if (title) updatedtag.title = title;
    updatedtag.time_updated = new Date().getTime();
    const updated = await Tag.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updatedtag },
      { new: true }
    );
    res.json(updated);
    await updated.save();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT /api/tags/:bmid/:tagid
//@desc     Add existing tag to bookmark
router.put('/:bmid/:tagid', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.bmid });
    if (!bookmark) {
      return res.status(404).send('Bookmark not found');
    }
    const tag = await Tag.findOne({ _id: req.params.tagid });
    if (!tag) {
      return res
        .status(400)
        .send(
          'Tag not found. Create the tag first inorder to add it to a Bookmark'
        );
    }
    if (bookmark.tags.includes(tag._id)) {
      return res.status(401).send('Tag is already added to this Bookmark');
    }
    bookmark.tags.unshift(tag);
    bookmark.save();
    res.json(bookmark);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT /api/tags/:bmid/:tagid/remove
//@desc     Delete tag relation to a specific bookmark
router.put('/:bmid/:tagid/remove', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.bmid });
    if (!bookmark) {
      return res.status(404).send('Bookmark not found');
    }
    const tag = await Tag.findOne({ _id: req.params.tagid });
    if (!tag) {
      return res
        .status(400)
        .send(
          'Tag not found. Create the tag first inorder to add it to a Bookmark'
        );
    }
    if (!bookmark.tags.includes(tag._id)) {
      return res.status(404).send('Tag not associated to this Bookmark');
    }
    const removeIndex = bookmark.tags.indexOf(tag._id);
    bookmark.tags.splice(removeIndex, 1);
    await bookmark.save();
    res.json(bookmark);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// router.get('/check/:id', async (req, res) => {
//   try {
//     const tag = await Tag.findOne({ _id: req.params.id });
//     if (!tag) {
//       return res.status(404).send('Tag not found');
//     }

//     res.json(bookmarks);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
//});

module.exports = router;
