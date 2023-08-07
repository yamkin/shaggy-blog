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
    if(!req.params || !req.params.id) throw new Error("Invalid input");
    
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
      message: 'Произошла ошибка при получении статьи, попробуйте ещё раз',
      error: err.message,
    });
  }
};

const removePost = async (req, res) => {
  const postId = req.params.id;
  const user = req.userId;

  try {
    const post = await PostModel.findOne({ _id: postId});

    if(!post) {
      return res.status(401).json({
        message: 'Статья не найдена'
      });
    }

    if(post.user.toString() !== user.toString()) {
      return res.status(401).json({
        message: 'Вы не можете удалить статью'
      });
    }

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
  const postId = req.params.id;
  try {

    const post = await PostModel.findOne({ _id: postId});

    if(!post) {
      return res.status(401).json({
        message: 'Пост не найден'
      });
    }

    if(post.user.toString() !== user.toString()) {
      return res.status(401).json({
        message: 'Вы не можете изменить содержимое поста'
      });
    }

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

