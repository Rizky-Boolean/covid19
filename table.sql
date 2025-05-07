CREATE DATABASE covid19
    DEFAULT CHARACTER SET = 'utf8mb4';

USE covid19;


CREATE TABLE regions(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    iso VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_iso (iso)
);


CREATE TABLE provinces (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    iso VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    lat VARCHAR(100),
    `long` VARCHAR(100),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE reports (
    reports_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `date` DATE NOT NULL,
    confirmed INT DEFAULT 0,
    deaths INT DEFAULT 0,
    recovered INT DEFAULT 0,
    confirmed_diff INT DEFAULT 0,
    deaths_diff INT DEFAULT 0,
    recovered_diff INT DEFAULT 0,
    last_update DATETIME,
    active INT DEFAULT 0,
    active_diff INT DEFAULT 0,
    fatality_rate DECIMAL(5,4) DEFAULT 0.0000,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE reports_region (
    reports_region_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    reports_id INT NOT NULL,
    iso VARCHAR(20) NOT NULL,
    region_name VARCHAR(100),
    province VARCHAR(100),
    lat VARCHAR(100),
    `long` VARCHAR(100),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reports_id) REFERENCES reports(reports_id) ON DELETE CASCADE
);


CREATE TABLE reports_region_cities (
    reports_region_cities_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    reports_id INT NOT NULL,
    reports_region_id INT NOT NULL,
    city_name VARCHAR(100),
    fips VARCHAR(20),
    lat VARCHAR(100),
    `long` VARCHAR(100),
    confirmed INT DEFAULT 0,
    deaths INT DEFAULT 0,
    confirmed_diff INT DEFAULT 0,
    deaths_diff INT DEFAULT 0,
    last_update DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reports_id) REFERENCES reports(reports_id) ON DELETE CASCADE,
    FOREIGN KEY (reports_region_id) REFERENCES reports_region(reports_region_id) ON DELETE CASCADE
);


