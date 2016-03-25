<?php

// Dependency from 'charcoal-core'
use \Charcoal\Model\Collection;
use \Charcoal\Loader\CollectionLoader;
use \Charcoal\Model\ModelFactory;

/**
 * Helper
 * Basic helper to handle all charcoal methods
 * easily and the same way throughout the website
 *
 */
class CharcoalHelper
{
    /**
     * Protos to be kept in an associative array
     * @var array $proto
     */
    protected $proto = [];

    /**
     * Store the collection instance for the current object
     *
     * @var Collection
     */
    private $collection;

    /**
     * Store the collection loader instance for the current object
     *
     * @var CollectionLoader
     */
    private $collectionLoader;

    /**
     * Store the factory instance for the current object
     *
     * @var ModelFactory
     */
    private $modelFactory;

    /**
     * Retrieve the object's model factory.
     *
     * @return ModelFactory
     */
    public function modelFactory()
    {
        if (!isset($this->modelFactory)) {
            $this->modelFactory = $this->createModelFactory();
        }

        return $this->modelFactory;
    }

    /**
     * Creates a model factory.
     *
     * @param  array $args Arguments for the ModelFactory.
     * @return ModelFactory
     */
    public function createModelFactory(array $args = null)
    {
        if (!isset($args)) {
            $args = [
                // 'logger' => $this->logger
            ];
        }

        $factory = new ModelFactory();
        $factory->setArguments($args);

        return $factory;
    }

    /**
     * Returns a model prototype
     * Not to be used when calling multiple object
     * instances.
     *
     * @param  [type] $objType [description]
     * @return [type]          [description]
     */
    public function proto($objType)
    {
        if (isset($this->proto[$objType])) {
            return $this->proto[$objType];
        }

        $this->proto[$objType] = $this->obj($objType);

        return $this->proto[$objType];
    }

    /**
     * Return new instance of objType no matter what
     *
     * @param  string $objType
     * @return {$objType}
     */
    public function obj($objType)
    {
        $factory = $this->modelFactory();
        $obj = $factory->create($objType, [
            // 'logger'=>$this->logger
        ]);

        // Make sure table exists
        $obj->source()->createTable();

        return $obj;
    }

    public function fetch_collection($objType)
    {
        $model = $this->obj($objType);
        $loader = $this->collectionLoader();
        $loader->setModel($model);
        return $loader;
    }

    /**
     * Retrieve the object's collection.
     *
     * @return Collection
     */
    public function collection()
    {
        if (!isset($this->collection)) {
            $this->collection = $this->createCollection();
        }

        return $this->collection;
    }

    /**
     * Creates a collection.
     *
     * @return Collection
     */
    public function createCollection()
    {
        return new Collection();
    }

    /**
     * Retrieve the object's collection.
     *
     * @return CollectionLoader
     */
    public function collectionLoader()
    {
        if (!isset($this->collectionLoader)) {
            $this->collectionLoader = $this->createCollectionLoader();
        }

        return $this->collectionLoader;
    }

    /**
     * Creates a collection loader.
     *
     * @param  array $args Arguments for the ModelFactory.
     * @return CollectionLoader
     */
    public function createCollectionLoader(array $args = null)
    {
        if (!isset($args)) {
            $args = [
                // 'logger' => $this->logger
            ];

            if (method_exists($this, 'modelFactory')) {
                $args['factory'] = $this->modelFactory();
            }
        }

        $loader = new CollectionLoader($args);

        return $loader;
    }

}
