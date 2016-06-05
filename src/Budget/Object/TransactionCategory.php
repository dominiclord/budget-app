<?php

namespace Budget\Object;

use \DateTime;
use \Exception;
use \InvalidArgumentException;

use \Pimple\Container;

// Dependencies from `charcoal-core`
use \Charcoal\Model\AbstractModel;

// Dependencies from 'charcoal-base'
use \Charcoal\Object\CategoryInterface;
use \Charcoal\Object\CategoryTrait;

use \Budget\Object\Transaction;

use \Budget\Support\Traits\PublicDataTrait;
use \Budget\Support\Interfaces\PublicDataInterface;

/**
 * Transaction category Taxonomy
 *
 * ## Properties from {@see \Charcoal\Object\CategoryTrait}
 *
 * @var string     $categoryItemType
 * @var integer    $categoryItemCount
 * @var Collection $categoryItems
 */
class TransactionCategory extends AbstractModel implements
    CategoryInterface,
    PublicDataInterface
{
    use CategoryTrait;
    use PublicDataTrait;

    /**
     * Determine how many items in this category.
     *
     * @return integer
     */
    public function numCategoryItems()
    {
        # return parent::numCategoryItems();
        return (integer)$this->category_item_count;
    }

    /**
     * Load the category's items.
     *
     * @return Transaction[]|Collection
     */
    public function loadCategoryItems()
    {
        return $this->collection('budget/object/transaction')
            ->addFilter('active', true)
            ->addFilter([
                'property'  => 'category',
                'val'       => $this->id(),
                'operator'  => 'FIND_IN_SET'
            ])
            ->load();
    }
}
