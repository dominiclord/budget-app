CREATE TABLE `transactions` (
  `id` varchar(40) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `timestamp_modified` int(11) NOT NULL,
  `category` varchar(128) NOT NULL,
  `description` varchar(128) NOT NULL,
  UNIQUE (`id`),
  PRIMARY KEY (`id`),
  KEY `timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
