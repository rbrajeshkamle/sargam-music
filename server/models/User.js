import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: "",
    },

    likedSongs: [
      {
        videoId: String,
        title: String,
        artist: String,
        thumbnail: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    recentlyPlayed: [
      {
        videoId: String,
        title: String,
        artist: String,
        thumbnail: String,
        playedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;