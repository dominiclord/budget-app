<?php
/**
* Base class
* Every object on the website should extend this
* This will take care of datas, constructor, etc.
*
* @author Benjamin Roch <roch.bene@gmail.com>
* @author Dominic Lord <dlord@outlook.com>
* @copyright 2015
* @version 2015-11-26
* @since Version 2015-11-26
*/

namespace Utils;

use \PDO;

class Base {

	private $_data;
	private $_properties;
	private $_cfg;


	/**
	 * Keep DATAbase connection
	 * @var [NotORM]
	 */
	public static $_db; // == PDO
	public static $_notorm;
	public static $_schema;

	public function __construct( $data = null )
	{
		if ($data) {
			$this->set_data( $data );
		}
		$this->_load_meta();

	}

	/**
	* Automatically gets a JSON metadata file
	* if it exists.
	* JSON must respect the SRC path within the META folder
	* @return $this (chainable)
	*/
	private function _load_meta()
	{
		$class = get_class($this);
		$path = '../meta' . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, strtolower($class)) . '.json';

		$this->_cfg = [];
		$this->_properties = [];

		if (file_exists($path)) {
			$content = file_get_contents($path);
			$cfg = json_decode($content,true);
			$this->_cfg = $cfg;

			if (isset($cfg['properties'])) {
				$this->_prepare();
			}
		}

