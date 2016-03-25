<?php
/**
 * Category
 * What type of transactions are you doing? This tells me about it
 *
 * @author Benjamin Roch <roch.bene@gmail.com>
 * @author Dominic Lord <dlord@outlook.com>
 * @copyright 2015
 * @version 2015-11-26
 * @since Version 2015-11-26
 */

namespace Budget;

use \Utils\Base;

class TransactionCategory extends Base {

	public static function table()
	{
		return 'transactioncategories';
	}
}