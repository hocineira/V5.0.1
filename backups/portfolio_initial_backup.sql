/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: portfolio_db
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0+deb12u1-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `certifications`
--

DROP TABLE IF EXISTS `certifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `certifications` (
  `id` uuid NOT NULL,
  `name` varchar(255) NOT NULL,
  `issuer` varchar(255) NOT NULL,
  `status` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `credential_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certifications`
--

LOCK TABLES `certifications` WRITE;
/*!40000 ALTER TABLE `certifications` DISABLE KEYS */;
INSERT INTO `certifications` VALUES
('a73c643e-9a52-4a66-bd05-679dbc9df7c0','AWS Solutions Architect','Amazon Web Services','Obtenu','2023','Certification en architecture cloud AWS','https://aws.amazon.com/certification/certified-solutions-architect-associate/','2025-07-17 21:31:03','2025-07-17 21:31:03'),
('6ebd1554-b84b-4532-8501-abc9cab20bc1','Python Professional','Python Institute','Obtenu','2022','Certification avancée en développement Python','https://pythoninstitute.org/certification','2025-07-17 21:31:03','2025-07-17 21:31:03');
/*!40000 ALTER TABLE `certifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` uuid NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `read` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education`
--

DROP TABLE IF EXISTS `education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `education` (
  `id` uuid NOT NULL,
  `degree` varchar(255) NOT NULL,
  `school` varchar(255) NOT NULL,
  `period` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`skills`)),
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education`
--

LOCK TABLES `education` WRITE;
/*!40000 ALTER TABLE `education` DISABLE KEYS */;
INSERT INTO `education` VALUES
('99bb2f66-ad41-4099-9af2-bd16d7f0be8c','Licence en Informatique','Université Paris-Sud','2017-2020','Fondamentaux de l\'informatique et programmation','[\"C\", \"C++\", \"Algorithmes\", \"Math\\u00e9matiques\"]','2025-07-17 21:31:03','2025-07-17 21:31:03'),
('a3ac2bd8-26b3-45c0-8f64-e554cebd1b40','Master en Informatique','Université Paris-Saclay','2020-2022','Spécialisation en développement logiciel et architectures distribuées','[\"Python\", \"Java\", \"Architecture logicielle\", \"Base de donn\\u00e9es\"]','2025-07-17 21:31:03','2025-07-17 21:31:03');
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience`
--

DROP TABLE IF EXISTS `experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience` (
  `id` uuid NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `period` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `responsibilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`responsibilities`)),
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience`
--

LOCK TABLES `experience` WRITE;
/*!40000 ALTER TABLE `experience` DISABLE KEYS */;
INSERT INTO `experience` VALUES
('61d35c82-22e0-4b5a-b089-eeb1ddd6e074','Développeur Full Stack Senior','TechCorp France','2022 - Présent','Développement d\'applications web et mobiles pour des clients variés','[\"D\\u00e9veloppement d\'applications React/Vue.js\", \"Conception d\'APIs RESTful avec FastAPI\", \"Gestion de bases de donn\\u00e9es PostgreSQL\", \"D\\u00e9ploiement et maintenance sur AWS\", \"Encadrement d\'\\u00e9quipe de 3 d\\u00e9veloppeurs junior\"]','2025-07-17 21:31:03','2025-07-17 21:31:03'),
('99b4c9c8-c6bf-412d-9c8a-fef7ac290345','Développeur Frontend','WebAgency Paris','2020 - 2022','Création d\'interfaces utilisateur modernes et responsives','[\"D\\u00e9veloppement d\'interfaces React.js\", \"Int\\u00e9gration d\'APIs tierces\", \"Optimisation des performances\", \"Tests unitaires et d\'int\\u00e9gration\"]','2025-07-17 21:31:03','2025-07-17 21:31:03');
/*!40000 ALTER TABLE `experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_info`
--

DROP TABLE IF EXISTS `personal_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_info` (
  `id` uuid NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `avatar` text NOT NULL,
  `resume` text NOT NULL,
  `social` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`social`)),
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_info`
--