		return $this;
	}

	/**
	* Returns the content of the meta.
	* Or false if no JSON was specified
	* @return Object config (JSON) || false
	*/
	public function cfg()
	{
		return $this->_cfg;
	}

	/**
	* Prepare the object with given properties
	* Set default values
	* @return $this (chainable)
	*/
	private function _prepare()
	{
		$cfg = $this->cfg();

		if (isset($cfg['properties'])) {
			$this->_properties = array_keys( $cfg['properties'] );

			$defaults = isset($cfg['defaults']) ? $cfg['defaults'] : [];
			$this->from_flat_data($defaults);

		}

		return $this;
	}

	public function properties()
	{
		return $this->_properties;
	}

	/**
	* Sets data from an associative array
	* @param Object [ key => value ]
	* @return $this (chainable)
	*/
	public function from_flat_data( $object )
	{
		if (!$object) {
			return $this;
		}

		if (!is_array($object)) {
			return $this;
		}

		foreach ($object as $key => $val) {
			if ($key == $this->key() && $this->id()) {
				continue;
			}
			$this->{$key} = $val;
		}

		return $this;
	}

	/**
	* Should we merge?
	* If 2 arguments, first argument should be a key, second
	* argument should be the data to that key.
	* Example:
	* $obj->set_data( [ 'blabla' => 'very cool text' ] )
	* $obj->set_data( 'blabla', 'very cool text' );
	*
	* @param $key Key in data array
	* @param $data Actual datas
	* @return $this (chainable)
	*/
	public function set_data( )
	{
		$num = func_num_args();

		if ($num <= 0) {
			return $this;
		}

		if ($num >= 2) {
			$data = func_get_arg( 1 );
			$key = func_get_arg( 0 );
			$this->_data[ $key ] = $data;
			return $this;
		}

		$data = func_get_arg( 0 );
		$this->_data = $data;

		return $this;
	}

	public function data($key=null)
	{
		if (!$key) {
			return $this->_data;
		}

		if (!isset($this->_data[ $key ])) {
			return false;
		}

		return $this->_data[ $key ];
	}

	/**
	* Returns the ID of the object
	* as defined in the JSON (meta)
	* @return Mixed (String | Int)
	*/
	public function id()
	{
		if ($this->key()) {
			return $this->{$this->key()};
		}
		return false;
	}

	public function key()
	{
		$cfg = $this->cfg();
		if (isset($cfg['key'])) {
			return $cfg['key'];
		}
		// Default?
		return 'id';
	}

	/**
	* This should be move to a DB class.
	*/
	public function save()
	{
		$id = $this->id();

		if ($id) {
			$class = get_class( $this );
			$proto = new $class;
			$proto->load( $id );
			if ($proto->id()) {
				return $this->update();
			}
		}

		$data = $this->data();

		$sql = 'INSERT INTO `'.$this->_table().'` (';

		$props = [];
		$vals = [];

		foreach ($data as $key => $val) {
			$props[] = '`'.$key.'`';
			$vals[] = '\''.$val.'\'';
		}

		$sql .= implode(', ',$props) . ')';
		$sql .= ' VALUES (' . implode(', ', $vals) . ')';

		$db = self::db();
		return $db->query( $sql );

	}

	public function update()
	{
		$data = $this->data();
		$id = $this->id();
		$key = $this->key();

		$class = get_class( $this );
		$proto = new $class;
		$proto->load( $id );
		if (!$proto->id()) {
			return false;
		}

		// Failed.
		if (!$id) {
			return false;
		}

		$sql = 'UPDATE `'.$this->_table().'` SET ';

		$vals = [];
		foreach ($data as $key => $val) {
			// Dont change ID.
			if ($key == $this->key()) {
				continue;
			}
			$vals[] = '`'.$key.'` = \''.$val.'\'';
		}
		$sql .= implode(', ', $vals);
		$sql .= ' WHERE `'.$this->key().'` = \''.$this->id().'\'';

		$db = self::db();
		return $db->query( $sql );
	}

	/**
	*
	*/
	public function load( $id )
	{
		if (!$id) {
			return $this;
		}

		if (!$this->key()) {
			return $this;
		}

		$sql = 'SELECT * FROM `'.$this->_table().'` WHERE '.$this->key().' = \''.$id.'\'';
		$db = self::db();
		$query = $db->query( $sql );

		$data = $query->fetchAll(PDO::FETCH_ASSOC);

		// Else, it didn't work...
		if (isset($data[0])) {
			$this->from_flat_data( $data[ 0 ] );
		}

		return $this;

	}


	/**
	* Magic getter and setter
	* Uses the set_data and data function
	* You can $obj->test = value, which will results as:
	* $obj->set_data( 'test', value )
	* @return value
	* @return $this
	*/
	public function __get( $key ) {
		return $this->data( $key );
	}

	public function __set( $key, $val ) {
		$this->set_data( $key, $val );
		return $this;
	}





	/**
	* Keeps a copy of the link to the DB
	* Static function used to prevent multiple DB instances
	* @return PDO object
	*/
	public static function db()
	{
		if (!self::$_db) {
			$cfg = include '../config.php';
			$str = 'mysql:dbname='.$cfg['database'].';host:'.$cfg['host'];
			$pass = $cfg['password'];
			$username = $cfg['username'];

			$pdo = new PDO($str, $username, $pass);

			self::$_db = $pdo;
		}

		return self::$_db;
	}

	/**
	* NotORM to deal easily with some queries
	* This is mainly for legacy support and might be removed
	* @return NotORM Object
	*/
	public static function notorm()
	{
		if (!self::$_notorm) {
			$pdo = self::db();
			self::$_notorm = new \NotORM( $pdo );
		}

		return self::$_notorm;
	}


	/**
	* MEans EVERY object should have a static table function
	* Unless they aren't meant to be in DB
	* @return String table name
	*/
	private function _table()
	{
		return static::table();
	}


	/**
	* Table schema, is needed
	*/
	public static function schema()
	{
		if (!self::$_schema) {
			$db = self::db();
			$sql = 'SHOW TABLES';
			$query = $db->query( $sql );
			self::$_schema = $query->fetchAll(PDO::FETCH_COLUMN);
		}
		return self::$_schema;
	}

	/**
	* Check if table exists in schema
	* If not, create it as wisely as you can
	* @return $this (chainable)
	*/
	public function create_table()
	{
		$schema = self::schema();
		// If table dont exist already
		if (!in_array($this->_table(), $schema)) {
			$cfg = $this->cfg();
			$properties = $this->properties();

			$sql = 'CREATE TABLE '.$this->_table().' (';

			$i = 0;
			$c = count($properties);
			$types = [];
			for (; $i<$c; $i++) {
				$types[] = '`'.$properties[ $i ].'` '.$this->get_property_type( $properties[ $i ] ) .' NOT NULL';
			}

			if (isset($cfg['key'])) {
				$types[] = 'UNIQUE (`'.$cfg['key'].'`)';
				$types[] = 'PRIMARY KEY (`'.$cfg['key'].'`)';
			}
			$sql .= implode(', ', $types);

			$sql .= ') ENGINE=InnoDB DEFAULT CHARSET=utf8';

			$db = self::db();
			$db->query( $sql );
		}

		return $this;
	}

	/**
	* @param String $prop
	*/
	public function get_property_type( $prop )
	{
		if (!$prop) {
			return 'varchar(255)';
		}

		$cfg = $this->cfg();

		if (!isset($cfg['properties']) || !isset($cfg['properties'][ $prop ])) {
			return 'varchar(255)';
		}

		$property = $cfg['properties'][$prop];

		$type = isset($property['type']) ? $property['type'] : 'string';

		switch ($type) {

			case 'string':
				return 'varchar(255)';
				break;
			case 'integer':
			case 'int':
			case 'number':
				return 'int(11)';
				break;
			default:
				return 'varchar(255)';

		}

		return 'varchar(255)';

	}

}
