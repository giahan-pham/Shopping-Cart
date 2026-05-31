-- MySQL dump 10.13  Distrib 8.0.45, for macos15 (arm64)
--
-- Host: localhost    Database: record_store
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
--SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
--SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

--SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e06ca7a6-3271-11f1-932b-dc5f47437da9:1-395';

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,'2026-05-31 13:13:34'),(2,2,'2026-05-31 13:57:18'),(3,3,'2026-05-28 19:01:18'),(4,4,'2026-05-30 09:18:25'),(5,5,'2026-05-30 21:25:18'),(6,6,'2026-05-30 21:20:33'),(7,7,'2026-05-31 13:06:08'),(8,8,'2026-05-31 13:15:00'),(9,9,'2026-05-31 13:55:54');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartitem`
--

DROP TABLE IF EXISTS `cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `record_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `record_id` (`record_id`),
  CONSTRAINT `cartitem_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `cartitem_ibfk_2` FOREIGN KEY (`record_id`) REFERENCES `record` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitem`
--

LOCK TABLES `cartitem` WRITE;
/*!40000 ALTER TABLE `cartitem` DISABLE KEYS */;
INSERT INTO `cartitem` VALUES (4,3,5,1,'2026-05-28 19:01:18'),(9,5,7,1,'2026-05-30 21:25:16'),(20,2,5,1,'2026-05-31 13:03:47'),(35,2,12,1,'2026-05-31 13:57:09'),(37,2,10,1,'2026-05-31 13:57:17'),(38,2,7,1,'2026-05-31 13:57:18');
/*!40000 ALTER TABLE `cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `record`
--

DROP TABLE IF EXISTS `record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `artist` varchar(100) NOT NULL,
  `genre` varchar(50) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int NOT NULL,
  `release_year` int NOT NULL,
  `description` varchar(1000) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record`
--

LOCK TABLES `record` WRITE;
/*!40000 ALTER TABLE `record` DISABLE KEYS */;
INSERT INTO `record` VALUES (5,'Humbug','Arctic Monkeys','Alternative Rock',49.99,9,2009,'Third studio album by English rock band Arctic Monkeys.\n\nTracklist\nSide A:\nMy Propeller\nCrying Lightning\nDangerous Animals\nSecret Door\nPotion Approaching\n\nSide B:\nFire and the Thud\nCornerstone\nDance Little Liar\nPretty Visitors\nThe Jeweller\'s Hands','/static/records/42d426459d6246e7a57f6615a515c9c3.jpg','2026-05-28 14:56:01'),(7,'Is This It','The Strokes','Alternative Rock',59.99,20,2001,'A garage rock revival album with sharp guitar riffs, cool vocals, and a raw early-2000s sound.','/static/records/425dd34700a240f4ba81aee80975a806.jpg','2026-05-30 05:00:18'),(8,'East of the Sun, West of the Moon','a-ha','Pop',59.00,12,1990,'A polished synth-pop album by a-ha featuring atmospheric production and melodic vocals','/static/records/2019ecbccc02481ba0d69f58593e701c.jpg','2026-05-30 05:04:32'),(10,'Hybrid Theory','Linkin Park','Nu Metal',44.99,12,2000,'A defining nu metal album blending heavy guitars, rap-influenced vocals, electronic textures, and emotional intensity.','/static/records/9a6c6551dd324e15b80309e1d7dc60ff.jpg','2026-05-30 05:28:16'),(12,'Hunting high and low','a-ha','Synth-Pop',59.99,3,1985,'a-ha\'s debut album, featuring hit singles including \"Take on me\" and \"The sun always shines on TV\"\nSide A:\n1. Take On Me\n2. Train of Thought\n3. Hunting High and Low\n4. The Blue Sky\n5. Living a Boy\'s Adventure Tale\nSide B:\n1. The Sun Always Shines on T.V.\n2. And You Tell Me\n3. Love Is Reason\n4. I Dream Myself Alive\n5. Here I Stand and Face the Rain\"','/static/records/26b8ecc8a8a44c30b8b5332a89afc7f7.jpg','2026-05-30 20:57:45'),(13,'Four','One Direction','Pop',79.99,10,2014,'Fourth studio album of One Direction.\nSide A\nSteal My Girl\nReady to Run\nWhere Do Broken Hearts Go\nSide B\nGirl Almighty\nFool\'s Gold \nSide C \nNight Changes\nNo Control\nFireproof\nSide D\nSpaces\nStockholm Syndrome\nClouds','/static/records/36c3741d69a14b049cd2df18fae04978.jpg','2026-05-31 04:43:40'),(23,'Scoundrel Days','a-ha','Synth-Pop',39.99,12,1986,'A moody and atmospheric 1986 synth-pop classic from a-ha, Scoundrel Days blends dramatic vocals, icy keyboards, and cinematic production. Featuring standout tracks like “I’ve Been Losing You,” “Cry Wolf,” and “Manhattan Skyline,” this vinyl is perfect for fans of polished ’80s pop with a darker edge.\nTracklist\nSide A\nScoundrel Days\nThe Swing of Things\nI’ve Been Losing You\nOctober\nManhattan Skyline\nSide B\nCry Wolf\nWe’re Looking for the Whales\nThe Weight of the Wind\nMaybe, Maybe\nSoft Rains of April','/static/records/ae586e002cb146cd810df6c33e2e5d22.jpg','2026-05-31 13:58:41'),(25,'Nevermind','Nirvana','Grunge',23.45,1,1991,'','/static/records/fda49545ca8e415c822bf21b9edb3d1a.jpg','2026-05-31 14:09:00');
/*!40000 ALTER TABLE `record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_user_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2b$12$J62JoqSX6gBzLMKT1cIKCev1i/Aw7IzpfetPF6/D5eIEaes5cRAGy','admin','2026-05-28 12:16:52'),(2,'user','$2b$12$j5M6dy05DU91sjbOtw42EuTmxa28clFGp97SrYN/NoBPrqHDOvCoC','user','2026-05-28 12:26:01'),(3,'user2','$2b$12$WxPuOAp/rAl/.WpCaTjXHuuvl.yT736MzScf7/VnxSWWeKdRNJ4V.','user','2026-05-28 19:01:06'),(4,'customer','$2b$12$EX7qiJnkvTwCReOnkL/Xv.7byxDV7e7Ncw9bVMprqDR2q.tfasU5u','user','2026-05-30 09:18:25'),(5,'staff','$2b$12$Jz.35Vwd1x6opjdT/tlB/.H4UQvlBbAa3UA31wUU7C03Hli98xa8y','admin','2026-05-30 21:20:33'),(6,'manager','$2b$12$WaRK7JqfO9ij12Rtniv6vO7E5BEHu8gWWGBrnrqu..X0/AbOwliF2','admin','2026-05-30 21:20:33'),(7,'user3','$2b$12$ZB44e/qS1oRopQs1uA1yWOMOKB9q5.Ti45PXmLZ9LiLjwkeVOzji6','user','2026-05-31 13:06:08'),(8,'user4','$2b$12$k3X6z1f4a7dJaSVYATW1GOAcJouYiHrXRVtOvQP7CeBx4fExF0zMa','user','2026-05-31 13:14:27'),(9,'user5','$2b$12$VN7fJ/Xn.UQrtRNaYOiaB.ypiR2b9K/JMQUp6S0bMoOgqIQY4r3Qa','user','2026-05-31 13:22:32');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'record_store'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-31 21:54:01
