-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-04-2025 a las 18:14:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `globalevent`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ecoviajes`
--

CREATE TABLE `ecoviajes` (
  `id` int(11) NOT NULL,
  `idEvento` int(11) DEFAULT NULL,
  `idUsuarioHuesped` int(11) DEFAULT NULL,
  `nombreEvento` varchar(150) DEFAULT NULL,
  `fechaEvento` date DEFAULT NULL,
  `tipoEvento` varchar(150) DEFAULT NULL,
  `numeroDeAsientos` int(11) DEFAULT NULL,
  `ubicacion` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `nombreEvento` varchar(100) DEFAULT NULL,
  `fechaEvento` date DEFAULT NULL,
  `tipoEvento` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `merchanevento`
--

CREATE TABLE `merchanevento` (
  `id` int(11) NOT NULL,
  `idEvento` int(11) DEFAULT NULL,
  `marcaEvento` varchar(100) DEFAULT NULL,
  `fechaPublicacion` date DEFAULT NULL,
  `productoEvento` varchar(100) DEFAULT NULL,
  `precioProducto` decimal(10,2) DEFAULT NULL,
  `nombreEvento` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `idEvento` int(11) DEFAULT NULL,
  `idUsuarioHuesped` int(11) DEFAULT NULL,
  `fechaPublicacion` date DEFAULT NULL,
  `ubicacion` varchar(150) DEFAULT NULL,
  `nombreEvento` varchar(150) DEFAULT NULL,
  `tipoEvento` varchar(150) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `nombreUsuario` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ecoviajes`
--
ALTER TABLE `ecoviajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idEvento` (`idEvento`),
  ADD KEY `idUsuarioHuesped` (`idUsuarioHuesped`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `merchanevento`
--
ALTER TABLE `merchanevento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idEvento` (`idEvento`);

--
-- Indices de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idEvento` (`idEvento`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ecoviajes`
--
ALTER TABLE `ecoviajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `merchanevento`
--
ALTER TABLE `merchanevento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ecoviajes`
--
ALTER TABLE `ecoviajes`
  ADD CONSTRAINT `ecoviajes_ibfk_1` FOREIGN KEY (`idEvento`) REFERENCES `eventos` (`id`),
  ADD CONSTRAINT `ecoviajes_ibfk_2` FOREIGN KEY (`idUsuarioHuesped`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `merchanevento`
--
ALTER TABLE `merchanevento`
  ADD CONSTRAINT `merchanevento_ibfk_1` FOREIGN KEY (`idEvento`) REFERENCES `eventos` (`id`);

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `publicaciones_ibfk_2` FOREIGN KEY (`idEvento`) REFERENCES `eventos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
