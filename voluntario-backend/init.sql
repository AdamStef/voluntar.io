-- Inserting data into locations table
INSERT INTO locations (latitude, longitude, additional_information, city, flat_number, name, number, postal_code, street)
VALUES
    (40.712776, -74.005974, 'Near Central Park', 'New York', '1A', 'Central Park West', '59', '10023', 'W 59th St'),
    (34.052235, -118.243683, 'Near Griffith Observatory', 'Los Angeles', '2B', 'Hollywood Blvd', '6801', '90028', 'Hollywood Blvd'),
    (41.878113, -87.629799, 'Near Millennium Park', 'Chicago', '3C', 'Michigan Ave', '201', '60601', 'N Michigan Ave'),
    (29.760427, -95.369804, 'Downtown', 'Houston', '4D', 'Main St', '150', '77002', 'Main St'),
    (33.448376, -112.074036, 'Near Civic Space Park', 'Phoenix', '5E', 'Central Ave', '424', '85004', 'N Central Ave');

-- Inserting data into roles table
-- INSERT INTO roles (role)
-- VALUES
--     ('ROLE_VOLUNTEER'),
--     ('ROLE_ORGANIZATION'),
--     ('ROLE_ADMIN');

-- Inserting data into users table
INSERT INTO users (is_banned, is_deleted, is_verified, created_at, role_id, updated_at, email, first_name, gender, last_name, password, phone_number)
VALUES
    (false, false, true, '2023-01-01 00:00:00', 1, '2023-01-01 00:00:00', 'volunteer1@example.com', 'John', 'MALE', 'Doe', 'password123', '123-456-7890'),
    (false, false, true, '2023-01-02 00:00:00', 2, '2023-01-02 00:00:00', 'org1@example.com', 'Jane', 'FEMALE', 'Smith', 'password123', '098-765-4321'),
    (false, false, true, '2023-01-03 00:00:00', 1, '2023-01-03 00:00:00', 'volunteer2@example.com', 'Alice', 'FEMALE', 'Johnson', 'password123', '234-567-8901'),
    (false, false, true, '2023-01-04 00:00:00', 2, '2023-01-04 00:00:00', 'org2@example.com', 'Bob', 'MALE', 'Brown', 'password123', '345-678-9012');

-- Inserting data into organization table
INSERT INTO organization (user_id, address, description, krs, name, website)
VALUES
    (2, '123 Hollywood Blvd, Los Angeles, CA', 'Non-profit organization', '123456789', 'Helping Hands', 'http://www.helpinghands.org'),
    (4, '150 Main St, Houston, TX', 'Community support organization', '987654321', 'Community Care', 'http://www.communitycare.org');