LOCK TABLES `personal_info` WRITE;
/*!40000 ALTER TABLE `personal_info` DISABLE KEYS */;
INSERT INTO `personal_info` VALUES
('b0f98981-271b-45ee-a1c7-8d187b09c336','Hocine IRATNI','Développeur Full Stack','Spécialiste en développement web moderne','Développeur passionné avec une expertise en technologies modernes comme React, Node.js, Python et les architectures cloud.','hocine.iratni@example.com','+33 6 12 34 56 78','Paris, France','data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCI+SEk8L3RleHQ+Cjwvc3ZnPgo=','https://example.com/resume.pdf','{\"linkedin\": \"https://linkedin.com/in/hocine-iratni\", \"github\": \"https://github.com/hocine-iratni\", \"twitter\": \"https://twitter.com/hocine_iratni\"}','2025-07-17 21:31:03','2025-07-17 21:31:03');
/*!40000 ALTER TABLE `personal_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procedures`
--

DROP TABLE IF EXISTS `procedures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `procedures` (
  `id` uuid NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content` text NOT NULL,
  `category` varchar(255) NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`tags`)),
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procedures`
--

LOCK TABLES `procedures` WRITE;
/*!40000 ALTER TABLE `procedures` DISABLE KEYS */;
INSERT INTO `procedures` VALUES
('e21d56eb-14b8-49e0-85f7-264d1bde9fed','Déploiement d\'une application React','Guide étape par étape pour déployer une application React sur AWS','\n# Déploiement d\'une application React sur AWS\n\n## Prérequis\n- Compte AWS configuré\n- Application React prête à déployer\n- AWS CLI installé\n\n## Étapes\n\n### 1. Build de l\'application\n```bash\nnpm run build\n```\n\n### 2. Configuration S3\n- Créer un bucket S3\n- Configurer l\'hébergement web statique\n- Télécharger les fichiers de build\n\n### 3. Configuration CloudFront\n- Créer une distribution CloudFront\n- Configurer les redirections\n- Attendre la propagation (15-20 minutes)\n\n### 4. Configuration du domaine\n- Configurer Route 53 si nécessaire\n- Ajouter les certificats SSL\n\n## Vérifications\n- Tester l\'application sur le domaine final\n- Vérifier la compression et la mise en cache\n- Tester sur différents navigateurs\n','Déploiement','[\"React\", \"AWS\", \"S3\", \"CloudFront\", \"D\\u00e9ploiement\"]','2025-07-17 21:31:03','2025-07-17 21:31:03'),
('40fb70f2-bbb6-4a21-a646-36909636db47','Configuration d\'une API FastAPI','Configuration complète d\'une API FastAPI avec authentification','\n# Configuration d\'une API FastAPI\n\n## Installation\n```bash\npip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt]\n```\n\n## Structure du projet\n```\napp/\n├── main.py\n├── models/\n├── routes/\n├── auth/\n└── database.py\n```\n\n## Configuration de base\n```python\nfrom fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\n\napp = FastAPI(title=\"Mon API\")\n\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=[\"*\"],\n    allow_credentials=True,\n    allow_methods=[\"*\"],\n    allow_headers=[\"*\"],\n)\n```\n\n## Authentification JWT\n- Configuration des clés secrètes\n- Middleware d\'authentification\n- Endpoints de login/logout\n\n## Tests\n```bash\npytest tests/\n```\n','Développement','[\"FastAPI\", \"Python\", \"API\", \"JWT\", \"Authentification\"]','2025-07-17 21:31:03','2025-07-17 21:31:03');
/*!40000 ALTER TABLE `procedures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` uuid NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `technologies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`technologies`)),
  `image` text NOT NULL,
  `category` varchar(255) NOT NULL,
  `date` varchar(100) NOT NULL,
  `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`highlights`)),
  `github_url` varchar(255) DEFAULT NULL,
  `demo_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES
('f2d74587-329d-480b-8a25-52c858682ef9','Application de Gestion de Tâches','Application collaborative pour la gestion de projets et tâches en équipe','[\"Vue.js\", \"Express.js\", \"MongoDB\", \"Socket.io\"]','data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRUNGREYxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE2Ij5BcHAgR2VzdGlvbiBUw6JjaGVzPC90ZXh0Pgo8L3N2Zz4=','Application Web','2023','[\"Collaboration temps r\\u00e9el\", \"Notifications push\", \"Dashboard analytique\", \"Export PDF\"]','https://github.com/hocine-iratni/task-manager','https://demo-tasks.example.com','2025-07-17 21:31:03','2025-07-17 21:31:03'),
('c9fbd164-2961-4388-8983-6d7def7980d5','Plateforme E-commerce','Développement d\'une plateforme e-commerce complète avec React et FastAPI','[\"React\", \"FastAPI\", \"PostgreSQL\", \"Stripe\", \"AWS\"]','data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE2Ij5Qcm9qZXQgRS1jb21tZXJjZTwvdGV4dD4KPC9zdmc+','Web Development','2024','[\"Paiement s\\u00e9curis\\u00e9\", \"Interface responsive\", \"Panel d\'administration\", \"API RESTful\"]','https://github.com/hocine-iratni/ecommerce-platform','https://demo-ecommerce.example.com','2025-07-17 21:31:03','2025-07-17 21:31:03');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill_categories`
--

DROP TABLE IF EXISTS `skill_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `skill_categories` (
  `id` uuid NOT NULL,
  `category` varchar(255) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill_categories`
--

LOCK TABLES `skill_categories` WRITE;
/*!40000 ALTER TABLE `skill_categories` DISABLE KEYS */;
INSERT INTO `skill_categories` VALUES
('7968ce74-eed0-4538-883d-749e51d90716','DevOps','[{\"name\": \"Docker\", \"level\": 85}, {\"name\": \"AWS\", \"level\": 80}, {\"name\": \"CI/CD\", \"level\": 83}, {\"name\": \"Kubernetes\", \"level\": 75}]','2025-07-17 21:31:03','2025-07-17 21:31:03'),
('690921aa-aa5e-4899-be6e-a286e21cfc78','Frontend','[{\"name\": \"React\", \"level\": 90}, {\"name\": \"Vue.js\", \"level\": 85}, {\"name\": \"TypeScript\", \"level\": 88}, {\"name\": \"HTML/CSS\", \"level\": 95}, {\"name\": \"Tailwind CSS\", \"level\": 92}]','2025-07-17 21:31:03','2025-07-17 21:31:03'),
('49ae2f80-cd94-4870-b868-f30d4af963ff','Backend','[{\"name\": \"Python\", \"level\": 95}, {\"name\": \"FastAPI\", \"level\": 90}, {\"name\": \"Node.js\", \"level\": 85}, {\"name\": \"PostgreSQL\", \"level\": 88}, {\"name\": \"MongoDB\", \"level\": 82}]','2025-07-17 21:31:03','2025-07-17 21:31:03');
/*!40000 ALTER TABLE `skill_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` uuid NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `avatar` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES
('d61132ba-5afd-49d7-bade-0a83ff5abec5','Marie Dubois','Chef de projet','TechCorp France','Hocine est un développeur exceptionnel. Sa capacité à résoudre des problèmes complexes et son approche collaborative font de lui un atout précieux pour toute équipe.','data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNFRDhGMzYiLz4KPHRleHQgeD0iMjUiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5NRDwvdGV4dD4KPC9zdmc+','2025-07-17 21:31:03','2025-07-17 21:31:03'),
('cfa76986-0f69-482f-bb93-c11060f402f5','Pierre Martin','Directeur Technique','WebAgency Paris','Hocine a démontré des compétences techniques solides et une grande capacité d\'adaptation. Son travail sur nos projets React a été remarquable.','data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiMzQjgyRjYiLz4KPHRleHQgeD0iMjUiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5QTTwvdGV4dD4KPC9zdmc+','2025-07-17 21:31:03','2025-07-17 21:31:03');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veille_content`
--

DROP TABLE IF EXISTS `veille_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `veille_content` (
  `id` uuid NOT NULL,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veille_content`
--

LOCK TABLES `veille_content` WRITE;
/*!40000 ALTER TABLE `veille_content` DISABLE KEYS */;
INSERT INTO `veille_content` VALUES
('b51fcd2f-ab05-451e-8acf-048de34bf170','juridique','RGPD et développement web','Le Règlement Général sur la Protection des Données (RGPD) impose des obligations importantes pour les développeurs web. Les points clés incluent : consentement explicite pour les cookies, droit à l\'oubli, portabilité des données, et notification des violations dans les 72 heures.','2025-07-17 21:31:03','2025-07-17 21:31:03'),
('b9341e01-5c1b-4375-8d69-77ecff7be861','technologique','Nouvelles fonctionnalités React 19','React 19 apporte des améliorations significatives en termes de performance et de développement. Les nouvelles fonctionnalités incluent : Server Components stables, Actions pour la gestion des formulaires, nouveaux hooks useOptimistic et useFormStatus, et des améliorations du compilateur React.','2025-07-17 21:31:03','2025-07-17 21:31:03');
/*!40000 ALTER TABLE `veille_content` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-17 21:33:14
