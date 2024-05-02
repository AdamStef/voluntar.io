-- Admin User
INSERT INTO users (email, password, role_id, first_name, last_name, phone_number, gender, is_verified, is_deleted, is_banned, created_at, updated_at)
VALUES 
  ('admin@example.com', 'adminpassword', (SELECT id FROM roles WHERE role = 'ROLE_ADMIN'), 'Admin', 'User', '+9999999999', 'MALE', TRUE, FALSE, FALSE, NOW(), NOW());

-- Organization Users
INSERT INTO users (email, password, role_id, first_name, last_name, phone_number, gender, is_verified, is_deleted, is_banned, created_at, updated_at)
VALUES 
  ('org1@example.com', 'orgpassword1', (SELECT id FROM roles WHERE role = 'ROLE_ORGANIZATION'), 'Organization', 'One', '+1111111111', 'FEMALE', TRUE, FALSE, FALSE, NOW(), NOW()),
  ('org2@example.com', 'orgpassword2', (SELECT id FROM roles WHERE role = 'ROLE_ORGANIZATION'), 'Organization', 'Two', '+2222222222', 'MALE', TRUE, FALSE, FALSE, NOW(), NOW());

-- Volunteer Users
INSERT INTO users (email, password, role_id, first_name, last_name, phone_number, gender, is_verified, is_deleted, is_banned, created_at, updated_at)
VALUES 
  ('volunteer1@example.com', 'volunteerpassword1', (SELECT id FROM roles WHERE role = 'ROLE_VOLUNTEER'), 'Volunteer', 'One', '+3333333333', 'FEMALE', TRUE, FALSE, FALSE, NOW(), NOW()),
  ('volunteer2@example.com', 'volunteerpassword2', (SELECT id FROM roles WHERE role = 'ROLE_VOLUNTEER'), 'Volunteer', 'Two', '+4444444444', 'MALE', TRUE, FALSE, FALSE, NOW(), NOW()),
  ('volunteer3@example.com', 'volunteerpassword3', (SELECT id FROM roles WHERE role = 'ROLE_VOLUNTEER'), 'Volunteer', 'Three', '+5555555555', 'FEMALE', TRUE, FALSE, FALSE, NOW(), NOW());


-- Locations
INSERT INTO locations (name, city, postal_code, street, number, flat_number, latitude, longitude, additional_information)
VALUES 
  ('Community Center', 'City', '12345', 'Main St', '1', NULL, '51.5074', '0.1278', 'Entrance from Main St'),
  ('Park', 'Town', '54321', 'Central Ave', '10', NULL, '40.7128', '-74.0060', 'Near the fountain');

-- Events
INSERT INTO events (name, description, organizer_id, number_of_volunteers_needed, start_date, end_date)
VALUES 
  ('Community Cleanup', 'Cleaning up the community park', (SELECT id FROM users WHERE email = 'org1@example.com'), 10, '2024-05-01 10:00:00', '2024-05-01 12:00:00'),
  ('Food Drive', 'Collecting food donations for the local shelter', (SELECT id FROM users WHERE email = 'org2@example.com'), 5, '2024-05-05 09:00:00', '2024-05-05 17:00:00'),
  ('Tree Planting Initiative', 'Planting trees to improve the environment', (SELECT id FROM users WHERE email = 'org1@example.com'), 15, '2024-05-10 08:00:00', '2024-05-10 12:00:00'),
  ('Beach Cleanup', 'Cleaning up litter from the local beach', (SELECT id FROM users WHERE email = 'org2@example.com'), 8, '2024-05-15 11:00:00', '2024-05-15 14:00:00'),
  ('Community Garden Maintenance', 'Maintaining the community garden', (SELECT id FROM users WHERE email = 'org1@example.com'), 6, '2024-05-20 09:00:00', '2024-05-20 13:00:00'),
  ('Blood Donation Drive', 'Organizing a blood donation drive for the local hospital', (SELECT id FROM users WHERE email = 'org2@example.com'), 12, '2024-05-25 10:00:00', '2024-05-25 16:00:00'),
  ('Street Art Festival', 'Creating street art to beautify the city', (SELECT id FROM users WHERE email = 'org1@example.com'), 20, '2024-06-01 13:00:00', '2024-06-01 18:00:00'),
  ('Youth Sports Camp', 'Organizing sports activities for youth in the community', (SELECT id FROM users WHERE email = 'org2@example.com'), 25, '2024-06-05 09:30:00', '2024-06-05 15:30:00'),
  ('Senior Citizens Day Out', 'Planning a day of activities for senior citizens', (SELECT id FROM users WHERE email = 'org1@example.com'), 10, '2024-06-10 10:00:00', '2024-06-10 16:00:00'),
  ('Educational Workshop', 'Conducting a workshop on a relevant educational topic', (SELECT id FROM users WHERE email = 'org2@example.com'), 15, '2024-06-15 11:00:00', '2024-06-15 13:00:00'),
  ('Community Potluck', 'Organizing a potluck for community members to share dishes', (SELECT id FROM users WHERE email = 'org1@example.com'), 30, '2024-06-20 17:00:00', '2024-06-20 20:00:00'),
  ('Artisan Market', 'Hosting a market for local artisans to sell their creations', (SELECT id FROM users WHERE email = 'org2@example.com'), 18, '2024-06-25 10:00:00', '2024-06-25 14:00:00'),
  ('Pet Adoption Event', 'Facilitating pet adoptions from local shelters', (SELECT id FROM users WHERE email = 'org1@example.com'), 7, '2024-06-30 12:00:00', '2024-06-30 15:00:00'),
  ('Health and Wellness Fair', 'Providing resources and information on health and wellness', (SELECT id FROM users WHERE email = 'org2@example.com'), 20, '2024-07-05 09:00:00', '2024-07-05 16:00:00'),
  ('Environmental Seminar', 'Hosting a seminar on environmental conservation', (SELECT id FROM users WHERE email = 'org1@example.com'), 15, '2024-07-10 14:00:00', '2024-07-10 17:00:00'),
  ('Cultural Diversity Festival', 'Celebrating the cultural diversity of the community', (SELECT id FROM users WHERE email = 'org2@example.com'), 25, '2024-07-15 11:00:00', '2024-07-15 19:00:00'),
  ('Book Exchange', 'Organizing a book exchange for avid readers', (SELECT id FROM users WHERE email = 'org1@example.com'), 10, '2024-07-20 10:00:00', '2024-07-20 12:00:00'),
  ('Community Movie Night', 'Hosting a movie night for community members', (SELECT id FROM users WHERE email = 'org2@example.com'), 30, '2024-07-25 19:00:00', '2024-07-25 22:00:00'),
  ('Tech Skills Workshop', 'Providing workshops to enhance tech skills', (SELECT id FROM users WHERE email = 'org1@example.com'), 15, '2024-07-30 13:00:00', '2024-07-30 16:00:00'),
  ('Holiday Toy Drive', 'Collecting toys for underprivileged children during the holidays', (SELECT id FROM users WHERE email = 'org2@example.com'), 20, '2024-08-05 10:00:00', '2024-08-05 15:00:00'),
  ('Community Yoga Session', 'Hosting a yoga session for community members', (SELECT id FROM users WHERE email = 'org1@example.com'), 25, '2024-08-10 08:30:00', '2024-08-10 10:30:00');
