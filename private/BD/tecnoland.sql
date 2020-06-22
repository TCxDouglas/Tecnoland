-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-06-2020 a las 06:29:38
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tecnoland`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `avatares`
--

CREATE TABLE `avatares` (
  `idAvatar` int(11) NOT NULL,
  `nombreAvatar` char(15) COLLATE utf8_spanish2_ci NOT NULL,
  `urlAvatar` varchar(200) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `avatares`
--

INSERT INTO `avatares` (`idAvatar`, `nombreAvatar`, `urlAvatar`) VALUES
(1, 'soy batman', 'https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/soyBatman.png?alt=media&token=841bfe31-4c08-4892-a4b0-8f9b743a66c4'),
(2, 'elastigirl', 'https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/elastigirl.png?alt=media&token=432d6f6d-c0b8-4bb1-b612-3aedfc798cbf'),
(3, 'Wonder Woman', 'https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/wonderWoman.png?alt=media&token=1c1db6f3-7a56-44c6-88db-3637870a465e'),
(4, 'chico', 'https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/chico1.jpg?alt=media&token=28e3e4ea-fd92-4b09-9c61-603737db95ea'),
(5, 'ElCap', 'https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/elCap.png?alt=media&token=968c1ee6-6611-4c61-abbb-d09da691387a');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salas`
--

CREATE TABLE `salas` (
  `uidCreador` char(30) COLLATE utf8_spanish2_ci NOT NULL,
  `codigoSala` char(8) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `temas`
--

CREATE TABLE `temas` (
  `idTema` int(10) NOT NULL,
  `tema` char(50) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `descripcion` varchar(80) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `temas`
--

INSERT INTO `temas` (`idTema`, `tema`, `descripcion`) VALUES
(1, 'Google CardBoard', 'Aprende a construir tus propia'),
(2, 'Museo de la informatica', 'Aprende los inicios de la computacion mediante un viaje por el museo de El Salva'),
(3, 'Programacion Facilito', 'Aprende a programar'),
(4, 'Curso de OBS', 'Aprende a hacer Directos'),
(5, 'Software', 'Aprende que es el software y su importancia en el mundo informatico'),
(6, 'La computadora', 'Conoce las partes de una computadora y sus funciones'),
(7, 'Hardware', 'Aprende que es el Hardware y sus caracteristicas'),
(8, 'Inteligencia Artificial (IA)', 'Aprende como funciona la inteligencia Artificial y sus grandes aportes al mundo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `uid` char(30) COLLATE utf8_spanish2_ci NOT NULL,
  `displayname` char(25) COLLATE utf8_spanish2_ci NOT NULL,
  `email` char(25) COLLATE utf8_spanish2_ci NOT NULL,
  `fechanacimiento` date NOT NULL,
  `tipocuenta` char(7) COLLATE utf8_spanish2_ci NOT NULL,
  `conocimiento` char(12) COLLATE utf8_spanish2_ci NOT NULL DEFAULT 'basico'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `avatares`
--
ALTER TABLE `avatares`
  ADD PRIMARY KEY (`idAvatar`);

--
-- Indices de la tabla `temas`
--
ALTER TABLE `temas`
  ADD PRIMARY KEY (`idTema`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `avatares`
--
ALTER TABLE `avatares`
  MODIFY `idAvatar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `temas`
--
ALTER TABLE `temas`
  MODIFY `idTema` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
