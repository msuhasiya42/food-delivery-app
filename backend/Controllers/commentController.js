// Add a comment to a task
const Comment = require("../Models/comment");
const Task = require("../Models/task");

const addComment = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { content, authorId } = req.body;

        // Create a new comment
        const newComment = new Comment({ content, author: authorId });
        await newComment.save();

        // Populate the necessary fields for the author
        const populatedComment = await newComment.populate({
            path: 'author',
            select: 'name email picture'
        });

        // Find the task and add the new comment to it
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.comments.push(newComment._id);
        await task.save();

        // Send the response with the populated comment
        res.status(201).json({ message: 'Comment added successfully', comment: populatedComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment', error: error.message || error });
    }
};

const getComments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId).populate({
            path: 'comments',
            populate: [
                { path: 'author', select: 'name email picture' },
                {
                    path: 'replies',
                    populate: { path: 'author', select: 'name email picture' }
                },
                { path: 'reactions.user', select: 'name email picture' }
            ],
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments', error: error.message || error });
    }
};
  
  // Add a reply to a comment
  const addReply = async (req, res) => {
    try {
      const commentId = req.params.commentId
      const { content, authorId } = req.body;
      const newReply = new Comment({ content, author: authorId });
      const populatedReply = await newReply.populate({
        path: 'author',
        select: 'name email picture'
    });
      await newReply.save();
  
      const comment = await Comment.findById(commentId);
      comment.replies.push(newReply._id);
      await comment.save();
  
      res.status(201).json({ message: 'Reply added successfully', reply: populatedReply });
    } catch (error) {
      res.status(500).json({ message: 'Error adding reply', error });
    }
  };
  
  // Add a reaction to a comment
  const addReaction = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const { emoji, authorId } = req.body;
      const comment = await Comment.findById(commentId);
  
      const existingReaction = comment.reactions.find(
        (reaction) => reaction.user.toString() === authorId && reaction.emoji === emoji
      );
  
      if (existingReaction) {
        // Remove existing reaction
        comment.reactions = comment.reactions.filter(
          (reaction) => !(reaction.user.toString() === authorId && reaction.emoji === emoji)
        );
      } else {
        // Add new reaction
        comment.reactions.push({ emoji, user: authorId });
      }
  
      await comment.save();
      res.status(200).json({ message: 'Reaction updated successfully', comment });
    } catch (error) {
      res.status(500).json({ message: 'Error adding reaction', error });
    }
  };
  
  const deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      // Delete the comment
      await Comment.findByIdAndDelete(commentId);
      // Remove the comment from the task's comments array
      await Task.updateOne({}, { $pull: { comments: commentId } });
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment", error });
    }
  };
  
  const deleteReply = async (req, res) => {
    try {
      const { replyId } = req.params;
      // Delete the reply
      await Comment.findByIdAndDelete(replyId);
      res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting reply", error });
    }
  };
  
  const deleteReaction = async (req, res) => {
    try {
      const { reactionId } = req.params;
      // Delete the reaction
      await Comment.updateOne({}, { $pull: { reactions: { _id: reactionId } } });
      res.status(200).json({ message: "Reaction deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting reaction", error });
    }
  };

  module.exports = {
    getComments,
    addComment,
    addReply,
    addReaction,
    deleteComment,
    deleteReaction,
    deleteReply,
  };