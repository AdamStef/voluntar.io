INSERT INTO roles (role) VALUES ('ROLE_ADMIN'), ('ROLE_VOLUNTEER'), ('ROLE_ORGANIZATION');

INSERT INTO users (password, email) VALUES ('$2a$10$MRA7h85e/qeqFQ6b2BI8b.Xn2IUyxylW6wLLWb9kwzil.yiDyMUHK', 'admin@test.com');
INSERT INTO users (password, email) VALUES ('$2a$10$MRA7h85e/qeqFQ6b2BI8b.Xn2IUyxylW6wLLWb9kwzil.yiDyMUHK', 'volunteer@test.com');
INSERT INTO users (password, email) VALUES ('$2a$10$MRA7h85e/qeqFQ6b2BI8b.Xn2IUyxylW6wLLWb9kwzil.yiDyMUHK', 'organization@test.com');

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2);
INSERT INTO user_roles (user_id, role_id) VALUES (3, 3);