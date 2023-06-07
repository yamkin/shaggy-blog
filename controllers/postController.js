const PostModel = require('../models/post.js');

const createPost = async (req, res) => {
  const { title, text, tags, imageURL } = req.body;
  const user = req.userId;

  try {
    const post = new PostModel({
      title,
      text,
      tags,
      imageURL,
      user
    });

    await post.save();

    res.json(post);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать статью'
    })
  }

}

const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewCount: 1 },
      },
      {
        returnDocument: 'after',
      }
    ).populate('user');
    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

const removePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete(
      {
        _id: postId,
      },
    );
    
    res.json({
      success: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
}

const updatePost = async (req, res) => {
  const { title, text, tags, imageURL } = req.body;
  const user = req.userId;
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title,
        text,
        tags,
        imageURL,
        user
      }
    );
    
    res.json({
      success: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  removePost,
  updatePost
}