-- Inserting data into events table
INSERT INTO events (number_of_volunteers_needed, created_at, end_date, location_id, organization_id, start_date, updated_at, description, name)
VALUES
    (10, '2023-01-15 00:00:00', '2023-01-20 00:00:00', 1, 1, '2023-01-15 08:00:00', '2023-01-10 00:00:00', 'Park cleanup event', 'Central Park Cleanup'),
    (20, '2023-02-01 00:00:00', '2023-02-05 00:00:00', 2, 1, '2023-02-01 09:00:00', '2023-01-20 00:00:00', 'Community outreach', 'Hollywood Outreach'),
    (15, '2023-03-10 00:00:00', '2023-03-15 00:00:00', 3, 1, '2023-03-10 08:00:00', '2023-03-05 00:00:00', 'Food drive event', 'Chicago Food Drive'),
    (25, '2023-04-01 00:00:00', '2023-04-05 00:00:00', 4, 2, '2023-04-01 10:00:00', '2023-03-25 00:00:00', 'Homeless shelter support', 'Houston Homeless Help'),
    (30, '2023-05-10 00:00:00', '2023-05-15 00:00:00', 5, 2, '2023-05-10 08:00:00', '2023-05-01 00:00:00', 'Park renovation event', 'Phoenix Park Renovation'),
    (12, '2023-06-01 00:00:00', '2023-06-05 00:00:00', 1, 1, '2023-06-01 09:00:00', '2023-05-25 00:00:00', 'Summer camp', 'New York Summer Camp'),
    (18, '2023-07-01 00:00:00', '2023-07-05 00:00:00', 2, 1, '2023-07-01 09:00:00', '2023-06-25 00:00:00', 'Beach cleanup', 'Los Angeles Beach Cleanup'),
    (22, '2023-08-01 00:00:00', '2023-08-05 00:00:00', 3, 1, '2023-08-01 09:00:00', '2023-07-25 00:00:00', 'Back to school event', 'Chicago Back to School'),
    (16, '2023-09-01 00:00:00', '2023-09-05 00:00:00', 4, 2, '2023-09-01 10:00:00', '2023-08-25 00:00:00', 'Health fair', 'Houston Health Fair'),
    (14, '2023-10-01 00:00:00', '2023-10-05 00:00:00', 5, 2, '2023-10-01 09:00:00', '2023-09-25 00:00:00', 'Library renovation', 'Phoenix Library Renovation'),
    (12, '2023-11-01 00:00:00', '2023-11-05 00:00:00', 1, 1, '2023-11-01 09:00:00', '2023-10-25 00:00:00', 'Community garden', 'New York Community Garden'),
    (20, '2023-12-01 00:00:00', '2023-12-05 00:00:00', 2, 1, '2023-12-01 09:00:00', '2023-11-25 00:00:00', 'Toy drive', 'Los Angeles Toy Drive'),
    (10, '2024-01-01 00:00:00', '2024-01-05 00:00:00', 3, 1, '2024-01-01 09:00:00', '2023-12-25 00:00:00', 'Winter shelter support', 'Chicago Winter Shelter'),
    (15, '2024-02-01 00:00:00', '2024-02-05 00:00:00', 4, 2, '2024-02-01 10:00:00', '2024-01-25 00:00:00', 'Blood drive', 'Houston Blood Drive'),
    (20, '2024-03-01 00:00:00', '2024-03-05 00:00:00', 5, 2, '2024-03-01 08:00:00', '2024-02-25 00:00:00', 'Spring festival', 'Phoenix Spring Festival'),
    (18, '2024-04-01 00:00:00', '2024-04-05 00:00:00', 1, 1, '2024-04-01 09:00:00', '2024-03-25 00:00:00', 'Art fair', 'New York Art Fair'),
    (25, '2024-05-01 00:00:00', '2024-05-05 00:00:00', 2, 1, '2024-05-01 09:00:00', '2024-04-25 00:00:00', 'Job fair', 'Los Angeles Job Fair'),
    (30, '2024-06-01 00:00:00', '2024-06-05 00:00:00', 3, 1, '2024-06-01 09:00:00', '2024-05-25 00:00:00', 'Science fair', 'Chicago Science Fair'),
    (15, '2024-07-01 00:00:00', '2024-07-05 00:00:00', 4, 2, '2024-07-01 10:00:00', '2024-06-25 00:00:00', 'Music festival', 'Houston Music Festival'),
    (20, '2024-08-01 00:00:00', '2024-08-05 00:00:00', 5, 2, '2024-08-01 08:00:00', '2024-07-25 00:00:00', 'Food festival', 'Phoenix Food Festival'),
    (12, '2024-09-01 00:00:00', '2024-09-05 00:00:00', 1, 1, '2024-09-01 09:00:00', '2024-08-25 00:00:00', 'Technology expo', 'New York Tech Expo'),
    (18, '2024-10-01 00:00:00', '2024-10-05 00:00:00', 2, 1, '2024-10-01 09:00:00', '2024-09-25 00:00:00', 'Film festival', 'Los Angeles Film Festival'),
    (22, '2024-11-01 00:00:00', '2024-11-05 00:00:00', 3, 1, '2024-11-01 09:00:00', '2024-10-25 00:00:00', 'Literature festival', 'Chicago Lit Festival'),
    (16, '2024-12-01 00:00:00', '2024-12-05 00:00:00', 4, 2, '2024-12-01 10:00:00', '2024-11-25 00:00:00', 'Holiday charity', 'Houston Holiday Charity'),
    (14, '2025-01-01 00:00:00', '2025-01-05 00:00:00', 5, 2, '2025-01-01 09:00:00', '2024-12-25 00:00:00', 'New Year\''s event', 'Phoenix New Year Event'),
    (12, '2025-02-01 00:00:00', '2025-02-05 00:00:00', 1, 1, '2025-02-01 09:00:00', '2025-01-25 00:00:00', 'Valentine\''s charity', 'New York Valentine Charity'),
    (20, '2025-03-01 00:00:00', '2025-03-05 00:00:00', 2, 1, '2025-03-01 09:00:00', '2025-02-25 00:00:00', 'March madness', 'Los Angeles March Madness'),
    (10, '2025-04-01 00:00:00', '2025-04-05 00:00:00', 3, 1, '2025-04-01 09:00:00', '2025-03-25 00:00:00', 'April showers', 'Chicago April Showers');

INSERT INTO events_participants (events_id, users_id)
VALUES
    (1, 1),
    (2, 1);

-- Inserting data into posts table
INSERT INTO posts (was_edited, created_at, event_id, organization_id, updated_at, content)
VALUES
    (false, '2023-01-16 00:00:00', 1, 1, '2023-01-16 12:00:00', 'Central Park cleanup event details.'),
    (true, '2023-02-02 00:00:00', 2, 1, '2023-02-03 12:00:00', 'Hollywood Outreach event updated details.');


-- Commit the transaction
COMMIT;
