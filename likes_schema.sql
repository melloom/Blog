-- Likes table schema for SQLite
-- Run this directly in your database

CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER,
    user_ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_ip ON likes(user_ip);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at);

-- Create a unique constraint to prevent duplicate likes
-- This prevents the same user (by user_id or user_ip) from liking the same post multiple times
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_unique_user_post ON likes(post_id, COALESCE(user_id, user_ip)); 