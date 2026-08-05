CREATE TABLE IF NOT EXISTS blog_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    blog_id INT NOT NULL,

    comment TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_blog
        FOREIGN KEY (blog_id)
        REFERENCES blogs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);