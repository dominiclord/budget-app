<?php
/**
* Client Class
* This is the class that represents clients
* A client can be a store, or a label to describe
* where the money goes or come from. This prevents
* reentering clients
*
* @author Benjamin Roch <roch.bene@gmail.com>
* @author Dominic Lord <dlord@outlook.com>
* @copyright 2015
* @version 2015-11-26
* @since Version 2015-11-26
*/

namespace Budget;

use \Utils\Base;

class Client extends Base {

	public static function table()
	{
		return 'clients';
	}
}