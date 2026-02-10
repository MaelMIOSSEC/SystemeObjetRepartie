CREATE TABLE users (
    `user_id` TEXT PRIMARY KEY, 
    `name` TEXT NOT NULL,
    `last_name` TEXT NOT NULL,
    `password` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `role` TEXT NOT NULL
);

CREATE TABLE superpolls (
    `superpoll_id` TEXT PRIMARY KEY
);

CREATE TABLE polls (
    `poll_id` TEXT PRIMARY KEY,
    `title` TEXT NOT NULL,
    `description` TEXT NULL,
    `creation_date` TEXT NOT NULL,
    `expiration_date` TEXT NULL,
    `status` TEXT NOT NULL,
    `user_id` TEXT NULL,
    `superpoll_id` TEXT NOT NULL,
    CONSTRAINT fk_user_id 
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),
    CONSTRAINT fk_superpoll_id
        FOREIGN KEY (superpoll_id)
        REFERENCES superpolls(superpoll_id)
);

CREATE TABLE options (
    `option_id` TEXT PRIMARY KEY,
    `descriptive_text` TEXT NULL,
    `creation_date` TEXT NOT NULL,
    `vote_count` NUMBER NULL,
    `poll_id` TEXT NOT NULL,
    CONSTRAINT fk_poll_id
        FOREIGN KEY (poll_id)
        REFERENCES polls(poll_id)
);

CREATE TABLE votes (
    `vote_id` TEXT PRIMARY KEY,
    `creation_date` TEXT NOT NULL,
    `user_id` TEXT, 
    `option_id` TEXT NOT NULL,
    `poll_id` TEXT NOT NULL,
    CONSTRAINT fk_user_id 
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),
    CONSTRAINT fk_option_id
        FOREIGN KEY (option_id)
        REFERENCES options(option_id),
    CONSTRAINT fk_poll_id 
        FOREIGN KEY (poll_id)
        REFERENCES polls(poll_id)
);
