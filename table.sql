-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 08, 2025 at 02:56 PM
-- Server version: 8.0.40
-- PHP Version: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `covid19`
--

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE `provinces` (
  `id` int NOT NULL,
  `iso` varchar(20) NOT NULL,
  `province` varchar(100) NOT NULL,
  `lat` varchar(100) DEFAULT NULL,
  `long` varchar(100) DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `id` int NOT NULL,
  `iso` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `reports_id` int NOT NULL,
  `date` date NOT NULL,
  `confirmed` int DEFAULT '0',
  `deaths` int DEFAULT '0',
  `recovered` int DEFAULT '0',
  `confirmed_diff` int DEFAULT '0',
  `deaths_diff` int DEFAULT '0',
  `recovered_diff` int DEFAULT '0',
  `last_update` datetime DEFAULT NULL,
  `active` int DEFAULT '0',
  `active_diff` int DEFAULT '0',
  `fatality_rate` decimal(5,4) DEFAULT '0.0000',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports_region`
--

CREATE TABLE `reports_region` (
  `reports_region_id` int NOT NULL,
  `reports_id` int NOT NULL,
  `iso` varchar(20) NOT NULL,
  `region_name` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `lat` varchar(100) DEFAULT NULL,
  `long` varchar(100) DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports_region_cities`
--

CREATE TABLE `reports_region_cities` (
  `reports_region_cities_id` int NOT NULL,
  `reports_id` int NOT NULL,
  `reports_region_id` int NOT NULL,
  `city_name` varchar(100) DEFAULT NULL,
  `fips` varchar(20) DEFAULT NULL,
  `lat` varchar(100) DEFAULT NULL,
  `long` varchar(100) DEFAULT NULL,
  `confirmed` int DEFAULT '0',
  `deaths` int DEFAULT '0',
  `confirmed_diff` int DEFAULT '0',
  `deaths_diff` int DEFAULT '0',
  `last_update` datetime DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_iso` (`iso`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`reports_id`);

--
-- Indexes for table `reports_region`
--
ALTER TABLE `reports_region`
  ADD PRIMARY KEY (`reports_region_id`),
  ADD KEY `reports_id` (`reports_id`);

--
-- Indexes for table `reports_region_cities`
--
ALTER TABLE `reports_region_cities`
  ADD PRIMARY KEY (`reports_region_cities_id`),
  ADD KEY `reports_id` (`reports_id`),
  ADD KEY `reports_region_id` (`reports_region_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `provinces`
--
ALTER TABLE `provinces`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `regions`
--
ALTER TABLE `regions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `reports_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports_region`
--
ALTER TABLE `reports_region`
  MODIFY `reports_region_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports_region_cities`
--
ALTER TABLE `reports_region_cities`
  MODIFY `reports_region_cities_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reports_region`
--
ALTER TABLE `reports_region`
  ADD CONSTRAINT `reports_region_ibfk_1` FOREIGN KEY (`reports_id`) REFERENCES `reports` (`reports_id`) ON DELETE CASCADE;

--
-- Constraints for table `reports_region_cities`
--
ALTER TABLE `reports_region_cities`
  ADD CONSTRAINT `reports_region_cities_ibfk_1` FOREIGN KEY (`reports_id`) REFERENCES `reports` (`reports_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_region_cities_ibfk_2` FOREIGN KEY (`reports_region_id`) REFERENCES `reports_region` (`reports_region_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
