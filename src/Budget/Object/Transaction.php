<?php

namespace Budget\Object;

use \InvalidArgumentException;
use \Exception;

// Dependency from 'charcoal-core'
use \Charcoal\Model\Collection;

// Dependency from 'charcoal-base'
use \Charcoal\Object\Content;

use \Budget\Object\TransactionCategory;

/**
 *
 * ## Properties from {@see \Charcoal\Core\IndexableTrait}
 *
 * @var mixed $id
 *
 * ------------
 *
 * ## Properties from {@see \Charcoal\Object\Content}
 *
 * @var boolean        $active
 * @var integer        $position
 * @var DateTime       $created
 * @var integer|string $createdBy
 * @var DateTime       $lastModified
 * @var integer|string $lastModifiedBy
 */
class Transaction extends Content
{

// Describable Properties
// ==========================================================================

    protected $category;
    protected $amount;
    protected $description;
    protected $creation_date;
    protected $modified_date;

    public function category()
    {
        return $this->category;
    }

    public function setCategory($value)
    {
        // $this->categories = array_map('intval', $this->parseMultiple($values));
        $this->category = $value;

        return $this;
    }
}