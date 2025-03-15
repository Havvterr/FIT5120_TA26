CREATE DATABASE IF NOT EXISTS uv_defender;

USE uv_defender;

CREATE TABLE IF NOT EXISTS australian_postcodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postcode VARCHAR(4) NOT NULL,
  suburb VARCHAR(255) NOT NULL,
  state VARCHAR(3) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  UNIQUE KEY unique_postcode (postcode)
);

-- Clear existing data
TRUNCATE TABLE australian_postcodes;