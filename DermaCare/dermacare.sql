-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2026 at 04:47 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dermacare`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `treatment_id` int(11) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` varchar(20) DEFAULT 'scheduled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `client_id`, `staff_id`, `treatment_id`, `appointment_date`, `appointment_time`, `status`) VALUES
(1, 1, 1, 1, '2026-04-14', '10:00:00', 'scheduled'),
(2, 2, 2, 3, '2026-04-15', '11:30:00', 'scheduled'),
(3, 3, 1, 5, '2026-04-16', '09:00:00', 'completed'),
(4, 4, 3, 2, '2026-04-17', '14:00:00', 'scheduled'),
(5, 5, 2, 4, '2026-04-18', '13:00:00', 'cancelled'),
(6, 1, 3, 6, '2026-04-19', '15:30:00', 'scheduled');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `skin_type` enum('dry','oily','combination','normal','sensitive') DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`client_id`, `first_name`, `last_name`, `email`, `phone`, `date_of_birth`, `gender`, `skin_type`, `password_hash`, `created_at`) VALUES
(1, 'Norah', 'Bin Salamah', 'Norah@gmail.com', '0551234567', '2000-05-12', 'female', 'oily', 'hash1', '2026-04-10 20:51:29'),
(2, 'Sara', 'Almuraibidh', 'Sara@hotmail.com', '0559876543', '2001-11-03', 'female', 'dry', 'hash2', '2026-04-10 20:51:29'),
(3, 'Danyah', 'Alsabti', 'Danyah@gmail.com', '0562223344', '2003-02-20', 'female', 'combination', 'hash3', '2026-04-10 20:51:29'),
(4, 'Sitah', 'Alsemmari', 'Sitah@gmail.com', '0538899001', '2004-09-28', 'female', 'sensitive', 'hash5', '2026-04-10 20:51:29'),
(5, 'Fahad', 'AlMutairi', 'fahad@hotmail.com', '0545566778', '1990-07-15', 'male', 'normal', 'hash4', '2026-04-10 20:51:29');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `first_name`, `last_name`, `role`, `email`, `phone`, `status`) VALUES
(1, 'Lina', 'Ahmed', 'Dermatologist', 'lina@dermacare.com', '0501111111', 'active'),
(2, 'Maha', 'Saleh', 'Laser Technician', 'maha@dermacare.com', '0502222222', 'active'),
(3, 'Noor', 'Ali', 'Medical Aesthetician', 'noor@dermacare.com', '0503333333', 'active'),
(4, 'Reem', 'Omar', 'Consultant', 'reem@dermacare.com', '0504444444', 'active'),
(5, 'Sara', 'Khalid', 'Dermatologist', 'sara@dermacare.com', '0505555555', 'active'),
(6, 'Haifa', 'Bader', 'Aesthetician', 'haifa@dermacare.com', '050333988893', 'active'),
(7, 'Alia', 'Ahmed', 'Nurse', 'alia@dermacare.com', '0503336733', 'active'),
(8, 'Fahda', 'Faisal', 'Nurse', 'fahda@dermacare.com', '0503883333', 'active'),
(9, 'Asma', 'Osama', 'Nurse', 'asma@dermacare.com', '050322333', 'active'),
(10, 'Hala', 'Ibrahim', 'Nurse', 'hala@dermacare.com', '050320033', 'active'),
(11, 'Hessa', 'Fahad', 'Receptionist', 'hessa@dermacare.com', '0503377333', 'active'),
(12, 'Lujain', 'Saad', 'Receptionist', 'lujain@dermacare.com', '0503339933', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `treatments`
--

CREATE TABLE `treatments` (
  `treatment_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `treatments`
--

INSERT INTO `treatments` (`treatment_id`, `name`, `description`, `price`, `duration`) VALUES
(1, 'Acne Treatment', 'Treatment for acne and pimples', 80.00, 45),
(2, 'Anti Aging Facial', 'Reduces wrinkles and fine lines', 95.00, 60),
(3, 'Hydration Therapy', 'Deep hydration for dry skin', 110.00, 60),
(4, 'Pigmentation Treatment', 'Treats dark spots and uneven skin tone', 100.00, 50),
(5, 'Chemical Peel Treatment', 'Removes dead skin and improves texture', 90.00, 55),
(6, 'Deep Cleansing Facial', 'Removes dirt and oil from skin', 85.00, 50),
(7, 'Brightening Facial', 'Improves skin glow', 90.00, 50);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `treatment_id` (`treatment_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `treatments`
--
ALTER TABLE `treatments`
  ADD PRIMARY KEY (`treatment_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `treatments`
--
ALTER TABLE `treatments`
  MODIFY `treatment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`),
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`treatment_id`) REFERENCES `treatments` (`treatment_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
