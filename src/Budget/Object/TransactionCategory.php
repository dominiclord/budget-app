<?php

namespace Budget\Object;

use \InvalidArgumentException;
use \Exception;

// Dependencies from 'charcoal-base'
use \Charcoal\Object\CategoryInterface;
use \Charcoal\Object\CategoryTrait;
use \Charcoal\Object\Content;

use \Budget\Object\Transaction;

/**
 * Transaction category Taxonomy
 *
 * ## Properties from {@see \Charcoal\Object\CategoryTrait}
 *
 * @var string     $categoryItemType
 * @var integer    $categoryItemCount
 * @var Collection $categoryItems
 *
 * ------------
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
class TransactionCategory extends Content implements
    CategoryInterface
{
    use CategoryTrait;

// From CategoryTrait
// ==========================================================================

    /**
     * Determine how many items in this category.
     *
     * @return integer
     */
    public function numCategoryItems()
    {
        # return parent::numCategoryItems();
        return (integer) $this->category_item_count;
    }

    /**
     * Load the service's items.
     *
     * @return Transaction[]|Collection
     */
    public function loadCategoryItems()
    {
        $factory = $this->factory();
        $item    = $factory->create(Transaction::class);

        $loader = $this->createCollectionLoader();
        $loader->setModel($item);
        $loader->addFilter('active', true);
        $loader->addFilter([
            'property'  => 'category',
            'val'       => $this->id(),
            'operator'  => 'FIND_IN_SET'
        ]);

        return $loader->load();
    }
}