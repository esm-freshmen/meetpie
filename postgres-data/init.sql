-- テーブル定義
DROP TABLE IF EXISTS user_info;
CREATE TABLE user_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS event;
CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    deadline DATE NOT NULL,
    detail TEXT,
    created_user_id INTEGER REFERENCES user_info(id)
);

DROP TABLE IF EXISTS candidate_time;
CREATE TABLE candidate_time (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    event_id INTEGER REFERENCES event(id)
);

DROP TABLE IF EXISTS attendance;
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL,
    candidate_time_id INTEGER REFERENCES candidate_time(id),
    user_id INTEGER REFERENCES user_info(id)
);

-- テストデータ
INSERT INTO user_info
    (name)
VALUES
    ('田中 太郎'),
    ('鈴木 花子'),
    ('佐藤 一郎'),
    ('高橋 美咲');

INSERT INTO event
    (title, deadline, detail, created_user_id)
VALUES
    ('イベントA', '2099-12-31', 'イベントA情報', 1),
    ('イベントB', '2099-01-01', 'イベントB情報', 2);

INSERT INTO candidate_time
    (start_time, event_id)
VALUES
    ('2024-09-01 13:00:00', 1),
    ('2024-09-01 14:00:00', 1),
    ('2024-09-01 15:00:00', 1),
    ('2024-09-02 13:00:00', 1),
    ('2024-09-02 14:00:00', 1),
    ('2024-09-02 15:00:00', 1),
    ('2024-10-01 13:00:00', 2),
    ('2024-10-01 14:00:00', 2),
    ('2024-10-01 15:00:00', 2),
    ('2024-10-02 13:00:00', 2),
    ('2024-10-02 14:00:00', 2),
    ('2024-10-02 15:00:00', 2);

INSERT INTO attendance
    (status, candidate_time_id, user_id)
VALUES
    ('ok', 1, 1),
    ('ok', 1, 2),
    ('ok', 1, 3),
    ('ng', 1, 4),
    ('ok', 2, 1),
    ('ng', 2, 2),
    ('pending', 2, 3);
