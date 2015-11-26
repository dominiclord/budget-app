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

class Base {

	private $_data;

	public function __construct( $data = null )
	{
		if ($data) {
			$this->set_data( $data );
		}
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
	* This should be move to a DB class.
	*/
	public function save()
	{

	}

	public function update()
	{

	}

}
