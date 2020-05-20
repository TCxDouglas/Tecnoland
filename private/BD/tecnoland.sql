-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-05-2020 a las 20:34:24
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
-- Estructura de tabla para la tabla `temas`
--

CREATE TABLE `temas` (
  `idTema` int(10) NOT NULL,
  `tema` char(20) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `descripcion` varchar(30) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `temas`
--

INSERT INTO `temas` (`idTema`, `tema`, `descripcion`) VALUES
(1, 'Google CardBoard', 'Aprende a construir tus propia'),
(2, 'Historia de la Infor', 'Aprende los inicios de la comp'),
(3, 'Programacion Facilit', 'Aprende a programar'),
(4, 'Curso de OBS', 'Aprende a hacer Directos');

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
  `conocimiento` char(12) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`uid`, `displayname`, `email`, `fechanacimiento`, `tipocuenta`, `conocimiento`) VALUES
('GTPjJK40F7MTU70rlUWHaqpLBJY2', 'Soy un Docente', 'soyundocente@gmail.com', '2001-02-20', 'docente', ''),
('HJ5x6NbEbpTcDdrGm4vris38Spv1', 'Soy un Estudiante', 'soyunestudiante@gmail.com', '2001-01-20', 'normal', ''),
('Ztt0ncse34TkYRTVDLiiVB71r1K2', 'Douglas Hernandez', 'douglasalexander683@gmail', '2000-02-10', 'normal', ''),
('4X6sLHbN3jcR22zM5KqjR9vGeQg2', 'Douglas Hernandez', 'douglashappy2001@gmail.co', '2000-02-10', 'normal', ''),
('WWQ0FKRBCUbM0ocAooM9gKbUcRE2', 'Soy una prueba de testeo', 'testeo@gmail.com', '2004-06-09', 'normal', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `temas`
--
ALTER TABLE `temas`
  ADD PRIMARY KEY (`idTema`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `temas`
--
ALTER TABLE `temas`
  MODIFY `idTema` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
