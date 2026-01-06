-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 06, 2026 at 06:13 PM
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
-- Database: `dirasa_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cartitem`
--

CREATE TABLE `cartitem` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `qty` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
('32550973-7e0e-4ebe-a28f-083eb52c90e8', 'Es Krim'),
('aeb67ed5-7bf0-4477-977c-0be0eef8a662', 'Makanan'),
('9c771d61-df67-495c-a6fc-737e66847269', 'Minuman');

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

CREATE TABLE `favorite` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorite`
--

INSERT INTO `favorite` (`id`, `userId`, `productId`) VALUES
('0520db02-776c-48f5-805c-bb0ea26a6167', '08b02742-d8ae-44e5-b15c-ee3efec8198b', '4fe94d23-f18a-413c-94de-fd54acc87423'),
('8ff588c3-9876-455f-90b2-66c213c9af65', '73aac8a9-fce7-42aa-9ac4-9f4c91526ff5', 'a211f118-56cf-43f7-bad1-e3be73cbfe26');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `totalPrice` int(11) NOT NULL,
  `status` enum('ANTRE','DIBUAT','DIANTAR','SELESAI','BATAL') NOT NULL DEFAULT 'ANTRE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `note` varchar(191) DEFAULT NULL,
  `tableNumber` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `userId`, `totalPrice`, `status`, `createdAt`, `updatedAt`, `note`, `tableNumber`) VALUES
('60585038-7179-46a9-af2f-4ee3b1825770', '08b02742-d8ae-44e5-b15c-ee3efec8198b', 10000, 'SELESAI', '2026-01-06 12:10:06.753', '2026-01-06 12:10:06.753', 'Es nya banyakin', '01'),
('a121b549-a75f-4ec5-8636-afde0b4d86b7', '73aac8a9-fce7-42aa-9ac4-9f4c91526ff5', 15000, 'SELESAI', '2026-01-06 16:10:12.963', '2026-01-06 16:10:12.963', NULL, '05'),
('e7fc31b8-09a2-4091-ba7d-ba4f756ef3dd', 'd8b0e6fb-c5b9-410e-9c5c-ba5d754272e7', 15000, 'BATAL', '2026-01-06 16:57:52.553', '2026-01-06 16:57:52.553', 'Gapake es', '08');

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `qty` int(11) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderitem`
--

INSERT INTO `orderitem` (`id`, `orderId`, `productId`, `qty`, `price`) VALUES
('02381dad-1ddd-4084-857c-2ab47841134f', '60585038-7179-46a9-af2f-4ee3b1825770', '4fe94d23-f18a-413c-94de-fd54acc87423', 2, 5000),
('3dc3f666-07c6-4cb5-9922-47c53aed8396', 'e7fc31b8-09a2-4091-ba7d-ba4f756ef3dd', 'a211f118-56cf-43f7-bad1-e3be73cbfe26', 1, 10000),
('4bf4bd4d-2fe4-48f1-84ee-6715694fe7c7', 'a121b549-a75f-4ec5-8636-afde0b4d86b7', '4fe94d23-f18a-413c-94de-fd54acc87423', 3, 5000),
('7bcb5a9d-e9fd-4414-82a1-5e3e79895c9d', 'e7fc31b8-09a2-4091-ba7d-ba4f756ef3dd', '4fe94d23-f18a-413c-94de-fd54acc87423', 1, 5000);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `price` double NOT NULL,
  `stock` int(11) NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `description` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `price`, `stock`, `categoryId`, `createdAt`, `updatedAt`, `description`, `image`) VALUES
('4fe94d23-f18a-413c-94de-fd54acc87423', 'Es Teh Manis', 5000, 100, '9c771d61-df67-495c-a6fc-737e66847269', '2026-01-05 14:27:46.086', '2026-01-05 14:27:46.086', 'Sensasi segar dimulut, nyaman dilambung', 'image-1767712110238-153795461.jpg'),
('a211f118-56cf-43f7-bad1-e3be73cbfe26', 'Mie Ayam', 10000, 100, 'aeb67ed5-7bf0-4477-977c-0be0eef8a662', '2026-01-06 16:11:33.070', '2026-01-06 16:11:33.070', 'Madep', 'image-1767715892988-100718177.jfif');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
('08b02742-d8ae-44e5-b15c-ee3efec8198b', 'meowing@gmail.com', '$2b$10$1uoQkm2LHvzkNkri45IdEeoFVqr8s/56i4BAcgfvZokL66CkJpV46', 'Meowing', 'USER', '2026-01-06 11:30:17.880', '2026-01-06 11:30:17.880'),
('73aac8a9-fce7-42aa-9ac4-9f4c91526ff5', 'meow@gmail.com', '$2b$10$rXmYCJCJkOPlAfv6XWfLf.uJaMvC29KCTTNmCAv4hLj0eXcHpUZ9u', 'si meow', 'USER', '2026-01-06 16:09:21.204', '2026-01-06 16:09:21.204'),
('d8b0e6fb-c5b9-410e-9c5c-ba5d754272e7', 'admin@dirasa.com', '$2b$10$BUTUrP08LnnZCfzEUOzrKuDe20AsWFb03qKVQPgvAoMIcnzYFfF.q', 'Admin Dirasa', 'ADMIN', '2026-01-05 13:55:45.044', '2026-01-05 13:55:45.044');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('0be61e6b-e9cb-41d7-b7c6-5bfa30b59753', '3ce5ad5a20a7d9fd5269e1b3407e63fd8152391df7e1d307169a8824b0280eab', '2026-01-06 16:36:30.096', '20260106163629_add_note_and_table', NULL, NULL, '2026-01-06 16:36:30.057', 1),
('136a94ec-dc2b-4f5c-a851-14d36f0d2072', '2a5828e4ccc234fa7421555f32c378d8e38d4c184a37f6b239504faf66109867', '2026-01-06 14:08:21.051', '20260106140820_add_cascade_delete', NULL, NULL, '2026-01-06 14:08:20.788', 1),
('726e78d5-89cf-4609-9dad-da67afa98d01', 'aa5420cd145aad9c3fe82b20c1c797d88bf4aa0845f1d6881e42827c9ed29ce5', '2026-01-06 12:59:55.294', '20260106125954_add_image_to_product', NULL, NULL, '2026-01-06 12:59:55.087', 1),
('b7909671-520a-402c-bfc7-badb64d2a8cb', '832b5b42ac0a3e528fbd69bda711bdac1ee0fe5395e869d8d6d9177b99ee76c4', '2026-01-01 09:20:29.514', '20260101092028_initial_migration', NULL, NULL, '2026-01-01 09:20:28.954', 1),
('df40f573-4da2-4112-ae63-cde63b57217b', '38a64c12ff096f0b469d36047e0cfc2056b8f41afe12fb3a4cd6e03ae25aa25f', '2026-01-06 15:58:02.439', '20260106155802_add_new_status_order', NULL, NULL, '2026-01-06 15:58:02.370', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CartItem_userId_fkey` (`userId`),
  ADD KEY `CartItem_productId_fkey` (`productId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_name_key` (`name`);

--
-- Indexes for table `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Favorite_userId_productId_key` (`userId`,`productId`),
  ADD KEY `Favorite_productId_fkey` (`productId`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_userId_fkey` (`userId`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_fkey` (`orderId`),
  ADD KEY `OrderItem_productId_fkey` (`productId`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `CartItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `Favorite_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
